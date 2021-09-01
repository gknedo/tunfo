import { useState } from 'react';
import './App.css';
import Profile from './components/organism/Profile';
import Mint from './components/organism/Mint';

function App() {
  const [account, setAccount] = useState()

  return (
    <div className="App">
      <Profile account={account} setAccount={setAccount}/>
      { account && <Mint account={account}/> }
      
    </div>
  );
}

export default App;
