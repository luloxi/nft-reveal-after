// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

error ELC__NeedMoreETHSent();
error ELC__MintingCompleted();

contract ELC is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public constant i_mintFee = 76000000000000000; //0.076 ETH;
    bool public revealed = false;

    string public baseURI = "ipfs://QmTVKvYvc3Djq8RW4PRKWiz3dFUd4XfYcRYDcBoQdnAi4J/";
    // Must have a hidden.json file inside that folder, placeholder image and metadata until reveal

    constructor() ERC721("Eco Lions Club", "ELC") {}

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function changeBaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
        revealed = true;
    }

    function mint() public payable {
        if (msg.value < i_mintFee) {
            revert ELC__NeedMoreETHSent();
        }
        if (totalSupply() >= 50) {
            revert ELC__MintingCompleted();
        }
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI_ = _baseURI();

        if (revealed) {
            return bytes(baseURI_).length > 0 ? string(abi.encodePacked(baseURI_, Strings.toString(tokenId), ".json")) : "";
        } else {
            return string(abi.encodePacked(baseURI_, "hidden.json"));
        }
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIds.current();
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
