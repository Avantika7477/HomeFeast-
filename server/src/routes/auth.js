const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const CookProfile = require("../models/CookProfile");
const { signToken } = require("../utils/token");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, city, address, kitchenName } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }
    if (!["customer", "cook"].includes(role)) {
      return res.status(400).json({ message: "Role must be customer or cook" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      role,
      city,
      address,
    });
    if (role === "cook") {
      await CookProfile.create({
        user: user._id,
        kitchenName: kitchenName || `${name}'s Kitchen`,
        city: city || "Unspecified",
        serviceAreas: city ? [city] : [],
        status: "pending",
      });
    }
    const token = signToken(user);
    return res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user);
    return res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
});

router.get("/me", auth, async (req, res) => {
  return res.json({ user: req.user.toSafeJSON() });
});

router.patch("/me", auth, async (req, res) => {
  const { name, phone, city, address } = req.body;
  if (name) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (city !== undefined) req.user.city = city;
  if (address !== undefined) req.user.address = address;
  await req.user.save();
  return res.json({ user: req.user.toSafeJSON() });
});

module.exports = router;
