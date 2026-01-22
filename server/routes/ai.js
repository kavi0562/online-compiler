const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const Groq = require("groq-sdk");

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Dedicated limiter for AI features
const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: { error: "AI_COOLDOWN_ACTIVE: PLEASE_WAIT" }
});

router.post('/chat', aiLimiter, async (req, res) => {
    try {
        const { message, language } = req.body;

        if (!message) {
            return res.status(400).json({ error: "MISSING_INPUT: MESSAGE_REQUIRED" });
        }

        console.log(`>> AI_REQUEST: [${language}] "${message.substring(0, 50)}..."`);

        const systemPrompt = `You are an advanced AI Coding Assistant for an Online Compiler. 
        The user is currently coding in ${language}.
        Provide helpful, concise, and correct code snippets formatted in markdown code blocks.
        If the user asks for code, provide it directly with brief explanation.
        Use "System:" prefix for status updates if needed, but mostly focus on being a helpful pair programmer.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false
        });

        const aiResponse = completion.choices[0]?.message?.content || "SYSTEM_OFFLINE";

        res.json({
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("AI_FAILURE:", error);
        res.status(500).json({
            error: "NEURAL_NET_UNRESPONSIVE",
            details: error.message
        });
    }
});

module.exports = router;
