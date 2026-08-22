const express = require("express");
const MenuItem = require("../models/MenuItem");
const MealPlan = require("../models/MealPlan");
const { auth, allow } = require("../middleware/auth");
const { getCookForUser } = require("../utils/cookAccess");

const router = express.Router();

router.get("/mine", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const [items, plans] = await Promise.all([
    MenuItem.find({ cook: cook._id }).sort({ createdAt: -1 }),
    MealPlan.find({ cook: cook._id }),
  ]);
  return res.json({ items, plans });
});

router.post("/items", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const { name, description, mealType, price, imageUrl, available, category } = req.body;
  if (!name || !mealType || price === undefined) {
    return res.status(400).json({ message: "Name, meal type, and price are required" });
  }
  const item = await MenuItem.create({
    cook: cook._id,
    name,
    description,
    mealType,
    price,
    imageUrl,
    available,
    category,
  });
  return res.status(201).json({ item });
});

router.put("/items/:id", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const item = await MenuItem.findOne({ _id: req.params.id, cook: cook._id });
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  Object.assign(item, req.body);
  await item.save();
  return res.json({ item });
});

router.delete("/items/:id", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const item = await MenuItem.findOneAndDelete({ _id: req.params.id, cook: cook._id });
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  return res.json({ ok: true });
});

router.post("/plans", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const { type, price, description, includedMeals } = req.body;
  if (!type || price === undefined) {
    return res.status(400).json({ message: "Plan type and price are required" });
  }
  const plan = await MealPlan.findOneAndUpdate(
    { cook: cook._id, type },
    { price, description, includedMeals },
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(201).json({ plan });
});

router.delete("/plans/:id", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, cook: cook._id });
  if (!plan) return res.status(404).json({ message: "Plan not found" });
  return res.json({ ok: true });
});

module.exports = router;
