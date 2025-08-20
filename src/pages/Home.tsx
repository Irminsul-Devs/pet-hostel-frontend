import { useState } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal"; // Make sure this exists
import SignupModal from "../components/SignupModal"; // Make sure this exists
import "../styles/Home.css";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const [showSignup, setShowSignup] = useState(false);

  const switchToSignUp = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <>
 
      <video autoPlay loop muted playsInline className="home-video-bg" style={{zoom: "110%"}}>
        <source src="/assets/videos/p1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Navbar />
      <div className="home-container">
        <h2 className="home-title">Welcome to Pet Hostel 🐾</h2>
        <button className="book-button" onClick={() => setShowLogin(true)}>
          Book Appointment
        </button>

        <section className="home-content">
          <p>
            Our Pet Hostel offers a cozy, safe, and loving environment for your
            furry friends while you're away. Trusted by hundreds of pet parents,
            we ensure top care for dogs, cats, and other adorable companions.
          </p>
        </section>

        {/* <section>
          <img
            src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif"
            alt="Happy pet"
            className="home-image"
          />
        </section> */}
      </div>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => switchToSignUp()}
          onSwitchToReset={() => {}}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {setShowLogin(true), setShowSignup(false)}}
        />
      )}
    </>
  );
}
