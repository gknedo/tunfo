const deploy = async (contractName, ...args) => {
  const factory = await ethers.getContractFactory(contractName);
  const token = await factory.deploy(...args);
  await token.deployed();
  return token;
}

module.exports = deploy;
