// script.js
// Simple To-Do application core logic
// ------------------------------------------------------------
// Task shape: { id: string, text: string, completed: boolean }
// All data is persisted in localStorage under the key "todoTasks".
// ------------------------------------------------------------

(() => {
  // ---------- Task Manager ----------
  const STORAGE_KEY = "todoTasks";
  let _filter = "all"; // possible values: 'all', 'active', 'completed'

  /** Retrieve tasks from localStorage, parsed as an array. */
  function getTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      return [];
    }
  }

  /** Persist the supplied array of tasks to localStorage. */
  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  /** Add a new task with the given text. */
  function addTask(text) {
    if (!text || typeof text !== "string") return;
    const tasks = getTasks();
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  }

  /** Edit the text of a task identified by id. */
  function editTask(id, newText) {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;
    task.text = newText.trim();
    saveTasks(tasks);
    return true;
  }

  /** Delete a task by id. */
  function deleteTask(id) {
    let tasks = getTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    if (tasks.length === initialLength) return false; // nothing removed
    saveTasks(tasks);
    return true;
  }

  /** Toggle the completed flag of a task. */
  function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;
    task.completed = !task.completed;
    saveTasks(tasks);
    return true;
  }

  /** Set the current filter used by getFilteredTasks. */
  function setFilter(filter) {
    if (["all", "active", "completed"].includes(filter)) {
      _filter = filter;
    }
  }

  /** Return tasks according to the current filter. */
  function getFilteredTasks() {
    const tasks = getTasks();
    switch (_filter) {
      case "active":
        return tasks.filter((t) => !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }

  // Expose the manager for testing / external use
  const TaskManager = {
    getTasks,
    saveTasks,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    setFilter,
    getFilteredTasks,
  };

  // ---------- UI Rendering ----------
  const taskListEl = document.getElementById("task-list");

  /** Clear the task list container and render tasks based on the current filter. */
  function renderTasks() {
    // Ensure the container exists (script may run before DOM ready in some environments)
    if (!taskListEl) return;
    // Remove all existing children
    taskListEl.innerHTML = "";
    const tasks = TaskManager.getFilteredTasks();
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.className = task.completed ? "completed" : "";

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.id = task.id;
      checkbox.className = "task-checkbox";

      // Text span
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.dataset.id = task.id;
      editBtn.className = "edit-button";

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.dataset.id = task.id;
      delBtn.className = "delete-button";

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
      taskListEl.appendChild(li);
    });
  }

  // ---------- Event Listeners ----------
  function attachEventListeners() {
    // Add task via button click
    const addBtn = document.getElementById("add-task-button");
    const inputEl = document.getElementById("new-task-input");

    if (addBtn && inputEl) {
      addBtn.addEventListener("click", () => {
        const text = inputEl.value.trim();
        if (text) {
          TaskManager.addTask(text);
          inputEl.value = "";
          renderTasks();
        }
      });

      // Add task via Enter key in the input field
      inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addBtn.click();
        }
      });
    }

    // Delegated events for task list actions
    if (taskListEl) {
      taskListEl.addEventListener("change", (e) => {
        const target = e.target;
        if (target.matches(".task-checkbox")) {
          const id = target.dataset.id;
          TaskManager.toggleTask(id);
          renderTasks();
        }
      });

      taskListEl.addEventListener("click", (e) => {
        const target = e.target;
        const li = target.closest("li");
        if (!li) return;
        const id = li.dataset.id;

        // Delete button
        if (target.matches(".delete-button")) {
          TaskManager.deleteTask(id);
          renderTasks();
          return;
        }

        // Edit button – switch to edit mode
        if (target.matches(".edit-button")) {
          // Prevent creating multiple edit inputs
          const existingInput = li.querySelector(".edit-input");
          if (existingInput) return;

          const span = li.querySelector('.task-text');
          const currentText = span ? span.textContent : "";

          const editInput = document.createElement("input");
          editInput.type = "text";
          editInput.value = currentText;
          editInput.className = "edit-input";

          // Replace span with input
          if (span) li.replaceChild(editInput, span);
          editInput.focus();
          // Store original text in dataset for potential cancel
          editInput.dataset.original = currentText;
        }
      });

      // Handle key actions while editing a task
      taskListEl.addEventListener("keydown", (e) => {
        const target = e.target;
        if (!target.matches('.edit-input')) return;
        const li = target.closest('li');
        const id = li.dataset.id;
        if (e.key === "Enter") {
          e.preventDefault();
          const newText = target.value.trim();
          if (newText) {
            TaskManager.editTask(id, newText);
          }
          // Restore normal view
          const span = document.createElement('span');
          span.className = 'task-text';
          span.textContent = newText || target.dataset.original;
          li.replaceChild(span, target);
          renderTasks();
        } else if (e.key === "Escape") {
          // Cancel edit – revert to original text
          const span = document.createElement('span');
          span.className = 'task-text';
          span.textContent = target.dataset.original;
          li.replaceChild(span, target);
        }
      });
    }

    // Filter buttons
    const filterContainer = document.querySelector('.filters');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-button');
        if (!btn) return;
        const filter = btn.dataset.filter;
        TaskManager.setFilter(filter);
        // Update active class
        const allButtons = filterContainer.querySelectorAll('.filter-button');
        allButtons.forEach(b => b.classList.toggle('active', b === btn));
        renderTasks();
      });
    }
  }

  // ---------- Initialization ----------
  document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    attachEventListeners();
  });

  // Export for external testing (if module system is used)
  window.TaskManager = TaskManager;
  window.renderTasks = renderTasks;
})();
