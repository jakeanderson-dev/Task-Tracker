
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let tasks = [
    { id: 1, title: 'Learn JavaScript', completed: false },
    { id: 2, title: 'Build a Task Tracker', completed: true },
];

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from "public" folder

// Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks); // Return the tasks array
});

// Add a POST endpoint to create a new task
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    if (!newTask.title) {
        return res.status(400).json({ error: 'Task title is required' });
    }
    newTask.completed = false; // Default new tasks to not completed
    newTask.id = tasks.length + 1; // Assign an ID to the new task
    tasks.push(newTask); // Add the new task to the array
    res.status(201).json(newTask); // Respond with the created task
});

// Add a PATCH endpoint to update task completion
app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id == id); // Find task by ID

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle completion status
    task.completed = !task.completed;

    res.json(task); // Return updated task
});

// Add a DELETE endpoint to remove a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id == id); // Find the task by ID

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Remove the task from the array
    const deletedTask = tasks.splice(taskIndex, 1);

    res.json(deletedTask[0]); // Return the deleted task
});


// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


