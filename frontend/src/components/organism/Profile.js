function Profile({account, setAccount}) {
  window.ethereum.on('accountsChanged', (accounts) => {
    setAccount(accounts[0]);
  });

  const requestAuth = async () => {
    setAccount((await window.ethereum.request({ method: 'eth_requestAccounts' }))[0]);
  }

  return (
    <div className="App">
      { account ?
        <div>Account: {account}</div> :
        <button onClick={requestAuth}>Connect with Metamask</button>
      }
    </div>
  );
}

export default Profile;
