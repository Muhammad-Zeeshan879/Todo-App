import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

function App() {
  // Initialize state from localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
    }
    return [];
  });

  // Save tasks to localStorage on every change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const editTask = (id, newText) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
  };

  // Theme toggle logic
  const [darkMode, setDarkMode] = useState(() => {
    // Persist theme in localStorage
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Filter state: "all", "active", "completed"
  const [filter, setFilter] = useState("all");

  // Filtered tasks based on filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Clear completed tasks handler
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="min-h-screen p-4 transition-colors bg-gray-100 dark:bg-gray-900">
      <div className="max-w-xl p-6 mx-auto bg-white shadow-md dark:bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="flex-1 text-2xl font-bold text-center text-blue-600 dark:text-blue-300">
            React To-Do App
          </h1>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-3 py-1 ml-4 text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            <motion.span
              key={darkMode ? "moon" : "sun"}
              initial={{ rotate: 180, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {darkMode ? "🌙" : "☀️"}
            </motion.span>
          </button>
        </div>
        <TodoInput onAdd={addTask} />

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {/* Todo List */}
        <TodoList
          tasks={filteredTasks}
          onToggle={toggleComplete}
          onDelete={deleteTask}
          onEdit={editTask}
        />

        {/* Clear Completed Button */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            onClick={clearCompleted}
          >
            Clear Completed Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;