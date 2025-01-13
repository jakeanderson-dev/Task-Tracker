document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.getElementById('task-container');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');

    // Fetch tasks from the server
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTaskToDOM(task); // Add each task to the DOM
            });
        })
        .catch(err => console.error('Error fetching tasks:', err));

    // Handle form submission to add a new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        const newTask = { title: taskInput.value.trim() }; // Trim spaces around input

        // Check for empty input
        if (!newTask.title) {
            alert('Please enter a task');
            return;
        }

        // POST request to create a new task
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
            .then(response => response.json())
            .then(task => {
                addTaskToDOM(task); // Add the new task to the DOM
                taskInput.value = ''; // Clear the input field
            })
            .catch(err => console.error('Error adding task:', err));
    });

    // Helper function to add a task to the DOM
function addTaskToDOM(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.id = task.id; // Store the task ID in the element
    
    // Create a task label
    const taskLabel = document.createElement('span');
    taskLabel.textContent = `${task.title} - ${task.completed ? '✅' : '❌'}`;
    taskElement.appendChild(taskLabel);
    
    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    taskElement.appendChild(deleteButton);
    
    // Add event listener to toggle task completion
    taskElement.addEventListener('click', () => {
        // Toggle completion on the server
        fetch(`/api/tasks/${task.id}`, {
            method: 'PATCH',
        })
            .then(response => response.json())
            .then(updatedTask => {
                // Update task in DOM
                taskLabel.textContent = `${updatedTask.title} - ${updatedTask.completed ? '✅' : '❌'}`;
            })
            .catch(err => console.error('Error updating task:', err));
    });

    // Add event listener to delete task
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the task from toggling completion
        // Delete the task from the server
        fetch(`/api/tasks/${task.id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(deletedTask => {
                // Remove the task from the DOM
                taskElement.remove();
                console.log('Deleted task:', deletedTask);
            })
            .catch(err => console.error('Error deleting task:', err));
    });
    
    taskContainer.appendChild(taskElement);
}

});


