const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "CookProfile", required: true },
    type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    includedMeals: { type: String, trim: true, default: "Lunch" },
  },
  { timestamps: true }
);

mealPlanSchema.index({ cook: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
