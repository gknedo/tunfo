// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Cards {
  uint8 constant delta = 12;

  enum CardRarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
  enum CardType { PIGEON, CAT, DOG }
  enum CardAttribute { POWER, VITALITY, RESISTANCE, AGILITY, INTELIGENCE, CHARISMA }

  struct Card {   
    CardRarity rarity;
    uint16 generation;
    CardType cardType;
    uint32 donationValue;
    uint8 power;
    uint8 vitality;
    uint8 resistance;
    uint8 agility;
    uint8 inteligence;
    uint8 charisma;
  }

  function getGeneration() pure internal returns (uint8) {
    return 1;
  }

  function getCardType(uint seed) pure internal returns(CardType) {
    if(seed < 0x56) return CardType.PIGEON;
    if(seed < 0xAC) return CardType.CAT;
    return CardType.DOG;
  }

  function getRarity(uint8 seed) pure internal returns (CardRarity) {
    if(seed < 0x80) return CardRarity.COMMON;
    if(seed < 0xCD) return CardRarity.UNCOMMON;
    if(seed < 0xF4) return CardRarity.RARE;
    if(seed < 0xFE) return CardRarity.EPIC;
    return CardRarity.LEGENDARY;
  }

  function getDonationValue(uint8 seed) pure internal returns (uint32) {
    if(seed < 0x69) return 1;
    if(seed < 0xCF) return 10;
    if(seed < 0xF4) return 50;
    if(seed < 0xFF) return 100;
    return 1000;
  }

  function getDeltaWithBonus(CardRarity rarity, uint8 minAttribute)
    pure internal
    returns(uint8) {
      uint16 bonusMultiplier;
      uint8 maxAttribute = minAttribute + delta;
      if(rarity ==  CardRarity.UNCOMMON) bonusMultiplier = 13;
      if(rarity ==  CardRarity.RARE) bonusMultiplier = 26;
      if(rarity ==  CardRarity.EPIC) bonusMultiplier = 43;
      if(rarity ==  CardRarity.LEGENDARY) bonusMultiplier = 64;

      uint8 bonus = uint8((255 - maxAttribute) * bonusMultiplier / 255);
      return maxAttribute - minAttribute + bonus;
  }

  function getAttributeBySeed(uint8 minAttribute, uint8 deltaWithBonus, uint8 seed)
    pure internal
    returns(uint8) {
      return uint8(minAttribute + uint16(seed) * deltaWithBonus / 255);
  }

  function getMinAttribute(CardType cardType, CardAttribute attribute)
    pure internal
    returns(uint8) {
      if(cardType == CardType.CAT){
        if(attribute == CardAttribute.POWER) return 51;
        if(attribute == CardAttribute.VITALITY) return 38;
        if(attribute == CardAttribute.RESISTANCE) return 102;
        if(attribute == CardAttribute.AGILITY) return 179;
        if(attribute == CardAttribute.INTELIGENCE) return 115;
        if(attribute == CardAttribute.CHARISMA) return 204;
      }

      return 0;
  }
}
