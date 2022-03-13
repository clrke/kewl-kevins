//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract KewlKevin is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private supply;

    string public baseURI = "https://gateway.valist.io/ipfs/QmVExnWTHtcPorNu5YTu5EzxYGBLKbUEvJCEFzBrjyP58H/";
    string public baseExtension = ".json";

    uint256 public constant MAX_SUPPLY = 3888;

    uint256 public mintPrice = 10 ether;

    constructor() ERC721 ("Kewl Kevin", "KK") {}

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mintNFT() public payable {
        require(supply.current() <= MAX_SUPPLY, "Max supply exceeded!");
        require(msg.value >= mintPrice, "Insufficient funds!");
        supply.increment();
        _safeMint(msg.sender, supply.current());
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension)) : "";
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
