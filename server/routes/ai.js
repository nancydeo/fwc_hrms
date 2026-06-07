import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const router = express.Router();

const getAI = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return {
    generateContent: async (prompt) => {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        return await model.generateContent(prompt);
      } catch (error) {
        console.warn('Primary model (gemini-2.5-flash) failed, trying fallback model (gemini-2.5-flash-lite):', error.message || error);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        return await model.generateContent(prompt);
      }
    }
  };
};

// POST /api/ai/screen-resume
router.post('/screen-resume', protect, async (req, res) => {
  try {
    const { resumeText, jobTitle, jobRequirements } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'Resume text is required' });

    const model = getAI();
    const prompt = `You are an expert HR recruiter AI. Analyze this resume for the position of "${jobTitle}".

Job Requirements: ${jobRequirements || 'General software engineering role'}

Resume:
${resumeText}

Respond ONLY in this exact JSON format:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "skills_matched": ["skill1", "skill2"],
  "skills_missing": ["skill1", "skill2"],
  "experience_years": "<estimated years>",
  "education": "<highest qualification>",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "<hire/maybe/reject>"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 0, summary: text };

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/chatbot
router.post('/chatbot', protect, async (req, res) => {
  try {
    const { message, context } = req.body;
    const model = getAI();
    const prompt = `You are an AI HR Assistant for FWC IT Services. You help employees with HR-related queries.
You have knowledge about: leave policies, attendance rules, payroll, company policies, benefits, and general HR queries.

Company policies:
- Sick Leave: 12 days/year
- Casual Leave: 12 days/year
- Earned Leave: 15 days/year
- Working Hours: 9 AM to 6 PM
- Late arrival: After 10 AM is marked late
- Salary cycle: Last business day of each month
- Performance reviews: Quarterly
- Probation period: 6 months
- Notice period: 2 months

${context ? `Context: ${context}` : ''}

Employee Question: ${message}

Provide a helpful, professional response. Be concise but thorough. If you don't know something specific, say so and suggest who to contact.`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/interview-questions
router.post('/interview-questions', protect, async (req, res) => {
  try {
    const { jobTitle, skills, experience, difficulty } = req.body;
    const model = getAI();
    const prompt = `Generate 10 interview questions for a "${jobTitle}" position.

Required Skills: ${skills?.join(', ') || 'General'}
Experience Level: ${experience || 'Mid-level'}
Difficulty: ${difficulty || 'Medium'}

Respond ONLY in this exact JSON format:
{
  "questions": [
    {
      "question": "<question text>",
      "category": "<technical/behavioral/situational>",
      "difficulty": "<easy/medium/hard>",
      "expected_answer_points": ["point1", "point2"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [] };
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/performance-summary
router.post('/performance-summary', protect, async (req, res) => {
  try {
    const { employeeName, ratings, goals, period, feedback } = req.body;
    const model = getAI();
    const prompt = `Generate a professional performance review summary.

Employee: ${employeeName}
Review Period: ${period}
Ratings: Productivity: ${ratings?.productivity}/5, Quality: ${ratings?.quality}/5, Communication: ${ratings?.communication}/5, Teamwork: ${ratings?.teamwork}/5, Leadership: ${ratings?.leadership}/5
Goals: ${JSON.stringify(goals || [])}
Additional Feedback: ${feedback || 'None provided'}

Write a comprehensive 3-4 paragraph performance summary that includes:
1. Overall assessment
2. Key achievements and strengths
3. Areas for improvement
4. Recommendations for growth

Be professional, constructive, and specific.`;

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/attrition-risk
router.post('/attrition-risk', protect, async (req, res) => {
  try {
    const { employeeData } = req.body;
    const model = getAI();
    const prompt = `Analyze the following employee data and predict attrition risk.

Employee Data:
${JSON.stringify(employeeData, null, 2)}

Consider factors: tenure, salary growth, performance ratings, leave patterns, overtime hours, promotion history, team changes.

Respond ONLY in this exact JSON format:
{
  "riskLevel": "<low/medium/high/critical>",
  "riskScore": <number 0-100>,
  "factors": [
    {"factor": "<factor name>", "impact": "<positive/negative>", "detail": "<explanation>"}
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "<2-3 sentence summary>"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { riskLevel: 'unknown', riskScore: 0, summary: text };
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/generate-jd
router.post('/generate-jd', protect, async (req, res) => {
  try {
    const { title, department, skills, experience, responsibilities } = req.body;
    const model = getAI();
    const prompt = `Generate a professional job description for the following role:

Title: ${title}
Department: ${department || 'Engineering'}
Required Skills: ${skills?.join(', ') || 'Not specified'}
Experience: ${experience || '2-4 years'}
Key Responsibilities: ${responsibilities || 'Not specified'}

Write a complete, professional job description with:
1. Job Title and Summary
2. Key Responsibilities (6-8 bullet points)
3. Required Qualifications
4. Preferred Qualifications
5. Skills Required
6. What We Offer

Make it engaging and attractive to top talent. Use a professional but welcoming tone.`;

    const result = await model.generateContent(prompt);
    res.json({ jobDescription: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
