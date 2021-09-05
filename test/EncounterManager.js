const { expect } = require("chai");
const deploy = require("./utils/deploy");
const { encounterCost, encounterFeeCost } = require("./fixtures/constants.json");
const { ethers } = require("ethers");

describe("EncounterManager", () => {
  describe("join", () => {
    it("reverts if value is not the Encounter Cost", async () => {
      const contract = await deploy("EncounterManager");
      const [_, wallet] = await hre.ethers.getSigners();

      const entryCost = encounterCost + encounterFeeCost;
      console.log(entryCost);

      await expect(contract.join({value: 0})).to.be.reverted;
      await expect(contract.join({value: entryCost - 1})).to.be.reverted;
      await expect(contract.join({value: entryCost})).to.not.be.reverted;
      await expect(contract.join({value: entryCost+1})).to.be.reverted;

      await expect(contract.connect(wallet).join({value: entryCost-1})).to.be.reverted;
      await expect(contract.connect(wallet).join({value: entryCost+1})).to.be.reverted;
      await expect(contract.connect(wallet).join({value: entryCost})).to.not.be.reverted;
    });
  });
});
