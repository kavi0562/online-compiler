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

        const systemPrompt = `You are an advanced AI Voice Coding Copilot inside an online compiler. The user is currently coding in ${language}.

Your primary goal is to assist the user with their coding tasks.

CORE INSTRUCTION:
- If the user provides a short imperative command (e.g., "add two elements", "factorial", "prime number"), ASSUME they want CODE in ${language}.
- DO NOT ask for clarification unless absolutely necessary.
- DO NOT explain the concept unless asked. Just provide the code.

BEHAVIOR RULES:
- If the user asks for code, PROVIDE THE CODE IMMEDIATELY.
- If the user asks for an explanation, explain clearly with analogies.
- Keep responses concise and to the point.

CODE GENERATION RULES:
- Always use Markdown code blocks for code (e.g., \`\`\`${language} ... \`\`\`).
- Ensure the code is clean, runnable, and follows best practices for the requested language (${language}).
- Add brief comments to explain complex parts of the code.

TONE:
- Friendly, professional, and helpful.
- Encouraging but efficient.

SAFETY:
- Do not execute system commands or access the file system.
- If a request is harmful, politely decline.`;

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
        // Handle specific 401 Invalid API Key error
        if (error.status === 401 || (error.error && error.error.code === 'invalid_api_key')) {
            console.warn("⚠️ AI_AUTH_FAILURE: Groq API Key invalid/expired.");
            return res.status(401).json({
                error: "INVALID_API_KEY",
                message: "The provided Groq API Key is invalid or expired. Please update it in the server .env file."
            });
        }

        console.error("AI_FAILURE:", error);
        res.status(500).json({
            error: "NEURAL_NET_UNRESPONSIVE",
            details: error.message
        });
    }
});

module.exports = router;
