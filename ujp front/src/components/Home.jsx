import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FaUserTie, FaBriefcase } from 'react-icons/fa';  
import { MdBusiness } from "react-icons/md"; 
import axios from 'axios';

const messages = [
  'Welcome to Unified Job Portal',
  'Discover Jobs Aligned With Your Skills',
  'Hire Qualified Talent With Confidence',
  'Simple, Smart and Secure Hiring',
  'Connecting Employers and Jobseekers'
];

function Home() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Counters
  const [employeeCount, setEmployeeCount] = useState(0);
  const [animatedEmployeeCount, setAnimatedEmployeeCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [animatedEmployerCount, setAnimatedEmployerCount] = useState(0);
  const [jobsListed, setJobsListed] = useState(0);
  const [animatedJobsListed, setAnimatedJobsListed] = useState(0);

  // Hero rotation
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

  // Fetch counts from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const resEmployees = await axios.get('/api/users/count/employees');
        setEmployeeCount(resEmployees.data.count);

        const resEmployers = await axios.get('/api/users/count/employers');
        setEmployerCount(resEmployers.data.count);

        const resJobs = await axios.get('/api/jobs/count');
        setJobsListed(resJobs.data.count);
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };
    fetchCounts();
  }, []);

  // Animate counters
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedEmployeeCount(prev =>
        prev < employeeCount ? prev + Math.ceil(employeeCount / 50) : employeeCount
      );
      setAnimatedEmployerCount(prev =>
        prev < employerCount ? prev + Math.ceil(employerCount / 50) : employerCount
      );
      setAnimatedJobsListed(prev =>
        prev < jobsListed ? prev + Math.ceil(jobsListed / 50) : jobsListed
      );
    }, 50);
    return () => clearInterval(interval);
  }, [employeeCount, employerCount, jobsListed]);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: linear-gradient(135deg, #f3f3f8ff 0%, #ffffffff 100%);
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

        .section-spacer {
          height: 120px;
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

        .stat-card:hover::before { opacity: 1; }
        .stat-card:hover { transform: translateY(-12px) scale(1.02); }

        .stat-icon { font-size: 56px; margin-bottom: 20px; }
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
      `}</style>

      {/* Page Wrapper: flex column */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {/* Main content: grows to push footer down */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Hero */}
          <div className="hero-container">
            <h1 className="fadeText" style={{ opacity: fade ? 1 : 0, marginBottom: '30px' }}>
              {messages[index]}
            </h1>

            {/* About Us */}
            <div className="section about" style={{ color: '#00C9FF', textAlign: 'center', padding: 0, marginTop: '140px' }}>
              <h1>About Us</h1>
              <p style={{ color: '#00C9FF', fontSize: '20px', lineHeight: '1.8', maxWidth: '950px', margin: '0 auto' }}>
                Unified Job Portal makes the process of finding jobs and hiring talent much easier and more unified, helping users connect with opportunities without the usual hassle.
              </p>
            </div>

            <div className="section-spacer" />
          </div>

          {/* Stats */}
          <div className="section stats-grid">
            <motion.div className="stat-card" whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <FaBriefcase className="stat-icon" style={{ color: '#00C9FF' }} />
              <div className="counter">{animatedJobsListed}</div>
              <div>Jobs Listed</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <MdBusiness className="stat-icon" style={{ color: '#c084fc' }} />
              <div className="counter">{animatedEmployerCount}</div>
              <div>Employers Registered</div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <FaUserTie className="stat-icon" style={{ color: '#92FE9D' }} />
              <div className="counter">{animatedEmployeeCount}</div>
              <div>Job Seekers Registered</div>
            </motion.div>
          </div>
        </div>

        {/* Footer always at bottom */}
        <Footer />
      </div>
    </>
  );
}

export default Home;
