// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract KewlKevinPuzzle is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    struct Coordinates {
        uint256 x;
        uint256 y;
    }

    struct Puzzle {
        uint256 seed;
        Coordinates[] obstacles;
        uint256 puzzleLength;
    }

    struct Game {
        Puzzle puzzle;
        address nftContractAddress;
        uint256 nftId;
    }

    Counters.Counter private supply;

    uint256 constant PUZZLE_WIDTH = 101;
    uint256 constant PUZZLE_HEIGHT = 101;

    Coordinates puzzleSize = Coordinates(PUZZLE_WIDTH, PUZZLE_HEIGHT);
    Coordinates entrance = Coordinates(51, 101);
    uint256 public mintPrice = 1 ether;

    uint256 public randomNumber = 50;

    uint256 constant UP = 0;
    uint256 constant RIGHT = 1;
    uint256 constant DOWN = 2;
    uint256 constant LEFT = 3;

    constructor() ERC721('Unsolved Kewl Kevin Puzzle', 'KKP') {}

    function collatzNext(uint256 x) internal pure returns (uint256 result) {
        if (x % 2 == 0) {
            return x / 2;
        }
        return 3 * x + 1;
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) return b;
        return a;
    }

    function _max(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) return a;
        return b;
    }

    function _subtractNoNegative(uint256 a, uint256 b)
        internal
        pure
        returns (uint256)
    {
        if (a > b) return a - b;
        return 0;
    }

    function _newDirection(uint256 direction, uint256 seed)
        internal
        pure
        returns (uint256)
    {
        uint256 directionTurn = seed % 2 == 1 ? 3 : 1;
        return (direction + directionTurn) % 4;
    }

    function _createObstacle(
        Coordinates memory cursor,
        uint256 direction,
        uint256 rawDistance
    ) internal pure returns (Coordinates memory) {
        uint256 distance = rawDistance % PUZZLE_HEIGHT;
        if (direction == UP) {
            return
                Coordinates(cursor.x, _subtractNoNegative(cursor.y, distance));
        }
        if (direction == DOWN) {
            return
                Coordinates(
                    cursor.x,
                    _min(PUZZLE_HEIGHT - 1, cursor.y + distance)
                );
        }
        if (direction == LEFT) {
            return
                Coordinates(_subtractNoNegative(cursor.x, distance), cursor.y);
        }
        return
            Coordinates(_min(PUZZLE_WIDTH - 1, cursor.x + distance), cursor.y);
    }

    function _bounceBackCursor(Coordinates memory obstacle, uint256 direction)
        internal
        pure
        returns (Coordinates memory)
    {
        if (direction == UP) {
            return
                Coordinates(
                    obstacle.x,
                    _min(PUZZLE_HEIGHT - 1, obstacle.y + 2)
                );
        }
        if (direction == DOWN) {
            return Coordinates(obstacle.x, _subtractNoNegative(obstacle.y, 2));
        }
        if (direction == LEFT) {
            return
                Coordinates(_min(PUZZLE_WIDTH - 1, obstacle.x + 2), obstacle.y);
        }
        return Coordinates(_subtractNoNegative(obstacle.x, 2), obstacle.y);
    }

    function _generatePuzzle(uint256 tokenId)
        internal
        pure
        returns (Puzzle memory)
    {
        Coordinates memory cursor = Coordinates(51, 101);
        uint256 direction = UP;
        Coordinates[] memory obstacles = new Coordinates[](64);

        uint256 collatzCurrent = tokenId;
        uint256 puzzleLength;

        for (
            puzzleLength = 0;
            puzzleLength < obstacles.length && collatzCurrent > 1;
            puzzleLength++
        ) {
            Coordinates memory newObstacle = _createObstacle(
                cursor,
                direction,
                collatzCurrent
            );
            obstacles[puzzleLength] = newObstacle;
            cursor = _bounceBackCursor(newObstacle, direction);
            collatzCurrent = collatzNext(collatzCurrent);
            direction = _newDirection(direction, collatzCurrent);
            collatzCurrent = collatzNext(collatzCurrent);
        }

        return Puzzle(tokenId, obstacles, puzzleLength);
    }

    function puzzle(uint256 tokenId) public view returns (Puzzle memory) {
        // require(_exists(tokenId), 'KKP: Puzzle does not exist.');
        return _generatePuzzle(tokenId + randomNumber);
    }

    function mint() public payable nonReentrant {
        require(
            msg.value >= mintPrice,
            'KKP: Amount of MATIC sent is incorrect.'
        );
        // TODO: require that player has Kewl Kevin NFT

        supply.increment();
        _safeMint(msg.sender, supply.current());
    }

    function burnAndClaimReward(uint256 tokenId, uint256[] memory movements)
        public
        virtual
    {
        require(_exists(tokenId), 'KKP: Puzzle does not exist.');
        require(
            ownerOf(tokenId) == msg.sender,
            'KKP: burning from incorrect owner'
        );
        // TODO: require that not more than 16 minutes has passed
        require(movements.length != 0, 'KKP: Solution required.');
        // TODO: require that movements do solve the puzzle
        _burn(tokenId);
        payable(msg.sender).transfer(1 ether);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
