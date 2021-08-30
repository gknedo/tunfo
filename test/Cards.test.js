const { expect } = require("chai");
const deploy = require("./utils/deploy");
const ATTRIBUTES = require("./fixtures/attributes.json");
const RARITIES = require("./fixtures/rarities.json");
const TYPES = require("./fixtures/types.json");
const { BigNumber } = require("ethers");

describe("Cards", () => {
  describe("getCardType", () => {
    it("returns PIGEON when value < 33%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x00)).to.equal(TYPES.PIGEON.id);
      expect(await cards.getCardType(0x55)).to.equal(TYPES.PIGEON.id);
    });

    it("returns CAT when 33% <= value < 66%", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0x56)).to.equal(TYPES.CAT.id);
      expect(await cards.getCardType(0xAB)).to.equal(TYPES.CAT.id);
    });

    it("returns DOG when value 66% <= value", async () => {
      const cards = await deploy("CardsPub");
      expect(await cards.getCardType(0xAC)).to.equal(TYPES.DOG.id);
      expect(await cards.getCardType(0xFF)).to.equal(TYPES.DOG.id);
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
    it("returns the specified fixture value", async () => {
      const cards = await deploy("CardsPub");
      Object.entries(TYPES).map(async ([typeKey, _])=> {
        const attributes = Object.entries(ATTRIBUTES).map(async ([attKey, _]) => {
          expect(await cards.getMinAttribute(TYPES[typeKey].id, ATTRIBUTES[attKey])).to.equal(TYPES[typeKey][attKey]);
        });
      });
    });
  });

  describe("getAttribute", () => {
    it("with a 0 seed returns the specified fixture value", async () => {
      const cards = await deploy("CardsPub");
      Object.entries(TYPES).map(async ([typeKey, _])=> {
        const attributes = Object.entries(ATTRIBUTES).map(async ([attKey, _]) => {
          expect(await cards.getAttribute(TYPES[typeKey].id, RARITIES.COMMON, ATTRIBUTES[attKey], 0x00)).to.equal(TYPES[typeKey][attKey]);
        });
      });
    });

    it("with a 128 seed returns the specified fixture value + 6", async () => {
      const cards = await deploy("CardsPub");
      Object.entries(TYPES).map(async ([typeKey, _])=> {
        const attributes = Object.entries(ATTRIBUTES).map(async ([attKey, _]) => {
          expect(await cards.getAttribute(TYPES[typeKey].id, RARITIES.COMMON, ATTRIBUTES[attKey], 0x80)).to.equal(TYPES[typeKey][attKey] + 6);
        });
      });
    });

    it("with a 255 seed returns the specified fixture value + 12", async () => {
      const cards = await deploy("CardsPub");
      Object.entries(TYPES).map(async ([typeKey, _])=> {
        const attributes = Object.entries(ATTRIBUTES).map(async ([attKey, _]) => {
          expect(await cards.getAttribute(TYPES[typeKey].id, RARITIES.COMMON, ATTRIBUTES[attKey], 0xFF)).to.equal(TYPES[typeKey][attKey] + 12);
        });
      });
    });
  });
  describe("generateCard", () => {
    it("returns a card based on seed", async () => {
      const seed = BigNumber.from("0x420a5ebca4d3f8b2b6cd09ef0a277296cfa1d7b6f89a230399b6c59fe0ee2cd0");
      const cards = await deploy("CardsPub");
      await cards.generateCard(0);

      const expectedRarity = await cards.getRarity(0xd0);
      const expectedType = await cards.getCardType(0x2c);
      const expectedValue = await cards.getDonationValue(0xee);

      console.log(await cards.generateCard(seed));
      expect(await cards.generateCard(seed)).to.eql([
        expectedType,
        expectedRarity,
        1,
        expectedValue,
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.POWER, 0xe0),
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.VITALITY, 0x9f),
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.RESISTANCE, 0xc5),
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.AGILITY, 0xb6),
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.INTELIGENCE, 0x99),
        await cards.getAttribute(expectedType, expectedRarity, ATTRIBUTES.CHARISMA, 0x03)
      ]);
    });
  });
});
