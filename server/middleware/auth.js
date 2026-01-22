const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

module.exports = async (req, res, next) => {
  console.log('--- MIDDLEWARE_CHECK (HYBRID) ---');
  const authHeader = req.headers.authorization;

  // 1. Flexible Token Extraction
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  // console.log('Token Exists:', !!token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2. HYBRID VERIFICATION: Firebase First, then Custom JWT
  try {
    // Attempt A: Firebase ID Token
    // console.log(">> Attempting Firebase Verification...");
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ FIREBASE_USER_VERIFIED:', decodedToken.email);
    // console.log(">> Firebase Auth Success:", decodedToken.email);

    // Normalize user object
    const isAdmin = decodedToken.email === "n.kavishiksuryavarma@gmail.com";
    req.user = {
      id: decodedToken.uid, // Firebase UID
      email: decodedToken.email,
      role: decodedToken.admin || isAdmin ? 'admin' : 'user', // Force Admin if verified email matches
      provider: 'firebase'
    };
    if (isAdmin) console.log(">> 🛡️ HARDCODED_ADMIN_DETECTED_IN_MIDDLEWARE");
    return next();

  } catch (firebaseError) {
    // console.log(">> Firebase Verification Failed:", firebaseError.code);

    // Attempt B: Custom JWT (For Admin Bypass / Manual Login)
    try {
      // console.log(">> Attempting Custom JWT Verification...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SURYA_SECRET_123');
      // console.log(">> Custom JWT Success for:", decoded.id);

      req.user = decoded;
      return next();

    } catch (jwtError) {
      console.error("❌ ALL_AUTH_FAILED: Invalid Token (Algorithm/Signature)");
      return res.status(401).json({
        message: 'Authorization failed: Invalid token format or signature',
        error: jwtError.message
      });
    }
  }
};
