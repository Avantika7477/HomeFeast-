const express = require("express");
const Category = require("../models/Category");
const { auth, allow } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  const categories = await Category.find().sort({ kind: 1, name: 1 });
  return res.json({ categories });
});

router.post("/", auth, allow("admin"), async (req, res) => {
  try {
    const { name, kind } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const category = await Category.create({ name, kind: kind || "cuisine" });
    return res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Category already exists" });
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, allow("admin"), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  return res.json({ ok: true });
});

module.exports = router;
