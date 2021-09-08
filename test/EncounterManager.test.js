const { expect } = require("chai");
const deploy = require("./utils/deploy");
const { cardCost, encounterCost, encounterFeeCost } = require("./fixtures/constants.json");
const entryCost = encounterCost + encounterFeeCost;
const { ethers, BigNumber } = require("ethers");

describe("EncounterManager", () => {
  describe("join", () => {
    it("reverts if value is not the Encounter Cost", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const [_, wallet] = await hre.ethers.getSigners();

      await tunfo.mint({value: cardCost});
      await tunfo.connect(wallet).mint({value: cardCost});
      await tunfo.generateAllTokens();

      await expect(contract.join(0, {value: 0})).to.be.reverted;
      await expect(contract.join(0, {value: entryCost - 1})).to.be.reverted;
      await expect(contract.join(0, {value: entryCost})).to.not.be.reverted;
      await expect(contract.join(0, {value: entryCost+1})).to.be.reverted;

      await expect(contract.connect(wallet).join(0, {value: entryCost-1})).to.be.reverted;
      await expect(contract.connect(wallet).join(0, {value: entryCost+1})).to.be.reverted;
      await expect(contract.connect(wallet).join(1, {value: entryCost})).to.not.be.reverted;
    });

    it("reverts if token wasnt minted", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);

      await expect(contract.join(0, {value: entryCost})).to.be.reverted;
    });

    it("reverts if token wasnt initialized", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      await tunfo.mint({value: cardCost});

      await expect(contract.join(0, {value: entryCost})).to.be.reverted;
    });

    it("its ok if the value is paid and the token was minted", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);

      await tunfo.mint({value: cardCost});
      await tunfo.mint({value: cardCost});

      tunfo.generateTokens(1);

      await expect(contract.join(0, {value: entryCost})).to.not.be.reverted;
      await expect(contract.join(1, {value: entryCost})).to.be.reverted;
    });

    it("only token owner can join", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const [_, wallet] = await hre.ethers.getSigners();

      await tunfo.mint({value: cardCost});
      await tunfo.mint({value: cardCost});

      tunfo.generateAllTokens();

      await expect(contract.join(0, {value: entryCost})).to.not.be.reverted;
      await expect(contract.connect(wallet).join(1, {value: entryCost})).to.be.reverted;
    });

    it("token can only join once", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const [_, wallet] = await hre.ethers.getSigners();

      await tunfo.mint({value: cardCost});
      await tunfo.connect(wallet).mint({value: cardCost});

      tunfo.generateAllTokens();

      await expect(contract.join(0, {value: entryCost})).to.not.be.reverted;
      await expect(contract.join(0, {value: entryCost})).be.reverted;
      await expect(contract.connect(wallet).join(1, {value: entryCost})).to.not.be.reverted;
      await expect(contract.connect(wallet).join(1, {value: entryCost})).to.be.reverted;
    });
  });

  describe("shuffleAttributes", () => {
    it("reverts if value is not the Encounter Cost", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const seed = BigNumber.from("0x420a5ebca4d3f8b2b6cd09ef0a277296cfa1d7b6f89a230399b6c59fe0eed0d0");

      const result = await contract.shuffleAttributes(seed);

      expect(result).to.eql([true,false,true,false,false,true,true]);
    });
  });

  describe("newEncounter", () => {
    it("returns the encounter based on seed", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);

      await tunfo.mint({value: cardCost});
      await tunfo.mint({value: cardCost});
      await tunfo.generateAllTokens();
      await contract.join(0, {value: entryCost});

      const seed = BigNumber.from("0x420a5ebca4d3f8b2b6cd09ef0a277296cfa1d7b6f89a230399b6c59fe0eed0d0");

      const result = await contract.newEncounter(0, 1, seed);

      expect(result[0]).to.eq(BigNumber.from(0));
      expect(result[1]).to.eq(BigNumber.from(1));
      expect(result[2]).to.eq(BigNumber.from(encounterCost));
      expect(result[3]).to.eq(BigNumber.from(0));
      expect(result[7]).to.eq(true);
      expect(result[8]).to.eq(false);
      expect(result[9]).to.eq(true);
      expect(result[10]).to.eq(false);
      expect(result[11]).to.eq(true);
      expect(result[12]).to.eq(true);
      expect(result[13]).to.eq(true);
    });
  });

  describe("newRandomEncounter", () => {
    it("reverts if not enought cards", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);

      await tunfo.mint({value: cardCost});
      await tunfo.mint({value: cardCost});
      await tunfo.generateAllTokens();
      await contract.join(0, {value: entryCost});

      await expect(contract.newRandomEncounter()).to.be.reverted;
      await contract.join(1, {value: entryCost});
      await expect(contract.newRandomEncounter()).to.not.be.reverted;
    });
  });
});
