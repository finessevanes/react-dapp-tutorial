import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"

function App() {
  const [ greeting, setGreetingValue ] = useState('')
  const [ userAccount, setUserAccount ] = useState('')
  const [ amount, setAmount ] = useState(0)

  // method to connect to wallet; this will ask the end user to connect the waller
  async function requestAccount() {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined'){
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} of coins sent to ${userAccount}`)
    }
  }

  async function fetchGreeting() {
    if ( typeof window.ethereum !== 'undefined'){
      // what is the provider parameter?
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // contract function therters.Contract(deployment #, GreeterABI (what is that?), provider )
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet()
        console.log('data', data)
      } catch (err) {
        console.log('error', err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if ( typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreeting('')
      await transaction.wait()
      fetchGreeting()
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
        onChange={e => setGreetingValue(e.target.value)}
        placeholder="Set Greeting"
        value={greeting}
        ></input>
         <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
