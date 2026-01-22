module.exports = (req, res, next) => {
  // JWT middleware run ayyi req.user undali
  console.log(`>> ADMIN_CHECK: User=${req.user?.email || 'NONE'}, Role=${req.user?.role}`);
  if (!req.user || req.user.role !== "admin") {
    console.warn(">> ACCESS_DENIED: User is not admin");
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

