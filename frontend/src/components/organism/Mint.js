function Mint({account, setAccount}) {
  const mint = async () => {
    setAccount((await window.ethereum.request({ method: 'eth_requestAccounts' }))[0]);
  }

  return (
    <div className="App">
      <button onClick={mint}>Mint</button>
    </div>
  );
}

export default Mint;
