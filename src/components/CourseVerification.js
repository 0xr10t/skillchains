import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contractABI from '../contractABI.json';
import YouTube from 'react-youtube';

// Contract address and recipient
const CONTRACT_ADDRESS = '0x02b39030F8eA9B25d3CC86b414D66bfb87029e47';
const RECIPIENT_ADDRESS = '0x141A811C87980B283aa6cC9E1B19d945FAA7ac78';

const SAMPLE_COURSES = {
  'web-dev': {
    id: 1,
    title: 'Web Development Fundamentals',
    videoId: 'HcOc7P5BMi4',
    playlistId: 'PLfqMhTWNBTe0PY9xunOzsP5kmYIz2Hu7i',
    skillName: 'HTML & CSS Basics',
    issuer: 'SkillChain Academy',
    verificationMethod: 'Video Completion'
  },
  'blockchain': {
    id: 2,
    title: 'Blockchain Development',
    videoId: '-1GB6m39-rM',
    skillName: 'Blockchain Fundamentals',
    issuer: 'SkillChain Academy',
    verificationMethod: 'Video Completion'
  }
};

function CourseVerification({ web3, account }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [contract, setContract] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [player, setPlayer] = useState(null);

  const course = SAMPLE_COURSES[courseId];

  useEffect(() => {
    if (web3 && account) {
      initializeContract();
    }
  }, [web3, account]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const initializeContract = async () => {
    try {
      console.log('Initializing contract with address:', CONTRACT_ADDRESS);
      console.log('Connected account:', account);
      
      if (!web3) {
        throw new Error('Web3 is not initialized');
      }

      // Get the current network ID
      const networkId = await web3.eth.net.getId();
      console.log('Current network ID:', networkId);

      const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      // Check if contract exists
      try {
        const code = await web3.eth.getCode(CONTRACT_ADDRESS);
        console.log('Contract code:', code);
        
        if (code === '0x' || code === '0x0') {
          throw new Error(`No contract found at ${CONTRACT_ADDRESS} on network ${networkId}. Please make sure you're connected to the correct network and the contract address is correct.`);
        }
      } catch (error) {
        console.error('Error checking contract code:', error);
        throw new Error(`Failed to verify contract at ${CONTRACT_ADDRESS}. Are you connected to the correct network?`);
      }

      setContract(contractInstance);
      console.log('Contract initialized successfully');

    } catch (error) {
      console.error('Error initializing contract:', error);
      alert('Error initializing contract: ' + error.message);
    }
  };

  const onPlayerReady = (event) => {
    const playerInstance = event.target;
    setPlayer(playerInstance);
  };

  const onStateChange = (event) => {
    const playerInstance = event.target;
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    if (event.data === 1) {
      setIsWatching(true);
      const id = setInterval(() => {
        const currentTime = playerInstance.getCurrentTime();
        const duration = playerInstance.getDuration();
        const currentProgress = (currentTime / duration) * 100;
        setProgress(currentProgress);
        
        if (currentProgress >= 90 && !isCompleted) {
          setIsCompleted(true);
        }
      }, 1000);
      setIntervalId(id);
    } else {
      setIsWatching(false);
    }
  };

  const mintCompletionNFT = async () => {
    if (!web3 || !account) {
      alert('Please connect your wallet first');
      return;
    }

    if (!contract) {
      alert('Contract not initialized');
      return;
    }

    setIsMinting(true);
    try {
      const completionDate = Math.floor(Date.now() / 1000);
      const tokenURI = `ipfs://QmYourIPFSHash/${course.id}`;

      console.log('Attempting to mint with params:', {
        to: RECIPIENT_ADDRESS,
        skillName: course.skillName,
        issuer: course.issuer,
        verificationMethod: course.verificationMethod,
        completionDate,
        uri: tokenURI
      });

      const result = await contract.methods.mintNFT(
        RECIPIENT_ADDRESS,
        course.skillName,
        course.issuer,
        course.verificationMethod,
        completionDate,
        tokenURI
      ).send({ 
        from: account,
        gas: 200000
      }).on('transactionHash', (hash) => {
        console.log('Transaction sent with hash:', hash);
      }).on('receipt', (receipt) => {
        console.log('Transaction was mined in block:', receipt.blockNumber);
      }).on('error', (error) => {
        console.error('Transaction error:', error);
      });

      console.log('Mint transaction result:', result);
      
      if (result.status) {
        alert(`Success! NFT minted in transaction: ${result.transactionHash}`);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Detailed minting error:', error);
      let errorMessage = 'Error minting NFT.\n\n';
      
      if (error.message.includes('User denied')) {
        errorMessage += 'Transaction was rejected by user.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage += 'Insufficient funds for gas.';
      } else {
        errorMessage += `Error details: ${error.message}\n\nPlease check the console for more information.`;
      }
      
      alert(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
      listType: course.playlistId ? 'playlist' : null,
      list: course.playlistId || null,
    },
  };

  if (!course) {
    return <div className="verification-container">Course not found</div>;
  }

  return (
    <div className="verification-container">
      <h2>{course.title} - Verification</h2>
      
      <div className="video-container">
        <YouTube
          videoId={course.videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>

      {course.playlistId && (
        <div className="playlist-info">
          <p>This is a complete course playlist. You can navigate through all videos using the playlist controls.</p>
          <p>Note: You need to watch at least 90% of the current video to earn the NFT.</p>
        </div>
      )}

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{Math.round(progress)}% completed</span>
      </div>

      {isCompleted && (
        <div className="completion-section">
          <h3>🎉 Course Completed!</h3>
          <p>You can now mint your completion NFT.</p>
          <button 
            className="mint-button"
            onClick={mintCompletionNFT}
            disabled={isMinting}
          >
            {isMinting ? 'Minting...' : 'Mint Completion NFT'}
          </button>
        </div>
      )}

      {!isCompleted && isWatching && (
        <div className="watching-message">
          <p>Keep watching to earn your completion NFT!</p>
        </div>
      )}
    </div>
  );
}

export default CourseVerification;