import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const Appone = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulating the fade-in effect
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      section.style.opacity = 0;
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.5s, transform 0.5s';
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app" style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Arial', sans-serif",
    }}>
      <div style={{ 
        height: '200px', 
        backgroundColor: '#f0f0f0', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'hotpink',
          transform: 'rotateX(45deg) rotateY(45deg)',
          transition: 'transform 0.3s'
        }}></div>
      </div>
      <header>
        <nav>
          <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
            <li><a href="#" style={{ textDecoration: 'none', color: '#333' }}>Home</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#333' }}>About</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#333' }}>Portfolio</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#333' }}>Contact</a></li>
          </ul>
        </nav>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Camera size={24} />
        </button>
      </header>
      <main>
        <section className="hero" style={{
          backgroundImage: 'linear-gradient(to bottom, #ff69b4, #ffe6cc)',
          padding: '40px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h1 style={{ marginBottom: '10px' }}>Welcome to my portfolio!</h1>
          <p style={{ marginBottom: '20px' }}>I'm a developer and designer with a passion for creating amazing digital experiences.</p>
          <button style={{
            backgroundImage: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: 'white'
          }}>
            Learn More
          </button>
        </section>
        <section className="about" style={{
          backgroundImage: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
          padding: '40px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: 'white'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#ccc',
            borderRadius: '50%',
            margin: '0 auto 20px',
            overflow: 'hidden'
          }}>
            <img src="/api/placeholder/100/100" alt="Profile Picture" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />
          </div>
          <h2 style={{ marginBottom: '10px' }}>About Me</h2>
          <p style={{ marginBottom: '20px' }}>I'm a highly motivated and detail-oriented individual with a strong passion for technology and design.</p>
          <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
            {['HTML/CSS', 'JavaScript', 'React'].map((skill, index) => (
              <li key={index} style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
                <Camera size={24} style={{ marginRight: '5px' }} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="portfolio" style={{
          backgroundImage: 'linear-gradient(to bottom, #ff4e50, #f9d423)',
          padding: '40px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Portfolio</h2>
          <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
            {[1, 2, 3].map((project) => (
              <li key={project} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#ccc',
                  margin: '0 auto 10px',
                  overflow: 'hidden'
                }}>
                  <img src={`/api/placeholder/100/100`} alt={`Project ${project}`} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }} />
                </div>
                <p>Project {project}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="contact" style={{
          backgroundImage: 'linear-gradient(to bottom, #34a853, #34a853)',
          padding: '40px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: 'white'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Get in Touch</h2>
          <form style={{ marginBottom: '20px' }}>
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }} />
            <textarea placeholder="Message" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none', minHeight: '100px' }}></textarea>
            <button style={{
              backgroundImage: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              color: 'white'
            }}>
              Send
            </button>
          </form>
          <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
            {['LinkedIn', 'Twitter', 'GitHub'].map((platform, index) => (
              <li key={index} style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
                <Camera size={24} style={{ marginRight: '5px' }} />
                <span>{platform}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <p>&copy; 2023 My Portfolio</p>
      </footer>
    </div>
  );
}

export default Appone;