module.exports = async ({
  deployments,
  getUnnamedAccounts,
}) => {
  const {deploy} = deployments;
  const [owner] = await getUnnamedAccounts();

  const dep = await deploy('Tunfo', {
    from: owner,
    gasLimit: 30000000,
    args: [],
  });

  console.log(dep.address);
};
