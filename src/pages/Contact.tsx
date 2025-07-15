import "../styles/Contact.css";
import Navbar from "../components/Navbar";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
export default function Contact() {
  return (
    <div className="contact-container">
      <Navbar/>
    <div className="bg-white p-6 md:p-12 rounded-lg shadow-md max-w-5xl mx-auto mt-10">
<h2 className="contact-heading">Get in Touch</h2>
<div className="contact-info-row">
  <div className="info-card">
    <FaMapMarkerAlt className="info-icon" />
    <p className="info-title">Our Location</p>
    <p className="info-detail">123 Pet Street, Dogtown</p>
  </div>
  <div className="info-card">
    <FaPhoneAlt className="info-icon" />
    <p className="info-title">Phone</p>
    <p className="info-detail">+91 98765 43210</p>
  </div>
  <div className="info-card">
    <FaEnvelope className="info-icon" />
    <p className="info-title">Email</p>
    <p className="info-detail">support@pethostel.com</p>
  </div>
</div>


 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
   
        <div>
          <h3 className="text-xl font-semibold mb-2">Message us / Call us</h3>
          <p className="text-gray-700">
            In case of change in appointment or any detailed queries, feel free to contact us.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
