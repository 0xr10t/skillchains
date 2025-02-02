import React, { useState, useEffect } from 'react';
import contractABI from '../contractABI.json';

const CONTRACT_ADDRESS = '0x02b39030F8eA9B25d3CC86b414D66bfb87029e47';

function Profile({ web3, account }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    if (web3 && account) {
      loadNFTs();
    }
  }, [web3, account]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      console.log('Loading NFTs for account:', account);
      
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      console.log('Contract initialized');

      // Start from token ID 1 and increment until we find a gap
      let tokenId = 1;
      const userNFTs = [];
      let consecutiveFailures = 0;
      const MAX_FAILURES = 3; // Stop after 3 consecutive non-existent tokens

      while (consecutiveFailures < MAX_FAILURES) {
        try {
          console.log(`Checking token ID: ${tokenId}`);
          const owner = await contract.methods.ownerOf(tokenId).call();
          console.log(`Token ${tokenId} owner:`, owner);
          
          // Compare addresses in lowercase
          if (owner.toLowerCase() === account.toLowerCase()) {
            console.log(`Found NFT owned by user: ${tokenId}`);
            try {
              // Get metadata for this NFT
              const metadata = await contract.methods.getMetadata(tokenId).call();
              console.log(`Metadata for token ${tokenId}:`, metadata);
              
              userNFTs.push({
                tokenId,
                skillName: metadata[0], // Access array elements directly
                issuer: metadata[1],
                verificationMethod: metadata[2],
                completionDate: metadata[3]
              });
              
              consecutiveFailures = 0; // Reset failure counter on success
            } catch (metadataError) {
              console.error(`Error fetching metadata for token ${tokenId}:`, metadataError);
            }
          }
          tokenId++;
        } catch (error) {
          console.log(`Error checking token ${tokenId}:`, error.message);
          consecutiveFailures++;
          tokenId++;
        }
      }

      console.log('Found NFTs:', userNFTs);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error in loadNFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!web3 || !account) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <p>Please connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <p>Loading your NFTs...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Course Completion NFTs</h2>
        <div className="header-actions">
          <button 
            className="refresh-button"
            onClick={loadNFTs}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh NFTs'}
          </button>
          {/* <button 
            className="debug-button"
            onClick={() => {
              console.log('Current account:', account);
              console.log('Contract address:', CONTRACT_ADDRESS);
              loadNFTs();
            }}
          >
            Debug
          </button> */}
          <div className="wallet-info">
            Connected: {account.substring(0, 6)}...{account.substring(38)}
          </div>
        </div>
      </div>

      {nfts.length === 0 ? (
        <div className="no-nfts">
          <p>You haven't earned any course completion NFTs yet.</p>
          <p>Complete a course to earn your first NFT!</p>
        </div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <div className="nft-content">
                <h3>{nft.skillName || 'Unnamed Skill'}</h3>
                <div className="nft-details">
                  <p><strong>Token ID:</strong> {nft.tokenId}</p>
                  <p><strong>Issuer:</strong> {nft.issuer || 'Unknown Issuer'}</p>
                  <p><strong>Verification:</strong> {nft.verificationMethod || 'Not Specified'}</p>
                  {nft.completionDate && (
                    <p><strong>Completed:</strong> {new Date(Number(nft.completionDate) * 1000).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile; 