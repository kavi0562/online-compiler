module.exports = (req, res, next) => {
  // JWT middleware run ayyi req.user undali
  const user = req.user;
  const role = user ? user.role : 'UNDEFINED';
  const email = user ? user.email : 'UNDEFINED';

  console.log(`>> ADMIN_CHECK: User=[${email}], Role=[${role}], Provider=[${user?.provider}]`);

  if (!user || role !== "admin") {
    console.warn(`>> ACCESS_DENIED: Require 'admin', got '${role}'`);
    return res.status(403).json({ message: "Admin access only", incomingRole: role });
  }
  next();
};

