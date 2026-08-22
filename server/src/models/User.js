const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["customer", "cook", "admin"], required: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    city: this.city,
    address: this.address,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
