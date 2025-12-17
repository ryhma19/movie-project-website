import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
  
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
  
    const token = authHeader.split(" ")[1];
    console.log("TOKEN (first 20):", token?.slice(0, 20));
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED:", decoded);
      req.user = { id: decoded.id };
      next();
    } catch (err) {
      console.log("JWT VERIFY ERROR:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }
  };