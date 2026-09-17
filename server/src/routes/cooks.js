const express = require("express");
const CookProfile = require("../models/CookProfile");
const MenuItem = require("../models/MenuItem");
const MealPlan = require("../models/MealPlan");
const Review = require("../models/Review");
const { auth, allow } = require("../middleware/auth");
const { getCookForUser } = require("../utils/cookAccess");

const router = express.Router();

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseLocationBody(body) {
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { type: "Point", coordinates: [lng, lat] };
  }
  if (body.clearLocation) return null;
  return undefined;
}

router.get("/", async (req, res) => {
  try {
    const { city, cuisine, mealPlan, mealType, maxPrice, q, lat, lng, radiusKm } = req.query;
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

    const userLat = Number(lat);
    const userLng = Number(lng);
    const radius = Math.min(Math.max(Number(radiusKm) || 10, 1), 100);
    const useGeo = Number.isFinite(userLat) && Number.isFinite(userLng);

    let cooks;
    if (useGeo) {
      // Prefer cooks that have saved coordinates within the radius
      const geoCooks = await CookProfile.find({
        ...filter,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [userLng, userLat] },
            $maxDistance: radius * 1000,
          },
        },
      })
        .populate("user", "name email city")
        .lean();

      cooks = geoCooks.map((c) => {
        const [cookLng, cookLat] = c.location?.coordinates || [];
        const distanceKm =
          Number.isFinite(cookLat) && Number.isFinite(cookLng)
            ? Math.round(haversineKm(userLat, userLng, cookLat, cookLng) * 10) / 10
            : null;
        return { ...c, distanceKm };
      });
    } else {
      cooks = await CookProfile.find(filter).populate("user", "name email city").lean();
    }

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

    return res.json({ cooks, geo: useGeo ? { lat: userLat, lng: userLng, radiusKm: radius } : null });
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

  const nextLocation = parseLocationBody(req.body);
  if (nextLocation === null) {
    profile.set("location", undefined);
    await profile.save();
    await CookProfile.updateOne({ _id: profile._id }, { $unset: { location: "" } });
    const refreshed = await CookProfile.findById(profile._id).populate("user", "name email phone city");
    return res.json({ profile: refreshed });
  }
  if (nextLocation) {
    profile.location = nextLocation;
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
