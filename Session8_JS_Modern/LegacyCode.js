// 🗿 legacy-todo.js - Old ES5 Style Code
var TodoApp = {
    tasks: [
        { id: 1, title: 'Buy groceries', completed: false, priority: 'high', category: 'personal' },
        { id: 2, title: 'Finish project', completed: false, priority: 'high', category: 'work' },
        { id: 3, title: 'Call mom', completed: true, priority: 'medium', category: 'personal' },
        { id: 4, title: 'Book dentist', completed: false, priority: 'low', category: 'health' }
    ],
    
    nextId: 5,
    
    // Add new task
    addTask: function(title, priority, category) {
        var task = {
            id: this.nextId++,
            title: title || 'Untitled Task',
            completed: false,
            priority: priority || 'medium',
            category: category || 'general'
        };
        this.tasks.push(task);
        this.renderTasks();
    },
    
    // Toggle task completion
    toggleTask: function(id) {
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === id) {
                this.tasks[i].completed = !this.tasks[i].completed;
                break;
            }
        }
        this.renderTasks();
    },
    
    // Delete task
    deleteTask: function(id) {
        var newTasks = [];
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id !== id) {
                newTasks.push(this.tasks[i]);
            }
        }
        this.tasks = newTasks;
        this.renderTasks();
    },
    
    // Get tasks by category
    getTasksByCategory: function(category) {
        var filtered = [];
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].category === category) {
                filtered.push(this.tasks[i]);
            }
        }
        return filtered;
    },
    
    // Get task statistics
    getStats: function() {
        var completed = 0;
        var pending = 0;
        var highPriority = 0;
        
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].completed) {
                completed++;
            } else {
                pending++;
            }
            if (this.tasks[i].priority === 'high') {
                highPriority++;
            }
        }
        
        return {
            total: this.tasks.length,
            completed: completed,
            pending: pending,
            highPriority: highPriority
        };
    },
    
    // Render tasks to DOM
    renderTasks: function() {
        var container = document.getElementById('tasks-container');
        container.innerHTML = '';
        
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            var taskElement = document.createElement('div');
            taskElement.className = 'task-item ' + (task.completed ? 'completed' : '');
            
            taskElement.innerHTML = '<span class="task-title">' + task.title + '</span>' +
                '<span class="task-priority priority-' + task.priority + '">' + task.priority + '</span>' +
                '<span class="task-category">' + task.category + '</span>' +
                '<button onclick="TodoApp.toggleTask(' + task.id + ')">' + 
                (task.completed ? 'Undo' : 'Complete') + '</button>' +
                '<button onclick="TodoApp.deleteTask(' + task.id + ')">Delete</button>';
            
            container.appendChild(taskElement);
        }
        
        // Update stats
        var stats = this.getStats();
        document.getElementById('stats').innerHTML = 
            'Total: ' + stats.total + ' | ' +
            'Completed: ' + stats.completed + ' | ' +
            'Pending: ' + stats.pending + ' | ' +
            'High Priority: ' + stats.highPriority;
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    TodoApp.renderTasks();
    
    document.getElementById('add-task-btn').addEventListener('click', function() {
        var title = document.getElementById('task-title').value;
        var priority = document.getElementById('task-priority').value;
        var category = document.getElementById('task-category').value;
        
        if (title.trim() !== '') {
            TodoApp.addTask(title, priority, category);
            document.getElementById('task-title').value = '';
        }
    });
});