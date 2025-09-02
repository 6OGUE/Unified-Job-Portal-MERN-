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
  { name: "Charlie", text: "Employers reached out to me instantly, amazing experience.", rating: 5 },
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
        body { margin:0; background:#000; color:#fff; font-family:monospace; }
        .fadeText { font-size:60px; font-weight:bold; background: linear-gradient(90deg, #00C9FF, #92FE9D); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-shadow:0 0 20px rgba(0,201,255,0.5); transition:opacity 0.6s ease-in-out; }
        .section { width:100%; padding:50px 20px; box-sizing:border-box; }
        .stats-grid { display:flex; justify-content:center; gap:25px; flex-wrap:wrap; }
        .stat-card { flex:1 1 250px; max-width:280px; background:rgba(255,255,255,0.05); border-radius:20px; padding:25px 20px; text-align:center; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor:pointer; }
        .stat-card:hover { transform: translateY(-10px) scale(1.05); box-shadow: 0 0 40px rgba(0,255,255,0.3); }
        .stat-icon { font-size:50px; margin-bottom:15px; }
        .counter { font-size:28px; font-weight:bold; }
        .about, .companies, .reviews { text-align:center; max-width:1200px; margin:auto; }
        .company-carousel { display:flex; gap:20px; overflow-x:auto; padding:6px 0; justify-content:center; align-items:center; }
        .company-card { flex:0 0 auto; width:140px; height:80px; display:flex; justify-content:center; align-items:center; background:rgba(255,255,255,0.05); border-radius:15px; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor:pointer; }
        .company-card:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 0 25px rgba(255,255,255,0.2); }
        .review-card { background: rgba(255,255,255,0.05); border-radius:20px; padding:20px 18px; max-width:320px; margin:15px; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor:pointer; display:inline-block; }
        .review-card:hover { transform: translateY(-5px) scale(1.03); box-shadow: 0 0 35px rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { height:6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius:3px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
      `}</style>

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', padding:'100px 20px', width:'100%' }}>
          <h1 className="fadeText" style={{ opacity:fade ? 1 : 0, marginBottom:'30px' }}>{messages[index]}</h1>

          {/* About Us moved here */}
          <div className="section about" style={{ color:'#fff', textAlign:'center', padding:'0',marginTop:'85px' }}>
            <h2 style={{ fontSize:'32px', marginBottom:'15px', color:'#00C9FF' }}>About Us</h2>
            <p style={{ fontSize:'16px', maxWidth:'800px', margin:'auto', color:'#ccc' }}>
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
          <h2 style={{ fontSize:'32px', marginBottom:'12px', color:'#92FE9D' }}>Top Companies</h2>
          <div className="company-carousel">
            {topCompanies.map((company, idx) => (
              <div key={idx} className="company-card" style={{ boxShadow:`0 0 20px ${company.color}33` }}>
                <img src={company.logo} alt={company.name} style={{ maxWidth:'100px', maxHeight:'50px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* User Reviews */}
        <div className="section reviews">
          <h2 style={{ fontSize:'32px', marginBottom:'15px', color:'#c084fc' }}>User Reviews</h2>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div style={{ fontSize:'16px', marginBottom:'8px' }}>{review.text}</div>
                <div style={{ fontWeight:'bold', marginBottom:'4px' }}>— {review.name}</div>
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
