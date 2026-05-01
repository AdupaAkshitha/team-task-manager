const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "pending" },
  userId: String   // who created task
});

module.exports = mongoose.model("Task", taskSchema);