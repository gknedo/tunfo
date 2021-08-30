// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Cards {
  uint8 constant delta = 12;

  enum CardRarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
  enum CardType { PIGEON, CAT, DOG }
  enum CardAttribute { POWER, VITALITY, RESISTANCE, AGILITY, INTELIGENCE, CHARISMA }

  struct Card {
    CardType cardType;
    CardRarity rarity;
    uint16 generation;
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

  function getCardType(uint8 seed) pure internal returns(CardType) {
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
      } else if(cardType == CardType.DOG){
        if(attribute == CardAttribute.POWER) return 89;
        if(attribute == CardAttribute.VITALITY) return 77;
        if(attribute == CardAttribute.RESISTANCE) return 77;
        if(attribute == CardAttribute.AGILITY) return 102;
        if(attribute == CardAttribute.INTELIGENCE) return 166;
        if(attribute == CardAttribute.CHARISMA) return 179;
      } else if(cardType == CardType.PIGEON){
        if(attribute == CardAttribute.POWER) return 38;
        if(attribute == CardAttribute.VITALITY) return 13;
        if(attribute == CardAttribute.RESISTANCE) return 38;
        if(attribute == CardAttribute.AGILITY) return 115;
        if(attribute == CardAttribute.INTELIGENCE) return 89;
        if(attribute == CardAttribute.CHARISMA) return 26;
      }

      return 0;
  }

  function getAttribute(CardType cardType, CardRarity rarity, CardAttribute attribute, uint8 seed)
    pure internal
    returns(uint8) {
      uint8 minAttribute = getMinAttribute(cardType, attribute);
      uint8 deltaWithBonus = getDeltaWithBonus(rarity, minAttribute);
      return getAttributeBySeed(minAttribute, deltaWithBonus, seed);
  }

  function generateCard(uint256 seed)
    pure internal
    returns(Card memory) {
      CardRarity rarity = getRarity(uint8(seed));
      CardType cardType = getCardType(uint8(seed >> 8));

      return Card(
        cardType,
        rarity,
        getGeneration(),
        getDonationValue(uint8(seed >> 16)),
        getAttribute(cardType, rarity, CardAttribute.POWER, uint8(seed >> 24)),
        getAttribute(cardType, rarity, CardAttribute.VITALITY, uint8(seed >> 32)),
        getAttribute(cardType, rarity, CardAttribute.RESISTANCE, uint8(seed >> 40)),
        getAttribute(cardType, rarity, CardAttribute.AGILITY, uint8(seed >> 48)),
        getAttribute(cardType, rarity, CardAttribute.INTELIGENCE, uint8(seed >> 56)),
        getAttribute(cardType, rarity, CardAttribute.CHARISMA, uint8(seed >> 64))
      );
  }
}
