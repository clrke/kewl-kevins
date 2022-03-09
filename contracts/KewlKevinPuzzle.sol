// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KewlKevinPuzzle is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    struct Coordinates {
        uint x;
        uint y;
    }

    struct Puzzle {
        uint seed;
        Coordinates[] obstacles;
        uint puzzleLength;
    }

    struct Game {
        Puzzle puzzle;
        address nftContractAddress;
        uint nftId;
    }

    Counters.Counter private supply;

    uint constant PUZZLE_WIDTH = 101;
    uint constant PUZZLE_HEIGHT = 101;

    Coordinates puzzleSize = Coordinates(PUZZLE_WIDTH, PUZZLE_HEIGHT);
    Coordinates entrance = Coordinates(51, 101);
    uint public mintPrice = 1 ether;

    uint256 public randomNumber = 5;

    uint256 constant UP = 0;
    uint256 constant RIGHT = 1;
    uint256 constant DOWN = 2;
    uint256 constant LEFT = 3;


    constructor() ERC721("Unsolved Kewl Kevin Puzzle", "KKP") {}

    function collatzNext(uint x) internal pure returns (uint result) {
        if (x % 2 == 0) {
            return x / 2;
        }
        return 3 * x + 1;
    }

    function _min(uint a, uint b) internal pure returns (uint) {
        if (a > b) return b;
        return a;
    }

    function _max(uint a, uint b) internal pure returns (uint) {
        if (a > b) return a;
        return b;
    }

    function _subtractNoNegative(uint a, uint b) internal pure returns (uint) {
        if (a > b) return a - b;
        return 0;
    }

    function _newDirection(uint direction, uint seed) internal pure returns (uint) {
        uint directionTurn = seed % 2 == 1? 3 : 1;
        return (direction + directionTurn) % 4;
    }

    function _createObstacle(Coordinates memory cursor, uint direction, uint rawDistance) internal pure returns (Coordinates memory) {
        uint distance = rawDistance % PUZZLE_HEIGHT;
        if (direction == UP) {
            return Coordinates(cursor.x, _subtractNoNegative(cursor.y, distance));
        }
        if (direction == DOWN) {
            return Coordinates(cursor.x, _min(PUZZLE_HEIGHT - 1, cursor.y + distance));
        }
        if (direction == LEFT) {
            return Coordinates(_subtractNoNegative(cursor.x, distance), cursor.y);
        }
        return Coordinates(_min(PUZZLE_WIDTH - 1, cursor.x + distance), cursor.y);
    }

    function _bounceBackCursor(Coordinates memory obstacle, uint direction) internal pure returns (Coordinates memory) {
        if (direction == UP) {
            return Coordinates(obstacle.x, _min(PUZZLE_HEIGHT - 1, obstacle.y + 2));
        }
        if (direction == DOWN) {
            return Coordinates(obstacle.x, _subtractNoNegative(obstacle.y, 2));
        }
        if (direction == LEFT) {
            return Coordinates(_min(PUZZLE_WIDTH - 1, obstacle.x + 2), obstacle.y);
        }
        return Coordinates(_subtractNoNegative(obstacle.x, 2), obstacle.y);
    }

    function _generatePuzzle(uint256 tokenId) internal pure returns (Puzzle memory) {
        Coordinates memory cursor = Coordinates(51, 101);
        uint direction = UP;
        Coordinates[] memory obstacles = new Coordinates[](64);

        uint256 collatzCurrent = tokenId;
        uint puzzleLength;

        for (puzzleLength = 0; puzzleLength < obstacles.length && collatzCurrent > 1; puzzleLength++) {
            Coordinates memory newObstacle = _createObstacle(cursor, direction, collatzCurrent);
            obstacles[puzzleLength] = newObstacle;
            cursor = _bounceBackCursor(newObstacle, direction);
            collatzCurrent = collatzNext(collatzCurrent);
            direction = _newDirection(direction, collatzCurrent);
            collatzCurrent = collatzNext(collatzCurrent);
        }

        return Puzzle(
            tokenId,
            obstacles,
            puzzleLength
        );
    }

    function puzzle(uint256 tokenId) public view returns (Puzzle memory) {
        require(_exists(tokenId), "KKP: Puzzle does not exist.");
        return _generatePuzzle(tokenId + randomNumber);
    }

    function mint() public nonReentrant payable {
        require(msg.value >= mintPrice, "KKP: Amount of MATIC sent is incorrect.");
        // TODO: require that player has Kewl Kevin NFT

        supply.increment();
        _safeMint(msg.sender, supply.current());
    }

    function burnAndClaimReward(uint256 tokenId, uint[] memory movements) public virtual {
        require(_exists(tokenId), "KKP: Puzzle does not exist.");
        require(ownerOf(tokenId) == msg.sender, "KKP: burning from incorrect owner");
        // TODO: require that not more than 16 minutes has passed
        require(movements.length != 0, "KKP: Solution required.");
        // TODO: require that movements do solve the puzzle
        _burn(tokenId);
        payable(msg.sender).transfer(1 ether);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
