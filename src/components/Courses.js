import React from 'react';
import { Link } from 'react-router-dom';

const AVAILABLE_COURSES = [
  {
    id: 'web-dev',
    title: "Web Development Fundamentals",
    description: "Master the core concepts of web development with HTML, CSS, and JavaScript",
    duration: "8 weeks",
    difficulty: "Beginner",
    image: "/images/web-dev-cover.jpg",
    instructor: "John Doe",
    enrolled: 1234,
    rating: 4.8
  },
  {
    id: 'blockchain',
    title: "Blockchain Development",
    description: "Learn blockchain development from scratch with practical examples",
    duration: "12 weeks",
    difficulty: "Advanced",
    image: "/images/blockchain-cover.jpg",
    instructor: "Jane Smith",
    enrolled: 856,
    rating: 4.9
  }
];

function Courses() {
  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Available Courses</h1>
        <div className="courses-search">
          <input type="text" placeholder="Search courses..." />
          <select>
            <option value="">All Categories</option>
            <option value="web">Web Development</option>
            <option value="blockchain">Blockchain</option>
          </select>
        </div>
      </div>

      <div className="courses-grid">
        {AVAILABLE_COURSES.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <div className="course-difficulty">{course.difficulty}</div>
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-instructor">
                <img src={`/images/instructors/${course.instructor.toLowerCase().replace(' ', '-')}.jpg`} alt={course.instructor} />
                <span>{course.instructor}</span>
              </div>
              <div className="course-stats">
                <div>
                  <i className="fas fa-users"></i>
                  <span>{course.enrolled} students</span>
                </div>
                <div>
                  <i className="fas fa-star"></i>
                  <span>{course.rating}</span>
                </div>
                <div>
                  <i className="fas fa-clock"></i>
                  <span>{course.duration}</span>
                </div>
              </div>
              <div className="course-actions">
                <Link to={`/verify/${course.id}`} className="enroll-button">
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses; 