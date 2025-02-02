import React, { useState } from 'react';
import contractABI from '../contractABI.json';

const CONTRACT_ADDRESS = '0x02b39030F8eA9B25d3CC86b414D66bfb87029e47'; // Replace with your deployed contract address

function ContractInteraction({ web3, account }) {
  const [formData, setFormData] = useState({
    recipient: '',
    skillName: '',
    issuer: '',
    verificationMethod: '',
    uri: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const mintNFT = async (e) => {
    e.preventDefault();
    try {
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      const completionDate = Math.floor(Date.now() / 1000);
      
      await contract.methods.mintNFT(
        formData.recipient,
        formData.skillName,
        formData.issuer,
        formData.verificationMethod,
        completionDate,
        formData.uri
      ).send({ from: account });

      alert('NFT minted successfully!');
      setFormData({
        recipient: '',
        skillName: '',
        issuer: '',
        verificationMethod: '',
        uri: ''
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT. Check console for details.');
    }
  };

  return (
    <div className="contract-interaction">
      <h2>Mint Course Completion NFT</h2>
      <form onSubmit={mintNFT} className="mint-form">
        <div className="form-group">
          <label>Recipient Address:</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            placeholder="0x..."
            required
          />
        </div>
        <div className="form-group">
          <label>Skill Name:</label>
          <input
            type="text"
            name="skillName"
            value={formData.skillName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Issuer:</label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Verification Method:</label>
          <input
            type="text"
            name="verificationMethod"
            value={formData.verificationMethod}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Token URI:</label>
          <input
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="mint-button">
          Mint NFT
        </button>
      </form>
    </div>
  );
}

export default ContractInteraction; 