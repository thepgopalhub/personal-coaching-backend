import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  console.log("📌 Headers received:", req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  console.log("📌 Extracted token:", token);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);
    const user = await User.findById(decoded.id);
    console.log("📌 User from DB:", user);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default auth;
