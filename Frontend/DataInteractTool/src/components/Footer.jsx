// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-4">
      <p>&copy; {new Date().getFullYear()} DataInteract Tool. All rights reserved.</p>
      <p>
        <a href="/privacy" className="text-gray-400 hover:text-gray-300">Privacy Policy</a> | 
        <a href="/terms" className="text-gray-400 hover:text-gray-300"> Terms of Service</a>
      </p>
    </footer>
  );
};

export default Footer;
