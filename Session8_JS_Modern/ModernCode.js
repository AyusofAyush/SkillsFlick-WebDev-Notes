// 🚀 modern-todo.js - Refactored with Modern JavaScript

// 📦 TaskManager class with modern features
class TaskManager {
    constructor(initialTasks = []) {
        this.tasks = initialTasks;
        this.nextId = this.tasks.length > 0 
            ? Math.max(...this.tasks.map(task => task.id)) + 1 
            : 1;
    }
    
    // ➕ Add task with destructuring and default parameters
    addTask({ title = 'Untitled Task', priority = 'medium', category = 'general' } = {}) {
        const task = {
            id: this.nextId++,
            title,
            completed: false,
            priority,
            category,
            createdAt: new Date().toISOString()
        };
        
        this.tasks = [...this.tasks, task];
        return task;
    }
    
    // 🔄 Toggle task completion
    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id 
                ? { ...task, completed: !task.completed }
                : task
        );
        return this.getTask(id);
    }
    
    // 🗑️ Delete task
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
    
    // 📝 Update task
    updateTask(id, updates) {
        this.tasks = this.tasks.map(task =>
            task.id === id
                ? { ...task, ...updates }
                : task
        );
        return this.getTask(id);
    }
    
    // 🔍 Get single task
    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }
    
    // 📂 Filter tasks by criteria
    filterTasks({ category, completed, priority } = {}) {
        return this.tasks.filter(task => {
            if (category && task.category !== category) return false;
            if (completed !== undefined && task.completed !== completed) return false;
            if (priority && task.priority !== priority) return false;
            return true;
        });
    }
    
    // 📊 Get comprehensive statistics
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        const priorityStats = this.tasks.reduce((stats, task) => {
            stats[task.priority] = (stats[task.priority] || 0) + 1;
            return stats;
        }, {});
        
        const categoryStats = this.tasks.reduce((stats, task) => {
            stats[task.category] = (stats[task.category] || 0) + 1;
            return stats;
        }, {});
        
        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            priorityStats,
            categoryStats
        };
    }
    
    // 🏆 Get tasks by priority order
    getTasksByPriority() {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return [...this.tasks].sort((a, b) => 
            priorityOrder[b.priority] - priorityOrder[a.priority]
        );
    }
}

// 🎨 UI Manager for rendering and interaction
class TodoUI {
    constructor(taskManager, selectors = {}) {
        this.taskManager = taskManager;
        this.selectors = {
            container: '#tasks-container',
            form: '#task-form',
            titleInput: '#task-title',
            prioritySelect: '#task-priority',
            categorySelect: '#task-category',
            statsContainer: '#stats',
            filterButtons: '.filter-btn',
            ...selectors
        };
        
        this.currentFilter = 'all';
        this.init();
    }
    
    // 🚀 Initialize event listeners
    init() {
        this.bindEvents();
        this.render();
    }
    
    // 🎯 Bind all event listeners
    bindEvents() {
        // Form submission
        document.querySelector(this.selectors.form)
            ?.addEventListener('submit', this.handleAddTask.bind(this));
        
        // Filter buttons
        document.querySelectorAll(this.selectors.filterButtons)
            .forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentFilter = e.target.dataset.filter;
                    this.render();
                });
            });
    }
    
    // ➕ Handle add task form
    handleAddTask = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title')?.trim(),
            priority: formData.get('priority'),
            category: formData.get('category')
        };
        
        if (taskData.title) {
            this.taskManager.addTask(taskData);
            e.target.reset();
            this.render();
        }
    }
    
    // 🎭 Create task element
    createTaskElement = (task) => {
        const { id, title, priority, category, completed } = task;
        
        return `
            <div class="task-item ${completed ? 'completed' : ''}" data-id="${id}">
                <div class="task-content">
                    <span class="task-title">${title}</span>
                    <div class="task-meta">
                        <span class="task-priority priority-${priority}">${priority}</span>
                        <span class="task-category">${category}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-toggle" data-id="${id}">
                        ${completed ? '↶ Undo' : '✓ Complete'}
                    </button>
                    <button class="btn-delete" data-id="${id}">🗑️ Delete</button>
                </div>
            </div>
        `;
    }
    
    // 📊 Create stats display
    createStatsDisplay = (stats) => {
        const { total, completed, pending, completionRate, priorityStats } = stats;
        
        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>${total}</h3>
                    <p>Total Tasks</p>
                </div>
                <div class="stat-item">
                    <h3>${completed}</h3>
                    <p>Completed</p>
                </div>
                <div class="stat-item">
                    <h3>${pending}</h3>
                    <p>Pending</p>
                </div>
                <div class="stat-item">
                    <h3>${completionRate}%</h3>
                    <p>Completion Rate</p>
                </div>
            </div>
            <div class="priority-breakdown">
                <h4>Priority Breakdown:</h4>
                ${Object.entries(priorityStats)
                    .map(([priority, count]) => 
                        `<span class="priority-stat priority-${priority}">${priority}: ${count}</span>`
                    ).join(' | ')}
            </div>
        `;
    }
    
    // 🔍 Get filtered tasks
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.taskManager.filterTasks({ completed: true });
            case 'pending':
                return this.taskManager.filterTasks({ completed: false });
            case 'high-priority':
                return this.taskManager.filterTasks({ priority: 'high' });
            default:
                return this.taskManager.tasks;
        }
    }
    
    // 🎨 Render everything
    render() {
        this.renderTasks();
        this.renderStats();
        this.updateFilterButtons();
    }
    
    // 📋 Render tasks
    renderTasks() {
        const container = document.querySelector(this.selectors.container);
        if (!container) return;
        
        const tasks = this.getFilteredTasks();
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks found</div>';
            return;
        }
        
        container.innerHTML = tasks.map(this.createTaskElement).join('');
        
        // Add event listeners to new elements
        container.addEventListener('click', this.handleTaskAction);
    }
    
    // 📊 Render statistics
    renderStats() {
        const statsContainer = document.querySelector(this.selectors.statsContainer);
        if (!statsContainer) return;
        
        const stats = this.taskManager.getStats();
        statsContainer.innerHTML = this.createStatsDisplay(stats);
    }
    
    // 🎯 Handle task actions (toggle, delete)
    handleTaskAction = (e) => {
        const { target } = e;
        const taskId = parseInt(target.dataset.id);
        
        if (!taskId) return;
        
        if (target.classList.contains('btn-toggle')) {
            this.taskManager.toggleTask(taskId);
            this.render();
        } else if (target.classList.contains('btn-delete')) {
            this.taskManager.deleteTask(taskId);
            this.render();
        }
    }
    
    // 🔘 Update filter button states
    updateFilterButtons() {
        document.querySelectorAll(this.selectors.filterButtons).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }
}

// 🎯 Application initialization
const initializeApp = async () => {
    // Sample data
    const initialTasks = [
        { id: 1, title: 'Buy groceries', completed: false, priority: 'high', category: 'personal' },
        { id: 2, title: 'Finish project', completed: false, priority: 'high', category: 'work' },
        { id: 3, title: 'Call mom', completed: true, priority: 'medium', category: 'personal' },
        { id: 4, title: 'Book dentist', completed: false, priority: 'low', category: 'health' }
    ];
    
    // Initialize managers
    const taskManager = new TaskManager(initialTasks);
    const todoUI = new TodoUI(taskManager);
    
    // Make available globally for debugging
    window.taskManager = taskManager;
    window.todoUI = todoUI;
    
    console.log('✅ Modern Todo App initialized!');
    console.log('📊 Current stats:', taskManager.getStats());
};

// 🚀 Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// 📦 Export for module usage
export { TaskManager, TodoUI, initializeApp };