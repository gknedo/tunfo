// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "./Cards.sol";

library CardsPub {
  using Cards for Cards.Card;

  function getRarity(uint8 seed) pure public returns (uint8) {
    return uint8(Cards.getRarity(seed));
  }

  function getCardType(uint8 seed) pure public returns (uint8) {
    return uint8(Cards.getCardType(seed));
  }

  function getGeneration() pure public returns (uint8) {
    return Cards.getGeneration();
  }

  function getDonationValue(uint8 seed) pure public returns (uint32) {
    return Cards.getDonationValue(seed);
  }

  function getDeltaWithBonus(uint8 rarity, uint8 minAttribute)
    pure public
    returns(uint8) {
      return Cards.getDeltaWithBonus(Cards.CardRarity(rarity), minAttribute);
  }

  function getAttributeBySeed(uint8 minAttribute, uint8 deltaWithBonus, uint8 seed)
    pure public
    returns(uint8) {
      return Cards.getAttributeBySeed(minAttribute, deltaWithBonus, seed);
  }

  function getMinAttribute(uint8 cardType, uint8 attribute)
    pure public
    returns(uint8) {
      return Cards.getMinAttribute(Cards.CardType(cardType), Cards.CardAttribute(attribute));
  }
}
