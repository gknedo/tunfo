import { useEffect, useState, useCallback } from 'react';

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
