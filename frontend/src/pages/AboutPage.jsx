import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl mb-8">
          Welcome to RecipeShare, where food enthusiasts come together to explore and share
          delicious recipes from around the world. Our mission is to inspire creativity in the
          kitchen and make cooking a joyful experience for everyone.
        </p>
        <p className="text-lg mb-4 text-gray-300">
          At RecipeShare, we believe that food has the power to bring people together and create
          lasting memories. Whether you're an experienced chef or a beginner, our platform offers
          a wide range of recipes that cater to all tastes and skill levels.
        </p>
        <p className="text-lg text-gray-300">
          Join us in exploring the world of flavors, and let’s cook something amazing together!
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-400 py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 RecipeShare. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-gray-200">Privacy Policy</a>
            <a href="#" className="hover:text-gray-200">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
