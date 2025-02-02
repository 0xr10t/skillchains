import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isConnected, account }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <img src="/logo.png" alt="SkillChain" className="nav-logo" />
          <span>SkillChain</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/courses">Courses</Link>
        <Link to="/profile">My Profile</Link>
        {isConnected ? (
          <div className="wallet-info">
            <span className="wallet-address">
              {account.substring(0, 6)}...{account.substring(38)}
            </span>
            <div className="wallet-status connected"></div>
          </div>
        ) : (
          <button className="connect-wallet-button">Connect Wallet</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 