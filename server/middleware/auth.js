const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log('--- MIDDLEWARE_CHECK --- Header:', authHeader ? "PRESENT" : "MISSING");

  // 1. Flexible Token Extraction
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!token) {
    console.warn(">> AUTH_FAIL: No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  // 2. HYBRID VERIFICATION: Firebase First, then Custom JWT
  try {
    // Attempt A: Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // console.log('✅ FIREBASE_VERIFIED:', decodedToken.email);

    // Normalize user object
    const adminEmailLower = "n.kavishiksuryavarma@gmail.com";
    const userEmailLower = (decodedToken.email || "").toLowerCase();

    // Check match case-insensitively
    const isAdmin = userEmailLower === adminEmailLower;

    console.log(`>> VERIFY_ID_TOKEN: Email=[${decodedToken.email}] | AdminCheck=[${isAdmin}]`);

    req.user = {
      id: decodedToken.uid, // Firebase UID
      email: decodedToken.email,
      role: decodedToken.admin || isAdmin ? 'admin' : 'user', // Force Admin if verified email matches
      provider: 'firebase'
    };
    if (isAdmin) console.log(">> 🛡️ FIREBASE_TOKEN: ADMIN_DETECTED");
    return next();

  } catch (firebaseError) {
    // Attempt B: Custom JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SURYA_SECRET_123');
      // console.log(">> CUSTOM_JWT_VERIFIED:", decoded.id);

      req.user = decoded;
      return next();

    } catch (jwtError) {
      console.error("❌ TOKEN_VERIFICATION_FAILED | Firebase:", firebaseError.code, "| JWT:", jwtError.message);
      return res.status(401).json({
        message: 'Authorization failed',
        error: jwtError.message
      });
    }
  }
};
