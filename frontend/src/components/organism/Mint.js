import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import specs from "./Tunfo.json";

function Mint({useGlobalState}) {
  const [wallet] = useGlobalState('wallet');
  const [contract, setContract] = useState();

  useEffect(() => {
    setContract(new ethers.Contract(specs.address, specs.abi, wallet));
  }, [wallet, setContract]);

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
