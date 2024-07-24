import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Link to="/" className="text-lg font-bold gradient-text">
          Portfolio
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/about" className="text-lg font-bold hover:text-primary">
          About
        </Link>
        <Link to="/projects" className="text-lg font-bold hover:text-primary ml-4">
          Projects
        </Link>
        <Link to="/contact" className="text-lg font-bold hover:text-primary ml-4">
          Contact
        </Link>
      </div>
    </nav>
  );
}


function Hero() {
  return (
    <div className="neomorphic mt-12">
      <h1 className="text-4xl font-bold gradient-text">
        Welcome to my portfolio!
      </h1>
      <p className="text-lg font-medium text-gray-500 mt-4">
        I'm a full-stack developer with a passion for building amazing projects.
      </p>
      <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-4">
        Explore my projects
      </button>
    </div>
  );
}


function About() {
  return (
    <div className="neomorphic mt-12">
      <h1 className="text-4xl font-bold gradient-text">
        About me
      </h1>
      <p className="text-lg font-medium text-gray-500 mt-4">
        I'm a full-stack developer with a passion for building amazing projects. I have experience with React, Node.js, and MongoDB.
      </p>
      <div className="flex items-center mt-4">
        <img src="https://picsum.photos/200" alt="Profile picture" className="w-20 h-20 rounded-full" />
        <div className="ml-4">
          <h2 className="text-lg font-bold">John Doe</h2>
          <p className="text-lg font-medium text-gray-500">Full-stack developer</p>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="neomorphic mt-12">
      <h1 className="text-4xl font-bold gradient-text">
        My projects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="neomorphic">
          <h2 className="text-lg font-bold">Project 1</h2>
          <p className="text-lg font-medium text-gray-500">This is a project 1 description.</p>
          <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-4">
            View project
          </button>
        </div>
        <div className="neomorphic">
          <h2 className="text-lg font-bold">Project 2</h2>
          <p className="text-lg font-medium text-gray-500">This is a project 2 description.</p>
          <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-4">
            View project
          </button>
        </div>
        <div className="neomorphic">
          <h2 className="text-lg font-bold">Project 3</h2>
          <p className="text-lg font-medium text-gray-500">This is a project 3 description.</p>
          <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-4">
            View project
          </button>
        </div>
      </div>
    </div>
  );
}


function Contact() {
  return (
    <div className="neomorphic mt-12">
      <h1 className="text-4xl font-bold gradient-text">
        Get in touch
      </h1>
      <p className="text-lg font-medium text-gray-500 mt-4">
        If you have any questions or want to collaborate on a project, feel free to reach out to me.
      </p>
      <form className="mt-4">
        <input type="text" placeholder="Name" className="w-full p-2 mb-4 border border-gray-500 rounded-lg" />
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border border-gray-500 rounded-lg" />
        <textarea placeholder="Message" className="w-full p-2 mb-4 border border-gray-500 rounded-lg" />
        <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-4">
          Send message
        </button>
      </form>
    </div>
  );
}




function LandingPage1() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto p-4">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>
    </Router>
  );
}

export default LandingPage1;