import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contractABI from '../contractABI.json';
import YouTube from 'react-youtube';

// Replace this with your deployed contract address
const CONTRACT_ADDRESS = '0x02b39030F8eA9B25d3CC86b414D66bfb87029e47';
const RECIPIENT_ADDRESS = '0x141A811C87980B283aa6cC9E1B19d945FAA7ac78'; // The address to receive NFTs

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
  const videoRef = useRef(null);
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [contract, setContract] = useState(null);
  const [hasMinterRole, setHasMinterRole] = useState(false);
  const [player, setPlayer] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

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

      const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      console.log('Contract ABI:', contractABI);
      console.log('Contract methods:', contractInstance.methods);

      const code = await web3.eth.getCode(CONTRACT_ADDRESS);
      if (code === '0x' || code === '0x0') {
        throw new Error('No contract found at the specified address');
      }

      setContract(contractInstance);

      try {
        const DEFAULT_ADMIN_ROLE = await contractInstance.methods.DEFAULT_ADMIN_ROLE().call();
        console.log('DEFAULT_ADMIN_ROLE:', DEFAULT_ADMIN_ROLE);

        const MINTER_ROLE = await contractInstance.methods.MINTER_ROLE().call();
        console.log('MINTER_ROLE:', MINTER_ROLE);

        const deployerAddress = '0x141A811C87980B283aa6cC9E1B19d945FAA7ac78';
        const isDeployerAdmin = await contractInstance.methods.hasRole(DEFAULT_ADMIN_ROLE, deployerAddress).call();
        console.log('Is deployer admin:', isDeployerAdmin);

        const hasAdminRole = await contractInstance.methods.hasRole(DEFAULT_ADMIN_ROLE, account).call();
        const hasMinterRole = await contractInstance.methods.hasRole(MINTER_ROLE, account).call();
        
        console.log('Connected account roles:', {
          admin: hasAdminRole,
          minter: hasMinterRole
        });

        if (hasAdminRole) {
          if (!hasMinterRole) {
            console.log('Account is admin, attempting to grant minter role...');
            await contractInstance.methods.grantRole(MINTER_ROLE, account)
              .send({ 
                from: account,
                gas: 100000
              });
            console.log('Successfully granted minter role');
            setHasMinterRole(true);
          } else {
            setHasMinterRole(true);
          }
        } else {
          console.log('Account is not admin, checking if deployer can grant roles');
          if (isDeployerAdmin) {
            if (!hasAdminRole) {
              console.log('Requesting admin role from deployer...');
            }
          }
        }
      } catch (roleError) {
        console.error('Detailed role checking error:', roleError);
        console.warn('Role checking failed, but contract is still initialized');
      }
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

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
      listType: course.playlistId ? 'playlist' : null,
      list: course.playlistId || null,
    },
  };

  const generateNFTMetadata = (course) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    return {
      "name": `Digital Scholar: ${course.title}`,
      "description": "A prestigious digital trophy awarded for mastery completion of advanced coursework. This trophy stands as a beacon of achievement against a cyberpunk metropolis, symbolizing the bridge between education and our digital future.",
      "image": "ipfs://bafybeiccri2abnnrntvc27om5rniziiixatwukrdosylxqcsvhcohosmse",
      "attributes": [
        {
          "trait_type": "Rarity",
          "value": "Legendary"
        },
        {
          "trait_type": "Achievement Type",
          "value": "Course Completion"
        },
        {
          "trait_type": "Course",
          "value": course.title
        },
        {
          "trait_type": "Visual Theme",
          "value": "Neo-Tokyo Cyberpunk"
        },
        {
          "trait_type": "Color Scheme",
          "value": "Golden Trophy / Neon Cityscape"
        },
        {
          "trait_type": "Animation Elements",
          "value": "Dynamic Light Trails"
        },
        {
          "trait_type": "Background Features",
          "value": "Floating Planets, Cyber Buildings"
        },
        {
          "display_type": "date", 
          "trait_type": "Achievement Date",
          "value": currentTimestamp
        }
      ],
      "properties": {
        "category": "Educational Achievement",
        "creator": "SkillChain Academy",
        "collection": "Scholar's Genesis Collection",
        "generation": 1,
        "timestamp": currentTimestamp,
        "human_readable_date": new Date(currentTimestamp * 1000).toISOString()
      }
    };
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
      const hasRole = await contract.methods.hasRole(
        await contract.methods.MINTER_ROLE().call(),
        account
      ).call();

      console.log('Account has minting permission:', hasRole);

      if (!hasRole) {
        throw new Error('Account does not have minting permission. Please contact the administrator.');
      }

      const completionDate = Math.floor(Date.now() / 1000);
      
      // Generate metadata
      const metadata = generateNFTMetadata(course);
      console.log('Generated NFT Metadata:', metadata);

      // In production, you would upload this metadata to IPFS
      // For now, we'll use a placeholder URI
      const tokenURI = `ipfs://QmYourIPFSHash/${course.id}`;

      console.log('Attempting to mint with params:', {
        to: RECIPIENT_ADDRESS,
        skillName: course.skillName,
        issuer: course.issuer,
        verificationMethod: course.verificationMethod,
        completionDate,
        uri: tokenURI,
        metadata: metadata // Log the full metadata
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
        // Store metadata in local storage for future reference
        const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
        userNFTs.push({
          tokenId: receipt.events.Transfer.returnValues.tokenId,
          metadata: metadata,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber
        });
        localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
      }).on('error', (error) => {
        console.error('Transaction error:', error);
      });

      console.log('Mint transaction result:', result);
      
      if (result.status) {
        alert(`Success! NFT minted in transaction: ${result.transactionHash}\n\nYour achievement has been permanently recorded on the blockchain!`);
        navigate('/profile');
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
      } else if (error.message.includes('MINTER_ROLE')) {
        errorMessage += 'Account does not have minting permission. Please contact the administrator.';
      } else {
        errorMessage += `Error details: ${error.message}\n\nPlease check the console for more information.`;
      }
      
      alert(errorMessage);
    } finally {
      setIsMinting(false);
    }
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
          {!hasMinterRole && (
            <p className="warning">Note: Your account needs MINTER_ROLE to mint NFTs</p>
          )}
          <button 
            className="mint-button"
            onClick={() => mintCompletionNFT}
            
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