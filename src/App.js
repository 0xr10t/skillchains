import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import Profile from './components/Profile';
import ContractInteraction from './components/ContractInteraction';
import CourseVerification from './components/CourseVerification';
import Contact from './components/Contact';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet. Please try again.');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isConnected={!!account} 
          account={account}
          onConnectWallet={connectWallet}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/courses" 
            element={<Courses web3={web3} account={account} />} 
          />
          <Route 
            path="/profile" 
            element={<Profile web3={web3} account={account} />} 
          />
          <Route 
            path="/mint" 
            element={<ContractInteraction web3={web3} account={account} />} 
          />
          <Route 
            path="/verify/:courseId" 
            element={<CourseVerification web3={web3} account={account} />} 
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 