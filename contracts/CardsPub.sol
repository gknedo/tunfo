// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "./Cards.sol";

library CardsPub {
  using Cards for Cards.Card;

  function getRarity(uint8 seed) pure public returns (uint8) {
    return uint8(Cards.getRarity(seed));
  }

  function getAnimalType(uint8 seed) pure public returns (uint8) {
    return uint8(Cards.getAnimalType(seed));
  }

  function getGeneration() pure public returns (uint8) {
    return Cards.getGeneration();
  }

  function getDonationValue(uint8 seed) pure public returns (uint32) {
    return Cards.getDonationValue(seed);
  }
}
