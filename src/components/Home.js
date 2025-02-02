import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      title: "Learn at Your Pace",
      content: "Access course materials anytime, anywhere. Our platform provides flexible learning options to fit your schedule.",
      image: "/nft_images/image-removebg-preview (1).png"
    },
    {
      title: "Earn NFT Certificates",
      content: "Complete courses and receive blockchain-verified NFT certificates that prove your skills authentically.",
      image: "/nft_images/image-removebg-preview (4).png"
    },
    {
      title: "Expert Instructors",
      content: "Learn from industry professionals with real-world experience in blockchain and web development.",
      image: "/nft_images/image-removebg-preview.png"
    },
    {
      title: "Interactive Learning",
      content: "Engage with practical exercises, real-world projects, and hands-on coding experiences.",
      image: "/nft_images/WhatsApp_Image_2025_02_02_at_04_24_49_3133e679_removebg_preview.png"
    }
  ];

  return (
    <div className="home-container">
      <h1>Welcome to SkillChain</h1>
      <p>A platform which not only provides you courses, but also, a NFT is certified to the user.</p>
      <div className="home-actions">
        <Link to="/courses" className="primary-button">
          <i className="fas fa-book-open"></i>
          <span>Browse Courses</span>
        </Link>
      </div>

      <div className="features-section">
        {features.map((feature, index) => (
          <div key={index} className="feature-block">
            <div className="feature-content">
              <h2>{feature.title}</h2>
              <p>{feature.content}</p>
            </div>
            <div className="connector-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="feature-image">
              <img src={feature.image} alt={feature.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 