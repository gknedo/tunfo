const { expect } = require("chai");
const deploy = require("./utils/deploy");

describe("Tunfos", () => {
  describe("getCardType", () => {
    it("returns PIGEON when value < 33%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x00)).to.equal(0);
      expect(await cards.getCardType(0x55)).to.equal(0);
    });

    it("returns CAT when 33% <= value < 66%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x56)).to.equal(1);
      expect(await cards.getCardType(0xAB)).to.equal(1);
    });

    it("returns DOG when value 66% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0xAC)).to.equal(2);
      expect(await cards.getCardType(0xFF)).to.equal(2);
    });
  });

  describe("getRarity", () => {
    it("returns COMMON when value < 50%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x00)).to.equal(0);
      expect(await cards.getRarity(0x7F)).to.equal(0);
    });

    it("returns UNCOMMON when 50% <= value < 80%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x80)).to.equal(1);
      expect(await cards.getRarity(0xCC)).to.equal(1);
    });

    it("returns RARE when 80% <= value < 95%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xCD)).to.equal(2);
      expect(await cards.getRarity(0xF3)).to.equal(2);
    });

    it("returns EPIC when 95% <= value < 99%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xF4)).to.equal(3);
      expect(await cards.getRarity(0xFD)).to.equal(3);
    });

    it("returns LEGENDARY when 99% <= value", async () => {
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

  describe("getDonationValue", () => {
    it("returns 1 when value < 40%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDonationValue(0x00)).to.equal(1);
      expect(await cards.getDonationValue(0x68)).to.equal(1);
    });

    it("returns 10 when 40% <= value < 80%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDonationValue(0x69)).to.equal(10);
      expect(await cards.getDonationValue(0xCE)).to.equal(10);
    });

    it("returns 50 when value 80% <= value < 95%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDonationValue(0xCF)).to.equal(50);
      expect(await cards.getDonationValue(0xF3)).to.equal(50);
    });

    it("returns 100 when value 95% <= value < 99.5%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDonationValue(0xF4)).to.equal(100);
      expect(await cards.getDonationValue(0xFE)).to.equal(100);
    });

    it("returns 1000 when value 99% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDonationValue(0xFF)).to.equal(1000);
    });
  });

  describe("getAttributeDelta", () => {
    it("returns delta when card rarity is COMMON", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(0, 0, 50)).to.equal(50);
      expect(await cards.getAttributeDelta(0, 50, 100)).to.equal(50);
      expect(await cards.getAttributeDelta(0, 100, 255)).to.equal(155);
    });

    it("returns delta with a 5% bonus when card rarity is UNCOMMON", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(1, 0, 55)).to.equal(65);
      expect(await cards.getAttributeDelta(1, 50, 105)).to.equal(62);
    });

    it("dont give any bonus if maxAttribute is 255", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(1, 0, 55)).to.equal(65);
      expect(await cards.getAttributeDelta(1, 250, 255)).to.equal(5);
    });

    it("returns delta with a 10% bonus when card rarity is RARE", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(2, 0, 55)).to.equal(75);
      expect(await cards.getAttributeDelta(2, 50, 105)).to.equal(70);
    });

    it("returns delta with a 17% bonus when card rarity is EPIC", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(3, 0, 55)).to.equal(88);
      expect(await cards.getAttributeDelta(3, 50, 105)).to.equal(80);
    });

    it("returns delta with a 25% bonus when card rarity is LEGENDARY", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeDelta(4, 0, 55)).to.equal(105);
      expect(await cards.getAttributeDelta(4, 50, 105)).to.equal(92);
    });
  });

  describe("getAttribute", () => {
    it("returns a value added by min attribute", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeByDelta(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeByDelta(50, 100, 0)).to.equal(50);
      expect(await cards.getAttributeByDelta(100, 100, 0)).to.equal(100);
    });

    it("returns a value among by delta", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeByDelta(0, 50, 128)).to.equal(25);
      expect(await cards.getAttributeByDelta(0, 100, 128)).to.equal(50);
      expect(await cards.getAttributeByDelta(0, 200, 128)).to.equal(100);
    });

    it("returns a value positioned by seed", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeByDelta(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeByDelta(0, 100, 128)).to.equal(50);
      expect(await cards.getAttributeByDelta(0, 100, 255)).to.equal(100);
    });

    it("returns a value positioned by seed among delta added by min", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeByDelta(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeByDelta(50, 100, 128)).to.equal(100);
      expect(await cards.getAttributeByDelta(100, 100, 255)).to.equal(200);
    });
  });
});
