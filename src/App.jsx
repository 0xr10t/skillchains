import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Navbar from './components/Navbar';
import Courses from './components/Courses';
import Profile from './components/Profile';
import ContractInteraction from './components/ContractInteraction';
import CourseVerification from './components/CourseVerification';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar isConnected={isConnected} account={account} />
        <main>
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <h1>Welcome to SkillChain</h1>
                <p>Learn, Earn NFTs, and Showcase Your Skills</p>
                {!isConnected && (
                  <button onClick={connectWallet} className="connect-button">
                    Connect Wallet to Get Started
                  </button>
                )}
              </div>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={
              <Profile web3={web3} account={account} />
            } />
            <Route path="/mint" element={
              <ContractInteraction web3={web3} account={account} />
            } />
            <Route 
              path="/verify/:courseId" 
              element={<CourseVerification web3={web3} account={account} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 