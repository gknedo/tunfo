const { expect } = require("chai");
const deploy = require("./utils/deploy");
const { cardCost, encounterCost, encounterFeeCost } = require("./fixtures/constants.json");
const entryCost = encounterCost + encounterFeeCost;
const { ethers } = require("ethers");

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
      const [_, wallet] = await hre.ethers.getSigners();

      await expect(contract.join(0, {value: entryCost})).to.be.reverted;
    });

    it("reverts if token wasnt initialized", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const [_, wallet] = await hre.ethers.getSigners();
      await tunfo.mint({value: cardCost});

      await expect(contract.join(0, {value: entryCost})).to.be.reverted;
    });

    it("its ok if the value is paid and the token was minted", async () => {
      const tunfo = await deploy("Tunfo");
      const contract = await deploy("EncounterManager", tunfo.address);
      const [_, wallet] = await hre.ethers.getSigners();

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
});
