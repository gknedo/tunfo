function Mint({useGlobalState}) {
  const [contract] = useGlobalState('contract');

  const mint = async () => {
    if(!contract) return;
    await contract.mint({value: 10});
  }

  return (
    <div className="btn-mint">
      <button onClick={() => mint()}>Mint</button>
    </div>
  );
}

export default Mint;
