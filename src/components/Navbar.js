import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isConnected, account, onConnectWallet }) {
  return (
    <nav className="navbar">
      {/* Left section - Empty for balance */}
      <div></div>

      {/* Center section - Navigation */}
      <div className="nav-links">
        <Link to="/" className="home-button">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/profile" className="profile-button">
          <i className="fas fa-user"></i>
          <span>My Profile</span>
        </Link>
        <Link to="/contact" className="contact-button">
          <i className="fas fa-address-card"></i>
          <span>Contact Us</span>
        </Link>
        {isConnected ? (
          <div className="wallet-info">
            <i className="fas fa-wallet"></i>
            <span>{account.substring(0, 6)}...{account.substring(38)}</span>
          </div>
        ) : (
          <button 
            className="connect-wallet-button"
            onClick={onConnectWallet}
          >
            <i className="fas fa-wallet"></i>
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

      {/* Right section - Empty for balance */}
      <div></div>
    </nav>
  );
}

export default Navbar; 