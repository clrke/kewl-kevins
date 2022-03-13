// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract KewlKevinPuzzle is VRFConsumerBase, ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    struct Coordinates {
        uint256 x;
        uint256 y;
    }

    struct Puzzle {
        uint256 seed;
        Coordinates[] obstacles;
        uint256 puzzleLength;
        uint256 exitX;
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
    uint256 public mintPrice = 8 ether;
    mapping(uint256 => uint256) public mintTimestamps;

    uint constant SECONDS_DEADLINE = 960;

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomNumber = 42069;
    address[] public nftPartners;

    uint256 constant UP = 0;
    uint256 constant RIGHT = 1;
    uint256 constant DOWN = 2;
    uint256 constant LEFT = 3;

    constructor() ERC721('Kewl Kevin Puzzle', 'KKP') VRFConsumerBase(
        0x3d2341ADb2D31f1c5530cDC622016af293177AE0, // VRF Coordinator
        0xb0897686c545045aFc77CF20eC7A532E3120E0F1  // LINK Token
    ) {
        keyHash = 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
        fee = 0.00001 * 10 ** 18;
        // 0.00001 LINK (Varies by network)
    }

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
        Coordinates[] memory obstacles,
        uint256 puzzleLength,
        uint256 direction,
        uint256 rawDistance
    ) internal pure returns (Coordinates memory) {
        uint256 obstacleIndex = _findObstacleIndex(cursor, obstacles, puzzleLength, direction);
        uint256 distance;

        if (obstacleIndex == 64) {
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

        Coordinates memory obstacle = obstacles[obstacleIndex];
        if (direction == UP) {
            if (cursor.y - obstacle.y <= 1) return obstacle;
            distance = 1 + rawDistance % (cursor.y - obstacle.y - 1);
            return Coordinates(cursor.x, cursor.y - distance);
        }

        if (direction == DOWN) {
            if (obstacle.y - cursor.y <= 1) return obstacle;
            distance = 1 + rawDistance % (obstacle.y - cursor.y - 1);
            return Coordinates(cursor.x, _min(PUZZLE_HEIGHT - 1, cursor.y + distance));
        }

        if (direction == LEFT) {
            if (cursor.x - obstacle.x <= 1) return obstacle;
            distance = 1 + rawDistance % (cursor.x - obstacle.x - 1);
            return Coordinates(_subtractNoNegative(cursor.x, distance), cursor.y);
        }

        if (obstacle.x - cursor.x <= 1) return obstacle;
        distance = 1 + rawDistance % (obstacle.x - cursor.x - 1);
        return Coordinates(_min(PUZZLE_WIDTH - 1, cursor.x + distance), cursor.y);
    }

    function _bounceBackWall(Coordinates memory playerPosition, uint256 direction)
    internal
    pure
    returns (Coordinates memory)
    {
        if (direction == UP) {
            return Coordinates(playerPosition.x, PUZZLE_HEIGHT - 1);
        }
        if (direction == DOWN) {
            return Coordinates(playerPosition.x, 0);
        }
        if (direction == RIGHT) {
            return
            Coordinates(PUZZLE_WIDTH - 1, playerPosition.y);
        }
        return Coordinates(0, playerPosition.y);
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
                obstacles,
                puzzleLength,
                direction,
                collatzCurrent
            );
            obstacles[puzzleLength] = newObstacle;
            cursor = _bounceBackCursor(newObstacle, direction);
            collatzCurrent = collatzNext(collatzCurrent);
            direction = _newDirection(cursor, direction, collatzCurrent);
            collatzCurrent = collatzNext(collatzCurrent);
        }

        return Puzzle(seed, obstacles, puzzleLength, cursor.x);
    }

    function puzzle(uint256 tokenId) public view returns (Puzzle memory) {
        require(_exists(tokenId), 'KKP: Puzzle does not exist.');
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
        // Let's allow users to mint multiples for now
        // require(balanceOf(msg.sender) == 0, "KKP: You already have an ongoing puzzle to solve.");

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

    function _findObstacleIndex(Coordinates memory cursor, Coordinates[] memory obstacles, uint256 puzzleLength, uint256 direction) internal pure returns (uint256) {
        uint256 closestObstacleIndex = 64;

        for (uint256 i = 0; i < puzzleLength; i++) {
            Coordinates memory obstacle = obstacles[i];
            if ((direction == UP || direction == DOWN) && obstacle.x != cursor.x) {
                continue;
            }
            if ((direction == LEFT || direction == RIGHT) && obstacle.y != cursor.y) {
                continue;
            }

            if (direction == UP && obstacle.y > cursor.y) continue;
            if (direction == DOWN && obstacle.y < cursor.y) continue;
            if (direction == LEFT && obstacle.x > cursor.x) continue;
            if (direction == RIGHT && obstacle.x < cursor.x) continue;

            if (closestObstacleIndex == 64) {
                closestObstacleIndex = i;
                continue;
            }

            if (direction == UP && obstacle.y < obstacles[closestObstacleIndex].y) continue;
            if (direction == DOWN && obstacle.y > obstacles[closestObstacleIndex].y) continue;
            if (direction == LEFT && obstacle.x < obstacles[closestObstacleIndex].x) continue;
            if (direction == RIGHT && obstacle.x > obstacles[closestObstacleIndex].x) continue;

            closestObstacleIndex = i;
        }

        return closestObstacleIndex;
    }

    function isCorrectSolution(uint256 tokenId, uint256[] memory movements) public view returns (bool) {
        require(movements.length != 0, 'KKP: Solution required.');

        Puzzle memory burnPuzzle = _generatePuzzle(tokenId + randomNumber);

        Coordinates memory cursor = Coordinates(50, 61);
        Coordinates[] memory obstacles = burnPuzzle.obstacles;
        uint256 puzzleLength = burnPuzzle.puzzleLength;
        uint256 exitX = burnPuzzle.exitX;

        for (uint256 i = 0; i < movements.length; i++) {
            uint256 obstacleIndex = _findObstacleIndex(cursor, obstacles, puzzleLength, movements[i]);

            if (obstacleIndex == 64) {
                cursor = _bounceBackWall(cursor, movements[i]);
            } else {
                cursor = _bounceBackCursor(obstacles[obstacleIndex], movements[i]);
                // BRING THIS BACK IF YOU WANT V1 OF THE GAME
                obstacles[obstacleIndex] = Coordinates(64, 64);
            }
        }

        require(exitX == cursor.x, string(abi.encodePacked("Expected: ", Strings.toString(exitX), " Actual: ", Strings.toString(cursor.x))));

        return exitX == cursor.x;
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

        require(isCorrectSolution(tokenId, movements), "KKP: Your solution did not solve the puzzle.");

        require(currentSupply() > 0, "KKP: Fatal error! Supply Tokens == Burned Tokens.");

        _burn(tokenId);
        burned.increment();

        // reward player
        payable(msg.sender).transfer(address(this).balance / currentSupply());
    }

    /**
     * Requests randomness
     */
    function getRandomNumber() public onlyOwner returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomNumber = randomness;
    }

    function setNftPartners(address[] memory newNftPartners) public onlyOwner {
        nftPartners = newNftPartners;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // to increase reward pool.
    function deposit() public payable nonReentrant {}
}
