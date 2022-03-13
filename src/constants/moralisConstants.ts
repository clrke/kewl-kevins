export const MORALIS_APP_ID = "Vf4YWEL5RZlG5HuaMj8V7tY7cfOdVboXpMTqpNyQ";
export const MORALIS_SERVER_URL = "https://nwbrax1qbmje.usemoralis.com:2053/server";

export const chainId = 0x13881;
export const chainName = "Mumbai Testnet";
export const currencyName = "MATIC";
export const currencySymbol = "MATIC";
export const rpcUrl = "https://rpc-mumbai.maticvigil.com/";
export const blockExplorerUrl = "https://polygonscan.com/";


export const KK_CONTRACT_ADDRESS = "0x6f90f707f0282cc99f6cd82a8863d12d1652bdf3";
export const KKP_CONTRACT_ADDRESS = "0x4D47D6658FFa7be86a2566CbE09241A6E2213789";
export const KK_CONTRACT_ABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "approved",
    "type": "address"
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }],
  "name": "ApprovalForAll",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "previousOwner",
    "type": "address"
  }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Transfer",
  "type": "event"
}, {
  "inputs": [],
  "name": "MAX_SUPPLY",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256"
  }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "baseExtension",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "baseURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "getApproved",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "isApprovedForAll",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, { "inputs": [], "name": "mintNFT", "outputs": [], "stateMutability": "payable", "type": "function" }, {
  "inputs": [],
  "name": "mintPrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ownerOf",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "safeTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "bytes",
    "name": "_data",
    "type": "bytes"
  }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, {
    "internalType": "bool",
    "name": "approved",
    "type": "bool"
  }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "string", "name": "_newBaseExtension", "type": "string" }],
  "name": "setBaseExtension",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "string", "name": "_newBaseURI", "type": "string" }],
  "name": "setBaseURI",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
  "name": "supportsInterface",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "tokenURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "transferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

export const KKP_CONTRACT_ABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "approved",
    "type": "address"
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }],
  "name": "ApprovalForAll",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "previousOwner",
    "type": "address"
  }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Transfer",
  "type": "event"
}, {
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256"
  }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint256[]",
    "name": "movements",
    "type": "uint256[]"
  }], "name": "burnAndClaimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "burned",
  "outputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "currentSupply",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "getApproved",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getRandomNumber",
  "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "isApprovedForAll",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint256[]",
    "name": "movements",
    "type": "uint256[]"
  }],
  "name": "isCorrectSolution",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, { "inputs": [], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, {
  "inputs": [],
  "name": "mintPrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "mintTimestamps",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "minted",
  "outputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "nftPartners",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ownerOf",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "puzzle",
  "outputs": [{
    "components": [{
      "internalType": "uint256",
      "name": "seed",
      "type": "uint256"
    }, {
      "components": [{ "internalType": "uint256", "name": "x", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      }], "internalType": "struct KewlKevinPuzzle.Coordinates[]", "name": "obstacles", "type": "tuple[]"
    }, { "internalType": "uint256", "name": "puzzleLength", "type": "uint256" }, {
      "internalType": "uint256",
      "name": "exitX",
      "type": "uint256"
    }], "internalType": "struct KewlKevinPuzzle.Puzzle", "name": "", "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "randomNumber",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
    "internalType": "uint256",
    "name": "randomness",
    "type": "uint256"
  }], "name": "rawFulfillRandomness", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "safeTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "bytes",
    "name": "_data",
    "type": "bytes"
  }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, {
    "internalType": "bool",
    "name": "approved",
    "type": "bool"
  }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address[]", "name": "newNftPartners", "type": "address[]" }],
  "name": "setNftPartners",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
  "name": "supportsInterface",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "tokenURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "transferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
