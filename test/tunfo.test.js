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

  describe("generateTokens", () => {
    describe("with no paramaters", () => {
      it("generates all remaining tokens", async () => {
        const tunfo = await deploy("Tunfo");
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});

        expect(await tunfo.isTokenInitialized(0)).to.be.false;
        expect(await tunfo.isTokenInitialized(3)).to.be.false;
        await tunfo.generateAllTokens();
        expect(await tunfo.isTokenInitialized(0)).to.be.true;
        expect(await tunfo.isTokenInitialized(3)).to.not.be.false;
      });
    });

    describe("limiting the number to generate", () =>{
      it("reverts if token was not generated", async () => {
        const tunfo = await deploy("Tunfo");
        await tunfo.mint({value: cardCost});
  
        expect(await tunfo.isTokenInitialized(0)).to.be.false;
        await expect(tunfo.generateTokens(1)).to.not.be.reverted;
        expect(await tunfo.isTokenInitialized(0)).to.be.true;
      });
    });

    describe("only owner can call generateTokens", () =>{
      it("owner can call generate functions", async () => {
        const tunfo = await deploy("Tunfo");

        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});

        await expect(tunfo.generateTokens(1)).to.not.be.reverted;
        await expect(tunfo.generateAllTokens()).to.not.be.reverted;
      });

      it("reverts if not called by owner", async () => {
        const tunfo = await deploy("Tunfo");
        const [_, otherWallet] = await hre.ethers.getSigners();

        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});

        await expect(tunfo.connect(otherWallet).generateTokens(1)).to.be.reverted;
        await expect(tunfo.connect(otherWallet).generateAllTokens()).to.be.reverted;
      });

      it("not generate more than minted cards", async () => {
        const tunfo = await deploy("Tunfo");

        await tunfo.mint({value: cardCost});
        await tunfo.mint({value: cardCost});
        await tunfo.generateTokens(3);

        expect(await tunfo.isTokenInitialized(1)).to.be.true;
        expect(await tunfo.isTokenInitialized(2)).to.be.false;
      });
    });
  });
  
  describe("getAttributes", () => {
    it("reverts if token not minted", async () => {
      const tunfo = await deploy("Tunfo");
      await expect(tunfo.getAttributes(0)).to.be.reverted;
    });

    it("reverts if token was not initialized", async () => {
      const tunfo = await deploy("Tunfo");
      await tunfo.mint({value: cardCost});

      await expect(tunfo.getAttributes(0)).to.be.reverted;
    });

    it("is ok if token was initialized", async () => {
      const tunfo = await deploy("Tunfo");
      await tunfo.mint({value: cardCost});
      await tunfo.generateAllTokens();

      await expect(tunfo.getAttributes(0)).to.not.be.reverted;
    });

    it("returns the card", async () => {
      const tunfo = await deploy("Tunfo");
      await tunfo.mint({value: cardCost});
      await tunfo.mint({value: cardCost});
      await tunfo.generateAllTokens();
      const card0 = await tunfo.getAttributes(0);
      const card1 = await tunfo.getAttributes(1);
      expect(card0.length).to.eq(9);
      expect(card1.length).to.eq(9);
      expect(card0[2]).to.eq(1);
      expect(card1[2]).to.eq(1);
      expect(card0[3]).to.be.greaterThan(0);
      expect(card1[3]).to.be.greaterThan(0);
      expect(card0[4]).to.not.be.eq(card1[4]);
    });
  });
});
