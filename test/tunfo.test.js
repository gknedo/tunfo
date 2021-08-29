const { expect } = require("chai");
const deploy = require("./utils/deploy");
const ATTRIBUTES = require("./fixtures/attributes.json");
const RARITIES = require("./fixtures/rarities.json");
const TYPES = require("./fixtures/types.json");
const { ethers, logger } = require("ethers");

describe("Tunfo", () => {
  describe("safeMint", () => {
    it("only owner can call safeMint freely", async () => {
      const tunfo = await deploy("Tunfo");
      const accounts = await hre.ethers.getSigners();

      expect(tunfo.safeMint(accounts[1].address)).to.not.be.reverted
      expect(tunfo.connect(accounts[1]).safeMint(accounts[1].address)).to.be.reverted
    });
  })
});
