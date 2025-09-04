import React, { useEffect, useState } from "react";
import "./bufferingLoader.css";

const statuses = [
  "Analysing file...",
  "Extracting content...",
  "Validating content...",
];

export default function BufferingLoader({ onFinish }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statuses.length) {
        setStep(currentStep);
      }
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="buffering-overlay">
      <div className="buffering-box">
        <div className="spinner">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
        <div className="buffering-status">{statuses[step]}</div>
      </div>
    </div>
  );
}