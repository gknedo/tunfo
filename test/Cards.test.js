const { expect } = require("chai");
const deploy = require("./utils/deploy");

const ATTRIBUTES = {
  POWER: 0,
  VITALITY: 1,
  RESISTANCE: 2,
  AGILITY: 3,
  INTELIGENCE: 4,
  CHARISMA: 5,
};

const RARITIES ={
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
}

const TYPES = {
  PIGEON: 0,
  CAT: 1,
  DOG: 2,
};

const CAT = {
  POWER: 51,
  VITALITY: 38,
  RESISTANCE: 102,
  AGILITY: 179,
  INTELIGENCE: 115,
  CHARISMA: 204,
};

describe("Tunfos", () => {
  describe("getCardType", () => {
    it("returns PIGEON when value < 33%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x00)).to.equal(TYPES.PIGEON);
      expect(await cards.getCardType(0x55)).to.equal(TYPES.PIGEON);
    });

    it("returns CAT when 33% <= value < 66%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x56)).to.equal(TYPES.CAT);
      expect(await cards.getCardType(0xAB)).to.equal(TYPES.CAT);
    });

    it("returns DOG when value 66% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0xAC)).to.equal(TYPES.DOG);
      expect(await cards.getCardType(0xFF)).to.equal(TYPES.DOG);
    });
  });

  describe("getRarity", () => {
    it("returns COMMON when value < 50%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x00)).to.equal(RARITIES.COMMON);
      expect(await cards.getRarity(0x7F)).to.equal(RARITIES.COMMON);
    });

    it("returns UNCOMMON when 50% <= value < 80%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0x80)).to.equal(RARITIES.UNCOMMON);
      expect(await cards.getRarity(0xCC)).to.equal(RARITIES.UNCOMMON);
    });

    it("returns RARE when 80% <= value < 95%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xCD)).to.equal(RARITIES.RARE);
      expect(await cards.getRarity(0xF3)).to.equal(RARITIES.RARE);
    });

    it("returns EPIC when 95% <= value < 99%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xF4)).to.equal(RARITIES.EPIC);
      expect(await cards.getRarity(0xFD)).to.equal(RARITIES.EPIC);
    });

    it("returns LEGENDARY when 99% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getRarity(0xFE)).to.equal(RARITIES.LEGENDARY);
      expect(await cards.getRarity(0xFF)).to.equal(RARITIES.LEGENDARY);
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

  describe("getDeltaWithBonus", () => {
    it("returns delta when card rarity is COMMON", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.COMMON, 0)).to.equal(12);
      expect(await cards.getDeltaWithBonus(RARITIES.COMMON, 50)).to.equal(12);
      expect(await cards.getDeltaWithBonus(RARITIES.COMMON, 100)).to.equal(12);
    });

    it("returns delta with a 5% bonus when card rarity is UNCOMMON", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.UNCOMMON, 0)).to.equal(24);
      expect(await cards.getDeltaWithBonus(RARITIES.UNCOMMON, 50)).to.equal(21);
    });

    it("dont give any bonus if maxAttribute is 255", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.UNCOMMON, 0)).to.equal(24);
      expect(await cards.getDeltaWithBonus(RARITIES.UNCOMMON, 200)).to.equal(14);
      expect(await cards.getDeltaWithBonus(RARITIES.UNCOMMON, 243)).to.equal(12);
      expect(await cards.getDeltaWithBonus(RARITIES.LEGENDARY, 243)).to.equal(12);
    });

    it("returns delta with a 10% bonus when card rarity is RARE", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.RARE, 0)).to.equal(36);
      expect(await cards.getDeltaWithBonus(RARITIES.RARE, 50)).to.equal(31);
    });

    it("returns delta with a 17% bonus when card rarity is EPIC", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.EPIC, 0)).to.equal(52);
      expect(await cards.getDeltaWithBonus(RARITIES.EPIC, 50)).to.equal(44);
    });

    it("returns delta with a 25% bonus when card rarity is LEGENDARY", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getDeltaWithBonus(RARITIES.LEGENDARY, 0)).to.equal(72);
      expect(await cards.getDeltaWithBonus(RARITIES.LEGENDARY, 50)).to.equal(60);
    });
  });

  describe("getAttributeBySeed", () => {
    it("returns a value added by min attribute", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeBySeed(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeBySeed(50, 100, 0)).to.equal(50);
      expect(await cards.getAttributeBySeed(100, 100, 0)).to.equal(100);
    });

    it("returns a value among by delta", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeBySeed(0, 50, 128)).to.equal(25);
      expect(await cards.getAttributeBySeed(0, 100, 128)).to.equal(50);
      expect(await cards.getAttributeBySeed(0, 200, 128)).to.equal(100);
    });

    it("returns a value positioned by seed", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeBySeed(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeBySeed(0, 100, 128)).to.equal(50);
      expect(await cards.getAttributeBySeed(0, 100, 255)).to.equal(100);
    });

    it("returns a value positioned by seed among delta added by min", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getAttributeBySeed(0, 100, 0)).to.equal(0);
      expect(await cards.getAttributeBySeed(50, 100, 128)).to.equal(100);
      expect(await cards.getAttributeBySeed(100, 100, 255)).to.equal(200);
    });
  });

  describe("getMinAttribute", () => {
    describe("CAT", () => {
      it("returns the specified value", async () => {
        const cards = await deploy("CardsPub");
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.POWER)).to.equal(CAT.POWER);
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.VITALITY)).to.equal(CAT.VITALITY);
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.RESISTANCE)).to.equal(CAT.RESISTANCE);
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.AGILITY)).to.equal(CAT.AGILITY);
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.INTELIGENCE)).to.equal(CAT.INTELIGENCE);
        expect(await cards.getMinAttribute(TYPES.CAT, ATTRIBUTES.CHARISMA)).to.equal(CAT.CHARISMA);
      });
    });
  });
});
