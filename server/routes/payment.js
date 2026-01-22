const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify token (simplified for this route)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

// MOCK UPGRADE ENDPOINT
// In a real app, this would be a webhook from Stripe/Razorpay
router.post("/upgrade", verifyToken, async (req, res) => {
    try {
        const { plan } = req.body; // 'pro' or 'enterprise'

        if (!['pro', 'enterprise'].includes(plan)) {
            return res.status(400).json({ error: "Invalid plan selected" });
        }

        // Simulate payment processing delay
        // await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                subscriptionPlan: plan,
                subscriptionStatus: 'active'
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Successfully upgraded to ${plan.toUpperCase()}`,
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET CURRENT SUBSCRIPTION
router.get("/status", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            plan: user.subscriptionPlan,
            status: user.subscriptionStatus
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
