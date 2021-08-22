// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Cards {
  enum CardRarity{ COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
  enum AnimalType{ CAT }

  struct Card {   
    CardRarity rarity;
    uint16 generation;
    AnimalType animalId;
    uint32 donationValue;
    uint8 power;
    uint8 vitality;
    uint8 resistance;
    uint8 agility;
    uint8 inteligence;
    uint8 charisma;
  }

  function getRarity(uint8 seed) pure internal returns (CardRarity) {
    if(seed < 0x80) return CardRarity.COMMON;
    if(seed < 0xCD) return CardRarity.UNCOMMON;
    if(seed < 0xF4) return CardRarity.RARE;
    if(seed < 0xFE) return CardRarity.EPIC;
    return CardRarity.LEGENDARY;
  }

  function getGeneration() pure internal returns (uint8) {
    return 1;
  }
}
