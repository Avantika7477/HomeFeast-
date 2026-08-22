const express = require("express");
const CookProfile = require("../models/CookProfile");
const MenuItem = require("../models/MenuItem");
const MealPlan = require("../models/MealPlan");
const Review = require("../models/Review");
const { auth, allow } = require("../middleware/auth");
const { getCookForUser } = require("../utils/cookAccess");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { city, cuisine, mealPlan, mealType, maxPrice, q } = req.query;
    const filter = { status: "approved" };
    if (city) filter.city = new RegExp(city, "i");
    if (cuisine) filter.cuisines = new RegExp(cuisine, "i");
    if (q) {
      filter.$or = [
        { kitchenName: new RegExp(q, "i") },
        { bio: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
      ];
    }

    let cooks = await CookProfile.find(filter).populate("user", "name email city").lean();

    if (mealPlan || mealType || maxPrice) {
      const cookIds = cooks.map((c) => c._id);
      const [plans, items] = await Promise.all([
        mealPlan ? MealPlan.find({ cook: { $in: cookIds }, type: mealPlan }).lean() : [],
        mealType || maxPrice
          ? MenuItem.find({
              cook: { $in: cookIds },
              available: true,
              ...(mealType ? { mealType } : {}),
              ...(maxPrice ? { price: { $lte: Number(maxPrice) } } : {}),
            }).lean()
          : [],
      ]);
      const planCooks = new Set(plans.map((p) => String(p.cook)));
      const itemCooks = new Set(items.map((i) => String(i.cook)));
      cooks = cooks.filter((c) => {
        const id = String(c._id);
        if (mealPlan && !planCooks.has(id)) return false;
        if ((mealType || maxPrice) && !itemCooks.has(id)) return false;
        return true;
      });
    }

    return res.json({ cooks });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/me", auth, allow("cook"), async (req, res) => {
  const profile = await CookProfile.findOne({ user: req.user._id }).populate("user", "name email phone city");
  if (!profile) return res.status(404).json({ message: "Cook profile not found" });
  return res.json({ profile });
});

router.put("/me", auth, allow("cook"), async (req, res) => {
  const profile = await getCookForUser(req.user._id);
  if (!profile) return res.status(404).json({ message: "Cook profile not found" });
  const fields = [
    "kitchenName",
    "bio",
    "city",
    "serviceAreas",
    "cuisines",
    "deliveryStart",
    "deliveryEnd",
    "coverImage",
  ];
  for (const key of fields) {
    if (req.body[key] !== undefined) profile[key] = req.body[key];
  }
  await profile.save();
  return res.json({ profile });
});

router.get("/:id", async (req, res) => {
  const profile = await CookProfile.findOne({
    _id: req.params.id,
    status: "approved",
  }).populate("user", "name city");
  if (!profile) return res.status(404).json({ message: "Cook not found or not approved yet" });

  const [menu, plans, reviews] = await Promise.all([
    MenuItem.find({ cook: profile._id, available: true }),
    MealPlan.find({ cook: profile._id }),
    Review.find({ cook: profile._id }).populate("customer", "name").sort({ createdAt: -1 }).limit(20),
  ]);
  return res.json({ cook: profile, menu, plans, reviews });
});

module.exports = router;
