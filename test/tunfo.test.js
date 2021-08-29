const { expect } = require("chai");
const deploy = require("./utils/deploy");
const ATTRIBUTES = require("./fixtures/attributes.json");
const RARITIES = require("./fixtures/rarities.json");
const TYPES = require("./fixtures/types.json");
const { ethers } = require("ethers");

describe("Tunfo", () => {
  describe("safeMint", () => {
    it("only owner can call safeMint for free", async () => {
      const tunfo = await deploy("Tunfo");
      const accounts = await hre.ethers.getSigners();

      expect(tunfo.safeMint(accounts[1].address)).to.not.be.reverted
      expect(tunfo.connect(accounts[1]).safeMint(accounts[1].address)).to.be.reverted
    });
  });

  describe("mint", () => {
    it("reverts if value is not the Card Cost", async () => {
      const tunfo = await deploy("Tunfo");
      const accounts = await hre.ethers.getSigners();

      const provider = tunfo.provider;
      console.log((await provider.getBalance(tunfo.address)).toString());

      await expect(tunfo.mint({value: 1})).to.be.reverted
      await expect(tunfo.mint({value: 10})).to.not.be.reverted
      await expect(tunfo.mint({value: 11})).to.be.reverted
      console.log((await provider.getBalance(tunfo.address)).toString());

      await expect(tunfo.connect(accounts[1]).mint({value: 1})).to.be.reverted
      await expect(tunfo.connect(accounts[1]).mint({value: 11})).to.be.reverted
      await expect(tunfo.connect(accounts[1]).mint({value: 10})).to.not.be.reverted
      console.log((await provider.getBalance(tunfo.address)).toString());
    });

    it("call _mint with sender address", async () => {
      const tunfo = await deploy("Tunfo");
      const accounts = await hre.ethers.getSigners();
      await tunfo.mint({value: 10});
    });
  });
});
