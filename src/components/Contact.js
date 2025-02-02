import React from 'react';
import './Contact.css';

const teamMembers = [
  {
    name: "Vrinda Agarwal",
    email: "vrinda_a@me.iitr.ac.in",
    phone: "8769210077",
    image: "/team/vrinda.jpeg"
  },
  {
    name: "Akshat Goyal",
    email: "akshat_g1@me.iitr.ac.in",
    phone: "7973132253",
    image: "/team/akshat.jpeg"
  },
  {
    name: "Soham Vijay",
    email: "soham_v@me.iitr.ac.in",
    phone: "7877749299",
    image: "/team/soham.jpeg"
  },
  {
    name: "Simreet Kaur",
    email: "simreet_kg@me.iitr.ac.in",
    phone: "7973132253",
    image: "/team/simreet.jpeg"
  }
];

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact </h1>
      </div>
      
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member-card">
            <div className="member-image">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="member-info">
              <h2>{member.name}</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{member.phone}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact; 