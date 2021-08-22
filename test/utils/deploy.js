const deploy = async (contractName) => {
  const factory = await ethers.getContractFactory(contractName);
  const token = await factory.deploy();
  await token.deployed();
  return token;
}

module.exports = deploy;
