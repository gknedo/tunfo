import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Profile from './components/organism/Profile';
import Mint from './components/organism/Mint';
import { ethers } from "ethers";
import { createGlobalState } from 'react-hooks-global-state';

window.ethereum.on('accountsChanged', (accounts) => {
  document.location.reload();
});

const initialState = {
  wallet: null,
  provider: null,
  address: null,
  balance: null,
  currentBlock: 0,
  lastUpdate: Date.now(),
};

const { useGlobalState } = createGlobalState(initialState);

function App() {
  const [address, setAddress] = useGlobalState('address');
  const [provider, setProvider] = useGlobalState('provider');
  const [wallet, setWallet] = useGlobalState('wallet');
  const [balance, setBalance] = useGlobalState('balance');
  const [currentBlock, setCurrentBlock] = useGlobalState('currentBlock');
  const [date, setDate] = useState(Date.now())

  useEffect(() => {
    if(!window.ethereum.selectedAddress) return;
    setAddress(window.ethereum.selectedAddress);
  }, [setAddress]);

  useEffect( () => {
    if(!address) return;
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(newProvider);
    setWallet(newProvider.getSigner());
  }, [address, setProvider, setWallet]);

  const updateBalance = useCallback(async () => {
    if(!wallet) return;
    const balance = await wallet.getBalance();
    setBalance(ethers.utils.formatEther(balance));
  }, [wallet, setBalance]);

  const updateCurrentBlock = useCallback(async () => {
    if(!provider) return;
    setCurrentBlock(await provider.getBlockNumber());
  }, [provider, setCurrentBlock]);

  useEffect(() => {
    updateBalance()
  }, [updateBalance, currentBlock]);

  useEffect(() => {
    const tick = () => {
      setDate(Date.now());
      updateCurrentBlock();
    };

    const timerID = setTimeout(() => tick(), 5000);
    return () => {
      clearTimeout(timerID);
    };
  }, [date, setDate, updateCurrentBlock]);

  return (
      <div className="App">
        <Profile useGlobalState={useGlobalState}/>
        { address && <div>
          Your balance is: {balance}
          <Mint useGlobalState={useGlobalState}/>
        </div>}
        <div>
        {currentBlock} - {date}
        </div>
      </div>
    
  );
}

export default App;
