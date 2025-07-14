import "../styles/About.css";
import Navbar from "../components/Navbar";
import { FaDog, FaCat, FaShower, FaHome } from 'react-icons/fa';
import { GiSittingDog, GiBirdTwitter } from 'react-icons/gi';
import { FaSchool } from 'react-icons/fa';

export default function About() {
  return (
    <div className="about-container">
      <Navbar />
      <section className="about-hero">
        <p>Your pet's home away from home since 2015</p>
      </section>

      <section className="about-section">
        <h2>Our Story🐾</h2>
        <p>
          Founded by animal lovers, Paws & Relax was born from a simple idea: pets deserve 
          exceptional care when their families are away. What started as a small boarding 
          facility has grown into the region's most trusted pet hostel with a 98% customer 
          satisfaction rate.
        </p>
      </section>

      <section className="about-section">
        <h2>We Care For</h2>
        <div className="animal-types-single-card">
          {/* Single card containing all animals in a row */}
          <div className="animal-card-single">
            <div className="animal-row">
              {/* Dog */}
              <div className="animal-item">
                <FaDog size={40} className="animal-icon" />
                <div className="animal-text">
                  <h3>Dogs</h3>
                  <p>All breeds and sizes welcome</p>
                </div>
              </div>
              
              {/* Cat */}
              <div className="animal-item">
                <FaCat size={40} className="animal-icon" />
                <div className="animal-text">
                  <h3>Cats</h3>
                  <p>Private feline suites</p>
                </div>
              </div>
              
              {/* Bird */}
              <div className="animal-item">
                <GiBirdTwitter size={40} className="animal-icon" />
                <div className="animal-text">
                  <h3>Birds</h3>
                  <p>Specialized avian care</p>
                </div>
              </div>
              
              {/* Rabbit */}
              <div className="animal-item">
                <FaCat size={40} className="animal-icon" />
                <div className="animal-text">
                  <h3>Rabbits</h3>
                  <p>Comfortable hutches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FaHome size={24} className="service-icon" />
            <h3>Boarding</h3>
            <ul>
              <li>Spacious climate-controlled suites</li>
              <li>24/7 on-site staff</li>
              <li>Daily exercise sessions</li>
            </ul>
          </div>
          <div className="service-card">
            <FaShower size={24} className="service-icon" />
            <h3>Grooming</h3>
            <ul>
              <li>Professional bathing</li>
              <li>Coat trimming</li>
              <li>Nail clipping</li>
            </ul>
          </div>
          <div className="service-card">
            <FaSchool size={24} className="service-icon" />
            <h3>Training</h3>
            <ul>
              <li>Basic obedience</li>
              <li>Behavior modification</li>
              <li>Potty training</li>
            </ul>
          </div>
          <div className="service-card">
            <GiSittingDog size={24} className="service-icon" />
            <h3>Day Care</h3>
            <ul>
              <li>Socialization groups</li>
              <li>Supervised playtime</li>
              <li>Webcam access</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}