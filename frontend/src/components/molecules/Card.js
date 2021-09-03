import { useEffect, useState, useCallback } from 'react';
import RARITIES from '../../fixtures/rarities.json';
import TYPES from '../../fixtures/types.json';

function Card({cardId, useGlobalState}) {
  const [contract] = useGlobalState('contract');
  const [attributes, setAttributes] = useState([]);

  const updateAttributes = useCallback(async () => {
    if(!contract) return;
    setAttributes(await contract.getAttributes(cardId));
  }, [cardId, contract]);

  useEffect(()=> {
    updateAttributes();
  }, [updateAttributes]);

  if(isNaN(attributes[0])) return (`Loading ${cardId.toNumber()}...`);
  return (
    <div className="btn-card">
      -----------------------------
      <div># {cardId.toNumber()}</div>
      <div>Animal: {Object.keys(TYPES)[attributes[0]]}</div>
      <div>Rarity: {Object.keys(RARITIES)[attributes[1]]}</div>
      <div>Generation: {attributes[2]}</div>
      <div>Donation: ${attributes[3]}</div>
      <div>POW: {attributes[4]}</div>
      <div>VIT: {attributes[5]}</div>
      <div>RES: {attributes[6]}</div>
      <div>AGI: {attributes[7]}</div>
      <div>INT: {attributes[8]}</div>
      <div>CHA: {attributes[9]}</div>
    </div>
  );
}

export default Card;
