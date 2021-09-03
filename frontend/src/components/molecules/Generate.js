function Generate({useGlobalState}) {
  const [contract] = useGlobalState('contract');

  const generateAllTokens = async () => {
    await contract.generateAllTokens();
  }

  return (
    <div className="btn-generate">
      <button onClick={() => generateAllTokens()}>Generate</button>
    </div>
  );
}

export default Generate;
