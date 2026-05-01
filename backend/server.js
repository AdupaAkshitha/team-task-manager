require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ---------------- AUTH ----------------

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });

    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Wrong password");

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ---------------- TASKS ----------------

// CREATE TASK
app.post("/task", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const task = new Task({ title, description, userId });

    await task.save();

    res.json({ message: "Task created" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// UPDATE TASK
app.put("/task/:id", async (req, res) => {
  const { status } = req.body;

  await Task.findByIdAndUpdate(req.params.id, { status });

  res.json({ message: "Task updated" });
});

// DELETE TASK
app.delete("/task/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// DASHBOARD
app.get("/dashboard", async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "done" });
  const pending = await Task.countDocuments({ status: "pending" });

  res.json({ total, completed, pending });
});

// HOME
app.get("/", (req, res) => {
  res.send("Server Running");
});

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// PORT FIX (IMPORTANT FOR RAILWAY)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
