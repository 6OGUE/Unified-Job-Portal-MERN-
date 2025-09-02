import express from "express";
import pdfParse from "pdf-parse";
import fetch from "node-fetch"; // if Node <18 (in Node18+ global fetch is built-in)

const router = express.Router();

const keywords = [
  "experienced", "skills", "team", "management", "responsible",
  "professional", "leadership", "project", "development", "knowledge",
  "motivated", "communication", "organized", "results", "success",
  "training", "customer", "support", "goal", "detail",
  "strategic", "solution", "collaborative", "technical", "driven",
  "efficient", "analytical", "problem-solving", "creative", "fast-paced",
  "initiative", "multitasking", "presentation", "planning", "deadline",
  "supervised", "achieved", "implemented", "improved", "designed",
  "budget", "coordination", "negotiation", "performance", "adaptable",
  "reliable", "hardworking", "self-motivated", "flexible", "independent",
  "task-oriented", "goal-oriented", "detail-oriented", "decision-making", "organization",
  "time-management", "dedicated", "resourceful", "innovative", "entrepreneurial",
  "client", "vendor", "relationship", "execution", "reporting",
  "productivity", "growth", "efficiency", "stakeholders", "collaboration",
  "presentation", "data", "analytics", "quality", "optimization",
  "process", "documentation", "research", "evaluation", "troubleshooting",
  "implementation", "automation", "testing", "compliance", "regulatory",
  "marketing", "sales", "finance", "operations", "logistics",
  "inventory", "negotiated", "resolved", "coordinated", "mentored",
  "hired", "trained", "reviewed", "created", "launched"
];

// POST /api/ats-check
router.post("/ats-check", async (req, res) => {
  try {
    const { cvUrl } = req.body;
    if (!cvUrl) {
      return res.status(400).json({ error: "cvUrl is required" });
    }

    // Fetch the PDF from storage (assuming filePath is a URL)
    const response = await fetch(cvUrl);
    const buffer = await response.arrayBuffer();

    // Parse PDF
    const data = await pdfParse(Buffer.from(buffer));
    const text = data.text.toLowerCase();

    // Count keyword matches
    let count = 0;
    let remark="";
    keywords.forEach((word) => {
      if (text.includes(word)) {
        count++;
      }
    });
    if(count<20){ remark="Poor";}
    else if(count>=20 && count<40){ remark="Average";}
    else if(count>=40 && count<60){ remark="Good";}
    else if(count>=60 && count<80){ remark="Very Good";}
    else{ remark="Excellent"; }
 

    res.json({
      atsScore: count,
      remark,
      totalKeywords: keywords.length,
    });
  } catch (err) {
    console.error("ATS check error:", err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

export default router;
