import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Pet Hostel 🐾</h1>

      <button className="book-button">Book Appointment</button>

      <section className="home-content">
        <p>
          Our Pet Hostel offers a cozy, safe, and loving environment for your furry friends while you're away.
          Trusted by hundreds of pet parents, we ensure top care for dogs, cats, and other adorable companions.
        </p>
      </section>

      <section>
        <img
          src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif"
          alt="Happy pet"
          className="home-image"
        />
      </section>
    </div>
  );
}
