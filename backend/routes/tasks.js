const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks
router.get("/", auth, async (req, res) => {
  const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
  const tasks = await Task.find(query).populate("assignedTo", "username");
  res.json(tasks);
});

// Create a new task (admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admins can create tasks" });

  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Update a task status
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  task.status = req.body.status;
  await task.save();
  res.json(task);
});

module.exports = router;
// Delete task (admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted" });
});
const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };

// Add filtering by status
if (req.query.status) {
  query.status = req.query.status;
}
