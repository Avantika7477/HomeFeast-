const express = require("express");
const Complaint = require("../models/Complaint");
const { auth, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { subject, description, againstUser, order } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ message: "Subject and description are required" });
  }
  const complaint = await Complaint.create({
    raisedBy: req.user._id,
    againstUser,
    order,
    subject,
    description,
  });
  return res.status(201).json({ complaint });
});

router.get("/mine", auth, async (req, res) => {
  const complaints = await Complaint.find({ raisedBy: req.user._id }).sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.get("/", auth, allow("admin"), async (_req, res) => {
  const complaints = await Complaint.find()
    .populate("raisedBy", "name email role")
    .populate("againstUser", "name email role")
    .sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.patch("/:id", auth, allow("admin"), async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  if (req.body.status) complaint.status = req.body.status;
  if (req.body.adminNotes !== undefined) complaint.adminNotes = req.body.adminNotes;
  await complaint.save();
  return res.json({ complaint });
});

module.exports = router;
