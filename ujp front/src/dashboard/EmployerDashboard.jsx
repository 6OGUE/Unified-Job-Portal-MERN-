import React, { useEffect, useState } from "react";
import { FaUserTie, FaSearch, FaClipboardList, FaPlusCircle, FaChevronDown } from "react-icons/fa";
import { FcCollaboration } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

// Assume AuthContext is available and provides 'user' and 'loadingAuth'
import { useAuth } from "../context/AuthContext";

function EmployerDashboard() {
  // Using user data from the authentication context
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // State to manage the open/closed state of the FAQ accordion
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    // A simple animation trigger for the header
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loadingAuth) {
    return (
      <p className="text-center mt-12 text-gray-700 text-lg">
        Loading...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-12 text-red-500 text-lg">
        No user data found. Please log in again.
      </p>
    );
  }

  // Features tailored for the employer dashboard
  const features = [
    {
      title: "Manage Job Postings",
      shortHint: "Edit and monitor your listings",
      longHint: "Effortlessly create and track all your job postings in one place.",
      icon: <FaClipboardList size={40} color="#FF6347" />,
      gradient: "linear-gradient(135deg, #ffe0e0, #ffcccb)",
    },
    {
      title: "Review Applicants",
      shortHint: "Find the best talent",
      longHint: "View and screen all job applications and find the right match for your company.",
      icon: <FaSearch size={40} color="#3CB371" />,
      gradient: "linear-gradient(135deg, #e6f7e9, #c3e6cb)",
    },
    {
      title: "Instant feedback",
      shortHint: "Provide assesment responses in real-time",
      longHint: "Quickly respond to applicants and keep them informed about their application status.",
      icon:<FcCollaboration size={40} color="#4682B4"/>,
      gradient: "linear-gradient(135deg, #e0f2f7, #b2e3f2)",
    },
  ];

  // FAQ data specific to employers
  const faqData = [
    {
      question: "How do I post a new job opening?",
      answer: "You can post a new job by clicking the 'Post Job' button. Fill in the required details, and your posting will be live instantly for job seekers to view.",
    },
    {
      question: "How can I contact a candidate?",
      answer: "Once you have reviewed an application, you can view the canidates profile and contact him/her using their respective email address accessible from the candidate's profile.",
    },
    {
      question: "What is the cost of posting a job?",
      answer: "No cards, no bullshit. We offer a completely free service for both employers and job seekers. We value connecting great talent with great companies.",
    },
    {
      question: "How do I edit or close a job posting?",
      answer: "Navigate to the 'My Jobs' section. From there, you can easily delete jobs. However you cannot edit an existing job, since it may cause integrity issues with already applied candidates.",
    },
  ];

  // Function to handle the accordion toggle
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
            color: "#FF6347",
            marginBottom: "10px",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.6s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontFamily: 'monospace',
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
            fontFamily: 'monospace',
          }}
        >
          Here is a quick overview of your employer dashboard.
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="card-container">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="card"
            style={{ background: feature.gradient }}
          >
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
            color: "#FF6347",
            marginBottom: "30px",
            fontFamily: 'monospace',
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
          /* Global styles, included for completeness */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto+Mono&display=swap');

          /* Feature Card Styles */
          .card-container {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            align-items: flex-start;
            width: 100%;
            max-width: 1200px;
          }
          .card {
            flex: 1 1 250px;
            max-width: 300px;
            position: relative;
            min-height: 220px;
            border-radius: 25px;
            padding: 30px 25px;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.5s ease, box-shadow 0.3s ease;
          }
          .card h2 {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 10px;
            font-family: 'monospace';
            text-align: center;
          }
          .card p {
            font-size: 0.9rem;
            line-height: 1.4rem;
            margin: 0;
            text-align: center;
          }
          .extra-text {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            margin-top: 0;
            transition: all 0.4s ease;
          }
          .card:hover .extra-text {
            max-height: 200px;
            opacity: 1;
            margin-top: 10px;
          }
          .card:hover {
            transform: translateY(-6px) scale(1.03);
            box-shadow: 0 8px 20px rgba(255, 99, 71, 0.3);
          }
          .feature-icon {
            margin-bottom: 15px;
            margin-left: 43%;
            animation: float 4s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          
          /* FAQ Section Styles */
          .faq-item {
            background: #ffffff;
            border-radius: 12px;
            margin-bottom: 15px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .faq-question {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 25px;
            background-color: #f7f9fc;
            color: #333;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            outline: none;
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          .faq-question:hover {
            background-color: #eef1f5;
          }
          .faq-answer {
            background-color: #ffffff;
            color: #666;
            font-size: 1rem;
            line-height: 1.6;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .card-container {
              flex-direction: column;
              align-items: center;
            }
            .card {
              max-width: 90%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default EmployerDashboard;
