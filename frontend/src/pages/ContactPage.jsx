import React, { useState } from 'react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Only one email field
    message: '',
    google_id: '' // Add Google ID field
  });
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Form data
    const data = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      google_id: formData.google_id, // Assuming you capture the Google ID in form data
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/contact/send-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send data as JSON
      });
  
      const result = await response.json();
      if (result.success) {
        // Clear form data after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
          google_id: ''
        });
        setStatusMessage('Message sent successfully!');
      } else {
        console.error('Error:', result.message);
        setStatusMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Error sending message. Please try again.');
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl mb-8">We’d love to hear from you! If you have any questions, feedback, or just want to say hi, feel free to reach out.</p>

        {/* Show the status message */}
        {statusMessage && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-md">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} method="POST" className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg text-gray-300">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 text-white rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg text-gray-300">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 text-white rounded-lg"
              required
            />
          </div>
        
          <div className="mb-4">
            <label htmlFor="message" className="block text-lg text-gray-300">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 text-white rounded-lg"
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out">
            Send Message
          </button>
        </form>
      </section>

      
    </div>
  );
};

export default ContactUsPage;
