// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./Tunfo.sol";
import "./Cards.sol";
import "hardhat/console.sol";

contract EncounterManager is Pausable, Ownable {
  using Counters for Counters.Counter;
  using Cards for Cards.Card;

  uint256 constant encounterCost = 10;
  uint256 constant encounterFeeCost = 1;
  mapping (uint256 => uint256) private _bounties;
  mapping (uint256 => uint256) private _lifetimeEarnings;
  mapping (uint256 => uint256) private _survivalEncounters;
  mapping (uint256 => uint256) private _lastEncounterId;
  mapping (uint256 => Encounter) private _encounterHistory;
  Tunfo private _token;
  Counters.Counter private _encounterIdCounter;
  uint256 private _champion;
  uint256 private _championBounty;
  uint256 private _legend;
  uint256 private _legendEarnings;
  uint256 private _survivor;
  uint256 private _survivorEncounters;

  struct Encounter {
    uint256 card1Id;
    uint256 card2Id;
    uint256 winnerId;
    uint256 card1Bounty;
    uint256 card2Bounty;
    bool onGeneration;
    bool onPower;
    bool onVitality;
    bool onResistance;
    bool onAgility;
    bool onInteligence;
    bool onCharisma;
    uint8 card1Score;
    uint8 card2Score;
  }
  
  constructor(Tunfo token) {
    _token = token;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function join(uint256 tokenId) public payable whenNotPaused {
    require(msg.value == (encounterCost + encounterFeeCost), "Encounter ticket is 11.");
    require(_token.isTokenInitialized(tokenId));
    require(_token.ownerOf(tokenId) == msg.sender);
    require(_bounties[tokenId] == 0);

    _bounties[tokenId] = 1;
  }

  function shuffleAttributes(uint256 seed) public view
    returns(bool, bool, bool, bool, bool, bool, bool) {
    uint256 _seed = seed;
    bool[] memory attributes = new bool[](7);
    uint8 selected;

    do {
      uint8 shuffled = uint8(_seed)%7;
      _seed >>= 4;

      if(attributes[shuffled]) continue;

      attributes[shuffled] = true;
      selected +=1;

    } while(selected < 4);

    return (
      attributes[0],
      attributes[1],
      attributes[2],
      attributes[3],
      attributes[4],
      attributes[5],
      attributes[6]
    );
  }
}
