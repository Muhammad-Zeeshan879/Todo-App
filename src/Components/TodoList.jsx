import { useState } from "react";
import { Trash2, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TodoList({ tasks, onToggle, onDelete, onEdit }) {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") return;
    onEdit(id, editText);
    setEditId(null);
    setEditText("");
  };

  return tasks.length === 0 ? (
    <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
      No tasks yet. Add something above
    </div>
  ) : (
    <ul className="space-y-2">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className={`bg-gray-100 p-3 rounded-lg border flex items-center justify-between ${
              task.completed ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-center flex-1 gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="w-4 h-4 accent-blue-500"
              />

              {editId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none"
                />
              ) : (
                <span
                  className={`flex-1 ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>
              )}
            </div>

            <div className="flex gap-2 ml-2">
              {editId === task.id ? (
                <button
                  onClick={() => saveEdit(task.id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <Check size={18} />
                </button>
              ) : (
                <button
                  onClick={() => startEditing(task)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
              )}

              <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default TodoList;
