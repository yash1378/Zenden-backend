// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateJWT = require('../middlewares/auth');

// Create a new task
router.post('/', authenticateJWT, async (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user.id; // Extract userId from JWT

  try {
    const newTask = new Task({ title, description, dueDate, userId });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tasks for the authenticated user
router.get('/', authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Extract userId from JWT

  try {
    const tasks = await Task.find({ userId });
    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const userId = req.user.id; // Extract userId from JWT

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Extract userId from JWT

  try {
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
