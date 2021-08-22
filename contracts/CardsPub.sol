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

  function getAttributeDelta(uint8 rarity, uint8 minAttribute, uint8 maxAttribute)
    pure public
    returns(uint8) {
      return Cards.getAttributeDelta(Cards.CardRarity(rarity), minAttribute, maxAttribute);
  }

  function getAttributeByDelta(uint8 minAttribute, uint8 delta, uint8 seed)
    pure public
    returns(uint8) {
      return Cards.getAttributeByDelta(minAttribute, delta, seed);
  }
}
