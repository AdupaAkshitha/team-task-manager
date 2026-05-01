require("dotenv").config();
const Task = require("./models/Task");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// ✅ ROUTES AFTER MIDDLEWARE
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });

    await user.save();

    res.send("User created");
  } catch (err) {
    res.send(err);
  }
});
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("User not found");
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Wrong password");
    }

    // create token
    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.send(err);
  }
});
app.post("/task", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const task = new Task({
      title,
      description,
      userId
    });

    await task.save();

    res.send("Task created");
  } catch (err) {
    res.send(err);
  }
});
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.put("/task/:id", async (req, res) => {
  const { status } = req.body;

  await Task.findByIdAndUpdate(req.params.id, { status });

  res.send("Task updated");
});
app.delete("/task/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
app.get("/dashboard", async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "done" });
  const pending = await Task.countDocuments({ status: "pending" });

  res.json({
    total,
    completed,
    pending
  });
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Running");
});

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// SERVER START
app.listen(5000, () => console.log("Server started on port 5000"));