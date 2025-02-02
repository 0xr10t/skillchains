import React from 'react';

function Header({ isConnected, account, connectWallet }) {
  return (
    <header className="header">
      <div className="logo">
        <h1>Course Completion NFT</h1>
      </div>
      <div className="wallet-info">
        {isConnected ? (
          <div className="account-info">
            <span>Connected: {account.substring(0, 6)}...{account.substring(38)}</span>
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}

export default Header; 