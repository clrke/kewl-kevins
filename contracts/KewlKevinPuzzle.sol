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

    Counters.Counter public minted;
    Counters.Counter public burned;

    uint256 constant PUZZLE_WIDTH = 61;
    uint256 constant PUZZLE_HEIGHT = 61;

    Coordinates puzzleSize = Coordinates(PUZZLE_WIDTH, PUZZLE_HEIGHT);
    Coordinates entrance = Coordinates(50, 61);
    uint256 public mintPrice = 1 ether;
    mapping(uint256 => uint256) public mintTimestamps;

    uint constant SECONDS_DEADLINE = 960;

    uint256 public randomNumber = 50;
    address[] public nftPartners;

    uint256 constant UP = 0;
    uint256 constant RIGHT = 1;
    uint256 constant DOWN = 2;
    uint256 constant LEFT = 3;

    constructor() ERC721('Kewl Kevin Puzzle', 'KKP') {}

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

    function _newDirection(Coordinates memory cursor, uint256 direction, uint256 seed)
    internal
    pure
    returns (uint256)
    {
        if ((direction == UP || direction == DOWN) && cursor.x == 1) {
            return RIGHT;
        }
        if ((direction == UP || direction == DOWN) && cursor.x == PUZZLE_WIDTH - 1) {
            return LEFT;
        }
        if ((direction == LEFT || direction == RIGHT) && cursor.y == 1) {
            return DOWN;
        }
        if ((direction == LEFT || direction == RIGHT) && cursor.y == PUZZLE_HEIGHT - 1) {
            return UP;
        }
        uint256 directionTurn = seed % 2 == 1 ? 3 : 1;
        return (direction + directionTurn) % 4;
    }

    function _createObstacle(
        Coordinates memory cursor,
        uint256 direction,
        uint256 rawDistance
    ) internal pure returns (Coordinates memory) {
        uint256 distance;
        if (direction == UP) {
            distance = 1 + rawDistance % (cursor.y - 1);
            return Coordinates(cursor.x, _subtractNoNegative(cursor.y, distance));
        }
        if (direction == DOWN) {
            distance = 1 + rawDistance % (PUZZLE_HEIGHT - cursor.y - 1);
            return Coordinates(cursor.x, _min(PUZZLE_HEIGHT - 1, cursor.y + distance));
        }
        if (direction == LEFT) {
            distance = 1 + rawDistance % (cursor.x - 1);
            return Coordinates(_subtractNoNegative(cursor.x, distance), cursor.y);
        }
        distance = 1 + rawDistance % (PUZZLE_WIDTH - cursor.x - 1);
        return Coordinates(_min(PUZZLE_WIDTH - 1, cursor.x + distance), cursor.y);
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

    function shuffle(Coordinates[] memory obstacles, uint256 length, uint256 seed) internal pure {
        for (uint256 i = 0; i < length; i++) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(seed))) % (length - i);
            Coordinates memory temp = obstacles[n];
            obstacles[n] = obstacles[i];
            obstacles[i] = temp;
        }
    }

    function _generatePuzzle(uint256 seed)
    internal
    pure
    returns (Puzzle memory)
    {
        Coordinates memory cursor = Coordinates(50, 61);
        uint256 direction = UP;
        Coordinates[] memory obstacles = new Coordinates[](64);

        uint256 collatzCurrent = seed;
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
            direction = _newDirection(cursor, direction, collatzCurrent);
            collatzCurrent = collatzNext(collatzCurrent);
        }

        return Puzzle(seed, obstacles, puzzleLength);
    }

    function puzzle(uint256 tokenId) public view returns (Puzzle memory) {
        // require(_exists(tokenId), 'KKP: Puzzle does not exist.');
        Puzzle memory rawPuzzle = _generatePuzzle(tokenId + randomNumber);

        // shuffle
        shuffle(rawPuzzle.obstacles, rawPuzzle.puzzleLength, rawPuzzle.seed);

        return rawPuzzle;
    }

    function currentSupply() public view returns (uint256) {
        return minted.current() - burned.current();
    }

    function mint() public payable nonReentrant {
        require(
            msg.value >= mintPrice,
            'KKP: Amount of MATIC sent is incorrect.'
        );
        require(balanceOf(msg.sender) == 0, "KKP: You already have an ongoing puzzle to solve.");

        uint256 totalBalance = 0;
        for (uint256 i = 0; i < nftPartners.length; i++) {
            totalBalance += ERC721(nftPartners[i]).balanceOf(msg.sender);
            if (totalBalance > 0) break;
        }
        require(totalBalance > 0, "KKP: You don't have an associated NFT with this smart contract.");

        minted.increment();
        _safeMint(msg.sender, minted.current());

        mintTimestamps[minted.current()] = block.timestamp;
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
        if (mintTimestamps[tokenId] + SECONDS_DEADLINE < block.timestamp) {
            // too late. burning puzzle token and only rewarding 0.1 MATIC.
            _burn(tokenId);
            burned.increment();
            payable(msg.sender).transfer(0.1 ether);
            return;
        }

        require(movements.length != 0, 'KKP: Solution required.');

        // TODO: require that movements do solve the puzzle

        require(currentSupply() > 0, "KKP: Fatal error! Supply Tokens == Burned Tokens.");

        _burn(tokenId);
        burned.increment();

        // reward player
        payable(msg.sender).transfer(address(this).balance / currentSupply());
    }

    function setNftPartners(address[] memory newNftPartners) public onlyOwner {
        nftPartners = newNftPartners;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
