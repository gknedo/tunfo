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
    uint256 card1Bounty;
    uint256 card2Bounty;
    uint256 winnerId;
    uint8 card1Score;
    uint8 card2Score;
    bool onGeneration;
    bool onPower;
    bool onVitality;
    bool onResistance;
    bool onAgility;
    bool onInteligence;
    bool onCharisma;
  }

  struct EncounterAttributes {
    bool generation;
    bool power;
    bool vitality;
    bool resistance;
    bool agility;
    bool inteligence;
    bool charisma;
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

    _bounties[tokenId] = encounterCost;
  }

  function shuffleAttributes(uint256 seed) public pure
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

    } while(selected < 4 && _seed != 0);

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

  function _shuffleAttributes(uint256 seed) private pure
  returns (EncounterAttributes memory ret ) {
    (bool attr0, bool attr1, bool attr2,  bool attr3, bool attr4, bool attr5, bool attr6) = shuffleAttributes(seed);
    return EncounterAttributes(attr0, attr1, attr2, attr3, attr5, attr5, attr6);
  }

  function simulateEncounter(uint256 card1Id, uint256 card2Id, uint256 seed) public view returns(Encounter memory) {
    uint256 card1bounty = _bounties[card1Id];
    uint256 card2bounty = _bounties[card2Id];
    EncounterAttributes memory attr = _shuffleAttributes(seed);


    Cards.Card memory card1 = _token._getAttributes(card1Id);
    Cards.Card memory card2 = _token._getAttributes(card2Id);

    uint8 card1Score;
    uint8 card2Score;

    if(attr.generation && card1.generation > card2.generation) card1Score++;
    if(attr.power && card1.power > card2.power) card1Score++;
    if(attr.vitality && card1.vitality > card2.vitality) card1Score++;
    if(attr.resistance && card1.resistance > card2.resistance) card1Score++;
    if(attr.agility && card1.agility > card2.agility) card1Score++;
    if(attr.inteligence && card1.inteligence > card2.inteligence) card1Score++;
    if(attr.charisma && card1.charisma > card2.charisma) card1Score++;

    if(attr.generation && card2.generation > card1.generation) card2Score++;
    if(attr.power && card2.power > card1.power) card2Score++;
    if(attr.vitality && card2.vitality > card1.vitality) card2Score++;
    if(attr.resistance && card2.resistance > card1.resistance) card2Score++;
    if(attr.agility && card2.agility > card1.agility) card2Score++;
    if(attr.inteligence && card2.inteligence > card1.inteligence) card2Score++;
    if(attr.charisma && card2.charisma > card1.charisma) card2Score++;

    uint256 winnerId;

    if(card1Score > card2Score) winnerId = card1Id;
    if(card2Score > card1Score) winnerId = card2Id;

    return Encounter(
      card1Id,
      card2Id,
      card1bounty,
      card2bounty,
      winnerId,
      card1Score,
      card2Score,
      attr.generation,
      attr.power,
      attr.vitality,
      attr.resistance,
      attr.agility,
      attr.inteligence,
      attr.charisma
    );
  }
}
