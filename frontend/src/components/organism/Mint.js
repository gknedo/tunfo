import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import specs from "./Tunfo.json";

function Mint({useGlobalState}) {
  const [wallet] = useGlobalState('wallet');
  const [contract, setContract] = useState();

  useEffect(() => {
    setContract(new ethers.Contract(specs.address, specs.abi, wallet));
  }, [wallet, setContract]);

  const mint = async (wallet) => {
    const address = await wallet.getAddress();
    console.log(address);
    await contract.safeMint(address);
  }

  return (
    <div className="App">
      <button onClick={() => mint(wallet)}>Mint</button>
    </div>
  );
}

export default Mint;
