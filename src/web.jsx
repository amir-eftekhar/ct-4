import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Brain, Zap, Globe, Menu, X } from 'lucide-react';

const Main = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <footer className="text-center py-4 text-gray-400">
        © 2023 Brainwave. All rights reserved.
      </footer>
    </div>
  );
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    return (
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg py-4 sticky top-0 z-50"
      >
        <nav className="container mx-auto flex justify-between items-center px-4">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Brainwave</span>
          </motion.div>
  
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            {['Features', 'Pricing', 'How to Use', 'Roadmap'].map((item) => (
              <motion.li key={item} whileHover={{ scale: 1.1 }}>
                <a href="#" className="hover:text-purple-400 transition-colors">{item}</a>
              </motion.li>
            ))}
          </ul>
  
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
  
          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-2">
            <NavButton>New Account</NavButton>
            <NavButton primary>Sign In</NavButton>
          </div>
        </nav>
  
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-800 bg-opacity-95 backdrop-filter backdrop-blur-lg"
            >
              <ul className="flex flex-col items-center py-4">
                {['Features', 'Pricing', 'How to Use', 'Roadmap'].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ scale: 1.1 }}
                    className="my-2"
                  >
                    <a href="#" className="text-white hover:text-purple-400 transition-colors">{item}</a>
                  </motion.li>
                ))}
                <li className="mt-4 space-y-2">
                  <NavButton fullWidth>New Account</NavButton>
                  <NavButton primary fullWidth>Sign In</NavButton>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  };
  
  const NavButton = ({ children, primary, fullWidth }) => (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full transition-all duration-300 ${
        primary 
          ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400" 
          : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
      } ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </motion.button>
  );
  
const HeroSection = () => (
  <section className="py-20 text-center relative overflow-hidden">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 relative z-10"
    >
      <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Explore the Possibilities of AI Chatting with Brainwave
      </h1>
      <p className="text-xl mb-8 text-gray-300">Unleash the power of AI within Brainwave. Upgrade your productivity with Brainwave, the open AI chat app.</p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-lg font-semibold transition-all duration-300"
      >
        Get Started
        <ChevronRight className="inline ml-2" />
      </motion.button>
    </motion.div>
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }} 
      transition={{ 
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 rounded-full opacity-20 filter blur-3xl"
    />
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
  >
    <Icon className="w-12 h-12 mb-4 text-purple-400" />
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FeaturesSection = () => (
  <section className="py-20 bg-gray-900 bg-opacity-50">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
      >
        Chat Smarter, Not Harder with Brainwave
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Brain}
          title="Ask anything" 
          description="Quickly find answers without searching multiple sources."
        />
        <FeatureCard 
          icon={Zap}
          title="Improve everyday" 
          description="Natural language processing for accurate, relevant responses."
        />
        <FeatureCard 
          icon={Globe}
          title="Connect everywhere" 
          description="Access the AI chatbot from any device, anywhere."
        />
      </div>
    </div>
  </section>
);

const PricingCard = ({ name, price, features }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg text-center"
  >
    <h3 className="text-2xl font-semibold mb-4">{name}</h3>
    <p className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{price}</p>
    <ul className="mb-6 space-y-2">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center">
          <Check className="text-green-400 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all duration-300"
    >
      {name === "Enterprise" ? "Contact Us" : "Get Started"}
    </motion.button>
  </motion.div>
);

const PricingSection = () => (
  <section className="py-20 bg-gray-900 bg-opacity-50">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
      >
        Choose Your Plan
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard 
          name="Basic" 
          price="$0" 
          features={["AI chatbot", "Personalized recommendations", "Explore app features"]}
        />
        <PricingCard 
          name="Premium" 
          price="$9.99" 
          features={["Advanced AI chatbot", "Priority support", "Analytics dashboard"]}
        />
        <PricingCard 
          name="Enterprise" 
          price="Contact Us" 
          features={["Custom AI chatbot", "Advanced analytics", "Dedicated account"]}
        />
      </div>
    </div>
  </section>
);

export default Main;