import { useEffect, useState, useCallback } from 'react';

function WalletCards({walletAddress, useGlobalState}) {
  const [contract] = useGlobalState('contract');
  const [cardsList, setCardsList] = useState([]);

  const updateCardList = useCallback(async () => {
    if(!contract) return;
    const cardCount = await contract.balanceOf(walletAddress);
    console.log("count");
    console.log(cardCount);
    // setCardsList(await contract.getAttributes(cardId));
  }, [cardId, contract]);

  useEffect(()=> {
    updateCardList();
  }, [updateCardList]);

  return (
    <div className="btn-card">
      -----------------------------
      <div>A: {attributes[0]}</div>
      <div>B: {attributes[1]}</div>
      <div>C: {attributes[2]}</div>
      <div>D: {attributes[3]}</div>
      <div>E: {attributes[4]}</div>
      <div>F: {attributes[5]}</div>
      <div>G: {attributes[6]}</div>
      <div>H: {attributes[7]}</div>
      <div>I: {attributes[8]}</div>
      <div>J: {attributes[9]}</div>
    </div>
  );
}

export default Card;
