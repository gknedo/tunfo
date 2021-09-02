import { useCallback } from 'react';

function Profile({useGlobalState}) {
  const [address, setAddress] = useGlobalState('address');
  const [wallet] = useGlobalState('wallet');
  
  const requestAuth = useCallback(async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(accounts[0]);
  }, [setAddress]);

  return (
    <div className="App">
      { wallet ?
        <div>Account: {address}</div> :
        <button onClick={requestAuth}>Connect with Metamask</button>
      }
    </div>
  );
}

export default Profile;
