import React, { useState, useEffect } from 'react';
import contractABI from '../contractABI.json';
import { getImageFromPinata } from '../utils/pinata';

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

      let tokenId = 1;
      const userNFTs = [];
      let consecutiveFailures = 0;
      const MAX_FAILURES = 3;

      while (consecutiveFailures < MAX_FAILURES) {
        try {
          console.log(`Checking token ID: ${tokenId}`);
          const owner = await contract.methods.ownerOf(tokenId).call();
          console.log(`Token ${tokenId} owner:`, owner);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            console.log(`Found NFT owned by user: ${tokenId}`);
            try {
              const metadata = await contract.methods.getMetadata(tokenId).call();
              console.log(`Metadata for token ${tokenId}:`, metadata);
              
              // Get image from Pinata using the skill name as the file name
              const skillName = metadata[0];
              console.log('About to call getImageFromPinata with skill name:', skillName);
              
              // Ensure the skill name is properly encoded for URLs
              const encodedSkillName = encodeURIComponent(skillName);
              console.log('Encoded skill name:', encodedSkillName);
              
              let imageUrl = null;
              try {
                console.log('Calling getImageFromPinata...');
                imageUrl = await getImageFromPinata(encodedSkillName);
                console.log('Response from getImageFromPinata:', imageUrl);
              } catch (imageError) {
                console.error('Error in getImageFromPinata:', imageError);
                imageUrl = null;
              }
              
              // For testing, let's use a default image if Pinata fails
              if (!imageUrl) {
                console.log('Using default image URL');
                imageUrl = `https://via.placeholder.com/300x200?text=${encodedSkillName}`;
              }
              
              const nftData = {
                tokenId,
                skillName: metadata[0],
                issuer: metadata[1],
                verificationMethod: metadata[2],
                completionDate: metadata[3],
                image: imageUrl
              };
              
              console.log('Created NFT data object:', nftData);
              userNFTs.push(nftData);
              
              consecutiveFailures = 0;
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

      console.log('All found NFTs:', userNFTs);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error in loadNFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My NFT Collection</h2>
        <div className="header-actions">
          <button 
            className="refresh-button"
            onClick={loadNFTs}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </span>
            ) : (
              <span>
                <i className="fas fa-sync-alt"></i> Refresh
              </span>
            )}
          </button>
        </div>
      </div>

      {nfts.length === 0 ? (
        <div className="no-nfts">
          <i className="fas fa-certificate fa-3x" style={{ color: 'var(--primary-color)' }}></i>
          <h3>No NFTs Found</h3>
          <p>Complete a course to earn your first NFT certificate!</p>
        </div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <div className="nft-image">
                {nft.image ? (
                  <img src={nft.image} alt={nft.skillName} />
                ) : (
                  <div className="placeholder-image">
                    <i className="fas fa-certificate fa-3x"></i>
                  </div>
                )}
              </div>
              <div className="nft-content">
                <h3>{nft.skillName || 'Unnamed Skill'}</h3>
                <div className="nft-details">
                  <p>
                    <i className="fas fa-hashtag"></i>
                    <span>Token ID: {nft.tokenId}</span>
                  </p>
                  <p>
                    <i className="fas fa-user-graduate"></i>
                    <span>Issuer: {nft.issuer || 'Unknown Issuer'}</span>
                  </p>
                  <p>
                    <i className="fas fa-check-circle"></i>
                    <span>Verification: {nft.verificationMethod || 'Not Specified'}</span>
                  </p>
                  {nft.completionDate && (
                    <p>
                      <i className="fas fa-calendar-check"></i>
                      <span>Completed: {new Date(Number(nft.completionDate) * 1000).toLocaleDateString()}</span>
                    </p>
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