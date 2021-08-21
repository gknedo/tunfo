const { expect } = require("chai");

describe("Tunfo", function () {
  it("Deploys the token successfully", async function () {
    const greeter = await (await ethers.getContractFactory("Tunfo")).deploy();
    await greeter.deployed();
  });
});
