const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    kind: { type: String, enum: ["cuisine", "menu"], default: "cuisine" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
