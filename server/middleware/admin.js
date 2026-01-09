module.exports = (req, res, next) => {
  // JWT middleware run ayyi req.user undali
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

