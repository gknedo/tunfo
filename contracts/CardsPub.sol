// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "./Cards.sol";

library CardsPub {
  using Cards for Cards.Card;

  function getRarity(uint8 seed) pure public returns (uint8) {
    // return Cards.getRarity(seed);
    return uint8(Cards.getRarity(seed));
  }
}
