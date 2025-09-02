import React, { useEffect, useState } from "react";
import { FaBriefcase, FaUserEdit, FaHistory, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EmployeeDashboard() {
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loadingAuth) {
    return (
      <p className="text-center mt-12 text-gray-700 text-lg">Loading...</p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-12 text-red-500 text-lg">
        No user data found. Please log in again.
      </p>
    );
  }

  const features = [
    {
      title: "Smart Job Suggestions",
      shortHint: "See jobs just for you",
      longHint: "Our system analyzes your qualifications to recommend jobs tailored specifically for you.",
      icon: <FaBriefcase size={40} color="#1E90FF" />,
      gradient: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
    },
    {
      title: "Profile Insights",
      shortHint: "Improve your visibility",
      longHint: "Add skills, certifications, and experience. A complete profile increases your chances of being noticed by top employers.",
      icon: <FaUserEdit size={40} color="#FF6F61" />,
      gradient: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
    },
    {
      title: "Application Tracking",
      shortHint: "Know your status",
      longHint: "Track all your applications in one place. See which jobs you applied to and their current status.",
      icon: <FaHistory size={40} color="#32CD32" />,
      gradient: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
    },
  ];

  const faqData = [
    {
      question: "How do I update my profile and resume?",
      answer: "You can update your profile and upload a new resume by navigating to the 'Profile' page. Keeping your information current helps our system provide more accurate job recommendations.",
    },
    {
      question: "How do I know if an employer has viewed my application?",
      answer: "The 'Application Tracking' section on your dashboard shows the real-time status of each application. You will see updates like - Accepted ,  Rejected  or  Pending ",
    },
    {
      question: "Can I delete a job application after submitting it?",
      answer: "Once an application is submitted, it can be deleted. Once an application is deleted the respective employer will not be able to track your profile",
    },
    {
      question: "What if I need technical support?",
      answer: "If you encounter any issues, feel free to contact our support team directly via email or the provided toll free number, available from the main page.",
    },
  ];

  const handleFAQClick = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div
      style={{
        minHeight: "200vh",
        padding: "40px 20px",
        fontFamily: "'Poppins', sans-serif",
        background: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#333",
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#1E90FF",
            marginBottom: "10px",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.6s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontFamily: "monospace",
          }}
        >
          Welcome, {user.name}
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#555",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.8s ease 0.2s",
            fontFamily: "monospace",
          }}
        >
          Here is a quick overview of our features to get you familiar with the platform.
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="card-container">
        {features.map((feature, idx) => (
          <div key={idx} className="card" style={{ background: feature.gradient }}>
            <div className="feature-icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p className="short">{feature.shortHint}</p>
            <div className="extra-text">
              <p>{feature.longHint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div
        className="faq-container"
        style={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "60px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            color: "#1E90FF",
            marginBottom: "30px",
            fontFamily: "monospace",
          }}
        >
          Frequently Asked Questions
        </h2>
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => handleFAQClick(index)}
            >
              <span className="flex-1 text-left">{faq.question}</span>
              <FaChevronDown
                style={{
                  transform: openFAQ === index ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </button>
            <div
              className="faq-answer"
              style={{
                maxHeight: openFAQ === index ? "200px" : "0",
                opacity: openFAQ === index ? 1 : 0,
                padding: openFAQ === index ? "15px 20px" : "0 20px",
                transition: "max-height 0.4s ease-in-out, opacity 0.4s ease",
                overflow: "hidden",
                borderTop: openFAQ === index ? "1px solid #ccc" : "none",
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Combined Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto+Mono&display=swap');

          .card-container {
            display: flex;
            justify-content: center;
            gap: 32px;
            flex-wrap: wrap;
            align-items: flex-start;
            width: 100%;
            max-width: 1200px;
          }
          .card {
            flex: 1 1 260px;
            max-width: 320px;
            min-height: 230px;
            position: relative;
            border-radius: 18px;
            padding: 32px 28px;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(30,144,255,0.10);
            border: 1px solid #e3e8ee;
            background: #f9fafb;
            transition: transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
          }
          .card h2 {
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 12px;
            font-family: 'Poppins', sans-serif;
            text-align: center;
            color: #1e293b;
          }
          .card p {
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
            text-align: center;
            color: #334155;
          }
          .extra-text {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            margin-top: 0;
            transition: all 0.4s;
          }
          .card:hover .extra-text {
            max-height: 200px;
            opacity: 1;
            margin-top: 12px;
          }
          .card:hover {
            transform: translateY(-8px) scale(1.04);
            box-shadow: 0 12px 32px rgba(30,144,255,0.13);
            border-color: #b6e0fe;
            background: #f0f6ff;
          }
          .feature-icon {
            margin-bottom: 18px;
            margin-left: 44%;
            animation: float 4s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
            100% { transform: translateY(0px); }
          }
          
          .faq-container {
            
            border-radius: 16px;
            background: #f9fafb;
            padding: 32px 0;
          }
          .faq-item {
            background: #ffffff;
            border-radius: 12px;
            margin-bottom: 18px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(30,144,255,0.05);
            border: 1px solid #e3e8ee;
          }
          .faq-question {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 28px;
            background-color: #f4f7fb;
            color: #1e293b;
            font-size: 1.13rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            outline: none;
            transition: background-color 0.2s, color 0.2s;
            font-family: 'Poppins', sans-serif;
          }
          .faq-question:hover {
            background-color: #e3e8ee;
            color: #2563eb;
          }
          .faq-answer {
            background-color: #f9fafb;
            color: #334155;
            font-size: 1rem;
            line-height: 1.7;
            font-family: 'Roboto Mono', monospace;
          }

          @media (max-width: 900px) {
            .card-container {
              flex-direction: column;
              align-items: center;
              gap: 24px;
            }
            .card {
              max-width: 95%;
            }
            .faq-container {
              padding: 24px 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default EmployeeDashboard;
