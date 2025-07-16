import React, { useState, useEffect } from 'react';
import Footer from './Footer';

const messages = [
  'Welcome to Unified Job Portal',
  'Find Jobs Tailored Just for You',
  'Hire Top Talent with Ease',
  'Fast, Smart & Secure Hiring',
  'Empowering Employers and Job Seekers'
];

function Home() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setIndex(prev => (prev + 1) % messages.length); // change message
        setFade(true); // trigger fade in
      }, 500); // wait 500ms before switching
    }, 4000); // total duration per message

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#000000ff'
    }}>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
      }}>
        <h1 style={{
          position: 'absolute',
          fontSize: '48px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          background: 'linear-gradient(90deg, #00C9FF, #92FE9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0,201,255,0.3)',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          whiteSpace: 'nowrap',
          margin: 0,
          padding: '0 20px'
        }}>
          {messages[index]}
        </h1>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
