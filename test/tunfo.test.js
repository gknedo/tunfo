const { expect } = require("chai");
const deploy = require("./utils/deploy");
const ATTRIBUTES = require("./fixtures/attributes.json");
const RARITIES = require("./fixtures/rarities.json");
const TYPES = require("./fixtures/types.json");
const { cardCost } = require("./fixtures/constants.json");
const { ethers } = require("ethers");

describe("Tunfo", () => {
  describe("safeMint", () => {
    it("only owner can call safeMint for free", async () => {
      const tunfo = await deploy("Tunfo");
      const [owner, wallet] = await hre.ethers.getSigners();

      expect(tunfo.safeMint(wallet.address)).to.not.be.reverted
      expect(tunfo.connect(wallet).safeMint(wallet.address)).to.be.reverted
    });
  });

  describe("mint", () => {
    it("reverts if value is not the Card Cost", async () => {
      const tunfo = await deploy("Tunfo");
      const [_, wallet] = await hre.ethers.getSigners();

      await expect(tunfo.mint({value: 0})).to.be.reverted;
      await expect(tunfo.mint({value: cardCost - 1})).to.be.reverted;
      await expect(tunfo.mint({value: cardCost})).to.not.be.reverted;
      await expect(tunfo.mint({value: cardCost+1})).to.be.reverted;

      await expect(tunfo.connect(wallet).mint({value: cardCost-1})).to.be.reverted;
      await expect(tunfo.connect(wallet).mint({value: cardCost+1})).to.be.reverted;
      await expect(tunfo.connect(wallet).mint({value: cardCost})).to.not.be.reverted;
    });

    it("add a token", async () => {
      const tunfo = await deploy("Tunfo");
      const [owner] = await hre.ethers.getSigners();

      const previousBalance = Number.parseInt(await tunfo.balanceOf(owner.address));
      await tunfo.mint({value: cardCost});
      const newBalance = Number.parseInt(await tunfo.balanceOf(owner.address));
      expect(newBalance).to.equal(previousBalance + 1);
    });

    it("receives the mint fee", async () => {
      const tunfo = await deploy("Tunfo");

      await expect(() => tunfo.mint({value: cardCost}))
        .to.changeEtherBalance(tunfo, cardCost);
    });
  });

  describe("getAttributes", () => {
    it("reverts if token was not generated", async () => {
      const tunfo = await deploy("Tunfo");
      await tunfo.mint({value: cardCost});

      await expect(tunfo.getAttributes(0)).to.be.reverted;
    });
  });

  describe("generateAttributes", () => {
    describe("with no paramaters", () => {
      it("generates all remaining tokens", async () => {
        const tunfo = await deploy("Tunfo");
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});

        await expect(tunfo.getAttributes(0)).to.be.reverted;
        await expect(tunfo.getAttributes(3)).to.be.reverted;
        await tunfo.generateUnlimitedAttributes();
        await expect(tunfo.getAttributes(0)).to.not.be.reverted;
        await expect(tunfo.getAttributes(3)).to.not.be.reverted;
      });
    });

    describe("limiting the number to generate", () =>{
      it("reverts if token was not generated", async () => {
        const tunfo = await deploy("Tunfo");
        await tunfo.mint({value: cardCost});
  
        await expect(tunfo.generateAttributes(0)).to.not.be.reverted;
      });
    });
  });
});
