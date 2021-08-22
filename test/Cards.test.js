const { expect } = require("chai");
const deploy = require("./utils/deploy");

describe("Tunfos", () => {
  describe("getRarity", () => {
    it("returns COMMON when value <9 50%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x00)).to.equal(0);
      expect(await cards.getRarity(0x7F)).to.equal(0);
    });

    it("returns UNCOMMON when 50% <= value < 80%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x80)).to.equal(1);
      expect(await cards.getRarity(0xCC)).to.equal(1);
    });

    it("returns RARE when value 80% <= value < 95%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xCD)).to.equal(2);
      expect(await cards.getRarity(0xF3)).to.equal(2);
    });

    it("returns EPIC when value 95% <= value < 99%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xF4)).to.equal(3);
      expect(await cards.getRarity(0xFD)).to.equal(3);
    });

    it("returns LEGENDARY when value 99% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xFE)).to.equal(4);
      expect(await cards.getRarity(0xFF)).to.equal(4);
    });
  });

  describe("getGeneration", () => {
    it("returns the current generation", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getGeneration()).to.equal(1);
    });
  });
});
