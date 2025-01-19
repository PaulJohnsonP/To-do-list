// Select DOM elements
const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const sortButton = document.getElementById('sort-btn');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener for adding tasks
addButton.addEventListener('click', () => {
    const taskText = inputField.value;

    if (taskText.trim() !== '') {
        addTask(taskText);
        inputField.value = ''; // Clear input after adding
        saveTasks(); // Save to local storage
    }
});

// Add task to the list
function addTask(taskText, completed = false) {
    const li = document.createElement('li');

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed; // Set checkbox state based on completion
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed', checkbox.checked);
        saveTasks(); // Update local storage when toggling
    });

    // Append checkbox and task text to the list item
    li.appendChild(checkbox);
    const textNode = document.createTextNode(taskText);
    li.appendChild(textNode);

    // Add edit button with pen icon
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Pen icon
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent li click event
        const newText = prompt('Edit your task', textNode.textContent);
        if (newText && newText.trim() !== '') {
            textNode.textContent = newText;
            saveTasks(); // Save edited task to local storage
        }
    });

    // Add delete button with bin icon
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Trash bin icon
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent li click event
        li.remove();
        saveTasks(); // Update local storage when task is deleted
    });

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);

    // Mark the task as completed if it was saved that way
    if (completed) {
        li.classList.add('completed');
    }
}

// Save tasks to local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        tasks.push({
            text: li.childNodes[1].textContent, // Get task text
            completed: checkbox.checked, // Get checkbox state
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach(task => {
            addTask(task.text, task.completed);
        });
    }
}

// Sort tasks by completion status
sortButton.addEventListener('click', () => {
    const tasks = Array.from(todoList.querySelectorAll('li'));
    tasks.sort((a, b) => a.classList.contains('completed') - b.classList.contains('completed'));
    tasks.forEach(task => todoList.appendChild(task)); // Re-arrange tasks in the DOM
});
