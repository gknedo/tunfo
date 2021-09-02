import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import specs from "./Tunfo.json";

function Generate({useGlobalState}) {
  const [wallet] = useGlobalState('wallet');
  const [contract, setContract] = useState();

  useEffect(() => {
    setContract(new ethers.Contract(specs.address, specs.abi, wallet));
  }, [wallet, setContract]);

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
