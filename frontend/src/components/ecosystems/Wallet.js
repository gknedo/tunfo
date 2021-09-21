import React, { useCallback, useEffect, useState } from 'react';
import Profile from '../../components/organisms/Profile';
import Mint from '../../components/molecules/Mint';
import Generate from '../../components/molecules/Generate';
import WalletCards from '../../components/organisms/WalletCards';
import { ethers } from "ethers";
import { createGlobalState } from 'react-hooks-global-state';
import specs from "../../assets/Tunfo.json";

const initialState = {
  wallet: null,
  provider: null,
  address: null,
  balance: null,
  contract: null,
  currentBlock: 0
};

const { useGlobalState } = createGlobalState(initialState);

function Wallet() {
  const [address, setAddress] = useGlobalState('address');
  const [provider, setProvider] = useGlobalState('provider');
  const [wallet, setWallet] = useGlobalState('wallet');
  const [balance, setBalance] = useGlobalState('balance');
  const [currentBlock, setCurrentBlock] = useGlobalState('currentBlock');
  const [setContract] = useGlobalState('contract');
  const [date, setDate] = useState(Date.now());

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

  useEffect(() => {
    if(!wallet) return;
    setContract(new ethers.Contract(specs.address, specs.abi, wallet));
  }, [wallet, setContract]);

  return (
      <div className="wallet">
        <div>
          {currentBlock} - {date}
        </div>
        <Profile useGlobalState={useGlobalState}/>
        { address && <div>
          Your balance is: {balance}
          <Mint useGlobalState={useGlobalState}/>
          <Generate useGlobalState={useGlobalState}/>
          <WalletCards walletAddress={address} useGlobalState={useGlobalState}/>
        </div>}
      </div>
    
  );
}

export default Wallet;
