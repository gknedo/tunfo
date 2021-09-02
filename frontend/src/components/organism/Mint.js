import { ethers } from 'ethers';

function Mint({useGlobalState}) {
  const [wallet] = useGlobalState('wallet');

  const mint = async (wallet) => {
    const transaction = {
      to: "0xc8C14a050D33A178DEbF2D92EaEb5784D13C83e2",
      value: ethers.utils.parseEther("100"),
    };

    await wallet.sendTransaction(transaction);
  }

  return (
    <div className="App">
      <button onClick={() => mint(wallet)}>Mint</button>
    </div>
  );
}

export default Mint;
