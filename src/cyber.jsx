import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaInfo, FaQuestion } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="flex justify-between items-center p-6 bg-gray-800">
        <div className="text-2xl font-bold">CyberPunk</div>
        <div className="space-x-4">
          <a href="#home" className="hover:text-pink-500"><FaHome /></a>z
          <a href="#about" className="hover:text-pink-500"><FaInfo /></a>
          <a href="#faq" className="hover:text-pink-500"><FaQuestion /></a>
        </div>
      </nav>
      <section id="home" className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h1 className="text-5xl font-bold">Welcome to the CyberPunk World</h1>
          <p className="mt-4 text-xl">Experience the future today.</p>
        </motion.div>
      </section>
      <section id="about" className="p-10 bg-gray-800">
        <h2 className="text-4xl font-bold">About Us</h2>
        <p className="mt-4 text-lg">We are pioneers in cyberpunk technology...</p>
      </section>
      <section id="faq" className="p-10 bg-gray-700">
        <h2 className="text-4xl font-bold">FAQ</h2>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold">What is CyberPunk?</h3>
          <p className="mt-2">CyberPunk is a subgenre of science fiction...</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
