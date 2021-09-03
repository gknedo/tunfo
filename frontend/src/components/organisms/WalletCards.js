import { useEffect, useState, useCallback } from 'react';
import Card from '../molecules/Card';

function WalletCards({walletAddress, useGlobalState}) {
  const [contract] = useGlobalState('contract');
  const [currentBlock] = useGlobalState('currentBlock');
  const [cardsList, setCardsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateCardList = useCallback(async () => {
    if(!contract) return;
    const cardCount = await contract.balanceOf(walletAddress);
    setLoading(true);
    let cards = [];
    for(let i=0; i < cardCount; i++){
      cards[i] = await contract.tokenOfOwnerByIndex(walletAddress, i);
    }
    setCardsList(cards);
    setLoading(false);
  }, [walletAddress, contract]);

  useEffect(()=> {
    updateCardList();
  }, [updateCardList, currentBlock]);

  if(loading) return <div>Loading Cards...</div>;

  return (
    <div className="btn-card">
      { cardsList.map((cardId) => <Card key={cardId} cardId={cardId} useGlobalState={useGlobalState}/>) }
    </div>
  );
}

export default WalletCards;
