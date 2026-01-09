const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1️⃣ Header nundi Authorization read cheyyadam
  const authHeader = req.headers.authorization;

  // 2️⃣ Header lekapothe / wrong format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 3️⃣ "Bearer <token>" nundi token matrame theesukovadam
  const token = authHeader.split(" ")[1];

  try {
    // 4️⃣ Token verify cheyyadam
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ User info request ki attach cheyyadam
    req.user = decoded; // { id, role }

    // 6️⃣ Next middleware / route ki velladam
    next();
  } catch (err) {
    // 7️⃣ Token invalid ayithe
    return res.status(401).json({ message: "Invalid token" });
  }
};

