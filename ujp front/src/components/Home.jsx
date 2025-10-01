import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaRocket } from 'react-icons/fa';

const messages = [
  'Welcome to Unified Job Portal',
  'Discover Jobs Aligned With Your Skills',
  'Hire Qualified Talent With Confidence',
  'Simple, Smart and Secure Hiring',
  'Connecting Employers and Jobseekers'
];

const topCompanies = [
  { name: "Google",   logo: "https://img.icons8.com/color/96/google-logo.png",   color:"#4285F4" },
  { name: "Microsoft",logo: "https://img.icons8.com/color/96/microsoft.png",     color:"#F25022" },
  { name: "Apple", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg", 
    color:"#A2AAAD" },
  { name: "Amazon",   logo: "https://img.icons8.com/color/96/amazon.png",        color:"#FF9900" },
  { name: "Meta",     logo: "https://img.icons8.com/color/96/meta.png",          color:"#1877F2" },
];

const reviews = [
  { name: "Alice", text: "Found my dream job in just 3 days!", rating: 5 },
  { name: "Bob", text: "Hats off to the team for creating such an amazing website", rating: 4 },
];

function Home() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [jobsMatched, setJobsMatched] = useState(0);
  const [employersOnboard, setEmployersOnboard] = useState(0);
  const [usersHelped, setUsersHelped] = useState(0);

  // Hero text rotation
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

  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setJobsMatched(prev => (prev < 520 ? prev + 5 : 520));
      setEmployersOnboard(prev => (prev < 120 ? prev + 2 : 120));
      setUsersHelped(prev => (prev < 200 ? prev + 3 : 200));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        body { 
          margin: 0; 
          background: linear-gradient(135deg, #000003ff 100%rgba(0, 0, 13, 1)2e 100%, #000105ff 100%);
          color: #fff; 
          font-family: 'Rockwell', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        .fadeText { 
          font-size: clamp(32px, 5vw, 60px);
          font-weight: 700; 
          background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #00C9FF 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
          transition: opacity 0.6s ease-in-out;
          letter-spacing: -1px;
          line-height: 1.2;
          text-align: center;
          padding: 0 20px;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .section { 
          width: 100%; 
          padding: 80px 20px; 
          box-sizing: border-box;
          position: relative;
        }

        .section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,201,255,0.3), transparent);
        }

        .stats-grid { 
          display: flex; 
          justify-content: center; 
          gap: 40px; 
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card { 
          flex: 1 1 280px; 
          max-width: 320px; 
          background: linear-gradient(135deg, rgba(0,201,255,0.1) 0%, rgba(146,254,157,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; 
          padding: 40px 30px; 
          text-align: center; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0,201,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:hover { 
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,201,255,0.3), 0 0 40px rgba(146,254,157,0.2);
          border-color: rgba(0,201,255,0.4);
        }

        .stat-icon { 
          font-size: 56px; 
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(0,201,255,0.4));
        }

        .counter { 
          font-size: 48px; 
          font-weight: 700;
          background: linear-gradient(135deg, #00C9FF, #92FE9D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-card > div:last-child {
          font-size: 16px;
          color: #b4b4b4;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .about, .companies, .reviews { 
          text-align: center; 
          max-width: 1200px; 
          margin: auto;
        }

        .about h2, .companies h2, .reviews h2 {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
          position: relative;
          display: inline-block;
          padding-bottom: 16px;
        }

        .about h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #00C9FF, #92FE9D);
          border-radius: 2px;
        }

        .companies h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #92FE9D, #00C9FF);
          border-radius: 2px;
        }

        .reviews h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #c084fc, #92FE9D);
          border-radius: 2px;
        }

        .about p {
          font-size: 18px;
          line-height: 1.8;
          color: #d1d1d1;
          max-width: 800px;
          margin: auto;
          font-weight: 400;
        }

        .companies { 
          overflow-x: hidden;
        }

        .company-carousel { 
          display: flex; 
          gap: 30px; 
          overflow: hidden;
          padding: 20px 0; 
          justify-content: center; 
          align-items: center; 
          width: 100%; 
          max-width: 100vw;
          scrollbar-width: none;
        }

        .company-carousel::-webkit-scrollbar { 
          display: none;
        }

        .company-card { 
          flex: 0 0 auto; 
          width: 160px; 
          height: 100px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .company-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .company-card:hover::before {
          opacity: 1;
        }

        .company-card:hover { 
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 15px 40px rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
        }

        .company-card img {
          max-width: 110px;
          max-height: 60px;
          filter: brightness(1.1);
          transition: filter 0.3s ease;
        }

        .company-card:hover img {
          filter: brightness(1.3);
        }

        .review-card { 
          background: linear-gradient(135deg, rgba(192,132,252,0.1) 0%, rgba(146,254,157,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; 
          padding: 32px 28px; 
          max-width: 340px; 
          margin: 20px; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer; 
          display: inline-block;
          position: relative;
          overflow: hidden;
        }

        .review-card::before {
          content: '"';
          position: absolute;
          top: 10px;
          left: 20px;
          font-size: 50px;
          color: rgba(255, 255, 255, 1);
          font-family: Georgia, serif;
          line-height: 1;
        }

        .review-card:hover { 
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 50px rgba(192,132,252,0.25);
          border-color: rgba(192,132,252,0.4);
        }

        .review-card > div:first-child {
          font-size: 17px;
          line-height: 1.6;
          color: #e0e0e0;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
          font-style: italic;
        }

        .review-card > div:nth-child(2) {
          font-weight: 600;
          color: #00C9FF;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .review-card > div:last-child {
          font-size: 18px;
          letter-spacing: 2px;
        }

        .hero-container {
          position: relative;
          padding: 120px 20px 80px;
          width: 100%;
        }

        .hero-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0,201,255,0.15) 0%, transparent 70%);
          filter: blur(60px);
          z-index: -1;
        }

        @media (max-width: 768px) {
          .section {
            padding: 60px 20px;
          }

          .stats-grid {
            gap: 20px;
          }

          .stat-card {
            padding: 30px 20px;
          }

          .company-card {
            width: 140px;
            height: 90px;
          }

          .review-card {
            max-width: 300px;
            margin: 15px;
            padding: 28px 24px;
          }
        }
      `}</style><br></br>

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>

        {/* Hero */}
        <div className="hero-container">
          <h1 className="fadeText" style={{ opacity:fade ? 1 : 0, marginBottom:'30px' }}>{messages[index]}</h1>
<br></br>
          {/* About Us */}
          <div className="section about" style={{ color:'#fff', textAlign:'center', padding:'0', marginTop:'85px' }}>
            <h2 style={{ color:'#00C9FF' }}>About Us</h2>
            <p>
              Unified Job Portal makes the process of finding jobs and hiring talent much easier and more unified, helping users connect with opportunities without the usual hassle.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="section stats-grid">
          <motion.div className="stat-card" whileHover={{ scale:1.05 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <FaBriefcase className="stat-icon" style={{ color:'#00C9FF' }} />
            <div className="counter">{jobsMatched}</div>
            <div>Jobs Matched</div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale:1.05 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <FaUsers className="stat-icon" style={{ color:'#92FE9D' }} />
            <div className="counter">{employersOnboard}</div>
            <div>Employers Onboard</div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale:1.05 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <FaRocket className="stat-icon" style={{ color:'#c084fc' }} />
            <div className="counter">{usersHelped}</div>
            <div>Users Helped</div>
          </motion.div>
        </div>

        {/* Top Companies */}
        <div className="section companies">
          <h2 style={{ color:'#92FE9D' }}>Top Companies</h2>
          <div className="company-carousel">
            {topCompanies.map((company, idx) => (
              <div key={idx} className="company-card" style={{ boxShadow:`0 0 30px ${company.color}20` }}>
                <img src={company.logo} alt={company.name} />
              </div>
            ))}
          </div>
        </div>

        {/* User Reviews */}
        <div className="section reviews">
          <h2 style={{ color:'#c084fc' }}>User Reviews</h2>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div>{review.text}</div>
                <div>— {review.name}</div>
                <div>{'⭐'.repeat(review.rating)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width:'100%' }}>
          <Footer />
        </div>

      </div>
    </>
  );
}

export default Home;