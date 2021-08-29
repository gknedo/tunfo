// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Cards.sol";

contract Tunfo is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
  using Counters for Counters.Counter;
  using Cards for Cards.Card;

  uint constant mintCardCost = 10;
  Counters.Counter private _tokenIdCounter;
  
  constructor() ERC721("Tunfo", "TNF") {}

  function safeMint(address to) public onlyOwner {
    _mintCard(to);
  }

  function mint() public payable {
    require(msg.value == mintCardCost, "Card cost is 10.");

    // _mintCard(msg.sender);
  }

  function _mintCard(address to) private {
    _safeMint(to, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _baseURI() internal pure override returns (string memory) {
    return "http://google.com/";
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // function generateAttributes(bytes32 seed) public pure returns (Cards.Card memory){
  //   // return Cards.Card(1,16,10);
  // }
}
