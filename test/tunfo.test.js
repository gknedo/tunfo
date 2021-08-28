const { expect } = require("chai");
const deploy = require("./utils/deploy");
const ATTRIBUTES = require("./fixtures/attributes.json");
const RARITIES = require("./fixtures/rarities.json");
const TYPES = require("./fixtures/types.json");
const { ethers, logger } = require("ethers");

describe("Tunfo", () => {
  it("test", async () => {
    const tunfo = await deploy("Tunfo");
    const accounts = await hre.ethers.getSigners();
    const wal = ethers.Wallet.createRandom().connect(accounts[0].provider)
    console.log((await accounts[0].getBalance()).toString());
    console.log((await wal.getBalance()).toString());
    await accounts[0].sendTransaction({
      to: wal.address,
      value: ethers.utils.parseEther("1") // 1 ether
    })
    console.log('----');
    console.log((await accounts[0].getBalance()).toString());
    console.log((await wal.getBalance()).toString());
    console.log(ethers.utils.formatEther(await accounts[0].getBalance()));
  });
});
