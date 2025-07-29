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
      setFade(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % messages.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            overflow: hidden;
          }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
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
            padding: '0 20px',
            marginBottom: '75px',
          }}>
            {messages[index]}
          </h1>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
