require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const User = require("./models/User");
const CookProfile = require("./models/CookProfile");
const MenuItem = require("./models/MenuItem");
const MealPlan = require("./models/MealPlan");
const Order = require("./models/Order");
const Subscription = require("./models/Subscription");
const Review = require("./models/Review");
const Category = require("./models/Category");
const Complaint = require("./models/Complaint");

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    CookProfile.deleteMany({}),
    MenuItem.deleteMany({}),
    MealPlan.deleteMany({}),
    Order.deleteMany({}),
    Subscription.deleteMany({}),
    Review.deleteMany({}),
    Category.deleteMany({}),
    Complaint.deleteMany({}),
  ]);

  const password = await bcrypt.hash("Demo@123", 10);

  const admin = await User.create({
    name: "HomeFeast Admin",
    email: "admin@homefeast.com",
    password,
    role: "admin",
    city: "Pune",
  });

  const student = await User.create({
    name: "Aarav Shah",
    email: "student@homefeast.com",
    password,
    phone: "9876500001",
    role: "customer",
    city: "Pune",
    address: "Kothrud, Pune",
  });

  const professional = await User.create({
    name: "Meera Iyer",
    email: "meera@homefeast.com",
    password,
    phone: "9876500002",
    role: "customer",
    city: "Mumbai",
    address: "Andheri West, Mumbai",
  });

  const cookUsers = await User.create([
    {
      name: "Sunita Joshi",
      email: "sunita@homefeast.com",
      password,
      phone: "9876500101",
      role: "cook",
      city: "Pune",
    },
    {
      name: "Rafiq Khan",
      email: "rafiq@homefeast.com",
      password,
      phone: "9876500102",
      role: "cook",
      city: "Mumbai",
    },
    {
      name: "Lakshmi Nair",
      email: "lakshmi@homefeast.com",
      password,
      phone: "9876500103",
      role: "cook",
      city: "Delhi",
    },
    {
      name: "Pending Cook",
      email: "pending@homefeast.com",
      password,
      phone: "9876500104",
      role: "cook",
      city: "Pune",
    },
  ]);

  const [sunita, rafiq, lakshmi, pending] = cookUsers;

  const [sunitaKitchen, rafiqKitchen, lakshmiKitchen] = await CookProfile.create([
    {
      user: sunita._id,
      kitchenName: "Aai's Thali",
      bio: "Home-style Maharashtrian meals cooked fresh every morning.",
      city: "Pune",
      serviceAreas: ["Kothrud", "Erandwane", "Shivajinagar"],
      cuisines: ["Maharashtrian", "North Indian"],
      deliveryStart: "11:30",
      deliveryEnd: "14:00",
      status: "approved",
      ratingAvg: 4.6,
      ratingCount: 1,
    },
    {
      user: rafiq._id,
      kitchenName: "Nani's Dabba",
      bio: "Mild Mughlai and everyday roti-sabzi for working professionals.",
      city: "Mumbai",
      serviceAreas: ["Andheri", "Jogeshwari", "Vile Parle"],
      cuisines: ["Mughlai", "North Indian"],
      deliveryStart: "12:00",
      deliveryEnd: "15:00",
      status: "approved",
      ratingAvg: 0,
      ratingCount: 0,
    },
    {
      user: lakshmi._id,
      kitchenName: "Amma's Kitchen",
      bio: "Kerala sadya-style lunches and simple dinner boxes.",
      city: "Delhi",
      serviceAreas: ["Hauz Khas", "Green Park", "Saket"],
      cuisines: ["South Indian", "Kerala"],
      deliveryStart: "11:00",
      deliveryEnd: "13:30",
      status: "approved",
      ratingAvg: 0,
      ratingCount: 0,
    },
    {
      user: pending._id,
      kitchenName: "New Home Kitchen",
      bio: "Awaiting admin approval.",
      city: "Pune",
      serviceAreas: ["Hadapsar"],
      cuisines: ["Gujarati"],
      status: "pending",
    },
  ]);

  await MenuItem.create([
    {
      cook: sunitaKitchen._id,
      name: "Maharashtrian Thali",
      description: "Bhakri, pithla, thecha, rice and salad",
      mealType: "veg",
      price: 120,
      category: "Thali",
    },
    {
      cook: sunitaKitchen._id,
      name: "Chicken Sukka Plate",
      description: "Home chicken sukka with chapati and dal",
      mealType: "non-veg",
      price: 160,
      category: "Non-veg",
    },
    {
      cook: rafiqKitchen._id,
      name: "Roti Sabzi Box",
      description: "4 rotis, seasonal sabzi, dal and raita",
      mealType: "veg",
      price: 130,
      category: "Thali",
    },
    {
      cook: rafiqKitchen._id,
      name: "Keema Pav Lunch",
      description: "Minced mutton with pav and kachumber",
      mealType: "non-veg",
      price: 180,
      category: "Non-veg",
    },
    {
      cook: lakshmiKitchen._id,
      name: "Kerala Lunch Box",
      description: "Rice, sambar, thoran, pickle and papadam",
      mealType: "veg",
      price: 140,
      category: "Thali",
    },
    {
      cook: lakshmiKitchen._id,
      name: "Fish Curry Meal",
      description: "Meen curry, rice and cabbage thoran",
      mealType: "non-veg",
      price: 190,
      category: "Non-veg",
    },
  ]);

  await MealPlan.create([
    { cook: sunitaKitchen._id, type: "daily", price: 120, description: "One lunch tiffin", includedMeals: "Lunch" },
    { cook: sunitaKitchen._id, type: "weekly", price: 750, description: "6 working-day lunches", includedMeals: "Lunch" },
    { cook: sunitaKitchen._id, type: "monthly", price: 2800, description: "26 lunch boxes", includedMeals: "Lunch" },
    { cook: rafiqKitchen._id, type: "daily", price: 130, description: "Weekday lunch", includedMeals: "Lunch" },
    { cook: rafiqKitchen._id, type: "weekly", price: 800, description: "6 lunches", includedMeals: "Lunch" },
    { cook: lakshmiKitchen._id, type: "weekly", price: 820, description: "South Indian week", includedMeals: "Lunch" },
    { cook: lakshmiKitchen._id, type: "monthly", price: 3000, description: "Full month lunch", includedMeals: "Lunch" },
  ]);

  const thali = await MenuItem.findOne({ name: "Maharashtrian Thali" });
  const completed = await Order.create({
    customer: student._id,
    cook: sunitaKitchen._id,
    items: [{ menuItem: thali._id, name: thali.name, quantity: 1, price: thali.price }],
    totalAmount: 120,
    status: "completed",
    deliveryAddress: "Kothrud, Pune",
    notes: "Less spicy",
  });

  await Order.create({
    customer: student._id,
    cook: sunitaKitchen._id,
    items: [{ menuItem: thali._id, name: thali.name, quantity: 2, price: thali.price }],
    totalAmount: 240,
    status: "pending",
    deliveryAddress: "Kothrud, Pune",
  });

  await Review.create({
    customer: student._id,
    cook: sunitaKitchen._id,
    order: completed._id,
    rating: 5,
    comment: "Tastes like home. On time and hot.",
  });

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  await Subscription.create({
    customer: professional._id,
    cook: rafiqKitchen._id,
    planType: "weekly",
    price: 800,
    startDate: start,
    endDate: end,
    status: "pending",
    deliveryAddress: "Andheri West, Mumbai",
  });

  await Category.create([
    { name: "Maharashtrian", kind: "cuisine" },
    { name: "North Indian", kind: "cuisine" },
    { name: "South Indian", kind: "cuisine" },
    { name: "Mughlai", kind: "cuisine" },
    { name: "Kerala", kind: "cuisine" },
    { name: "Gujarati", kind: "cuisine" },
    { name: "Thali", kind: "menu" },
    { name: "Non-veg", kind: "menu" },
  ]);

  await Complaint.create({
    raisedBy: student._id,
    againstUser: sunita._id,
    order: completed._id,
    subject: "Late delivery once",
    description: "Box arrived 40 minutes late last Friday.",
    status: "open",
  });

  console.log("Seed complete. Demo password for all accounts: Demo@123");
  console.log("Admin:   admin@homefeast.com");
  console.log("Student: student@homefeast.com");
  console.log("Cook:    sunita@homefeast.com");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
