import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const API = "https://team-task-manager-production-a6ec.up.railway.app";

  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  // GET TASKS
  const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  // ADD TASK
  const addTask = async () => {
    if (!title) return;

    await axios.post(`${API}/task`, {
      title,
      description: "task",
      userId: "demo"
    });

    setTitle("");
    getTasks();
  };

  // UPDATE STATUS
  const updateStatus = async (id) => {
    await axios.put(`${API}/task/${id}`, {
      status: "done"
    });

    getTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await axios.delete(`${API}/task/${id}`);
    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1 style={{ color: "#4CAF50" }}>🚀 Team Task Manager</h1>

      <input
        value={title}
        placeholder="Enter task"
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />

      <button onClick={addTask}>Add Task</button>

      <h3>Total Tasks: {tasks.length}</h3>
      <h3>Completed: {tasks.filter(t => t.status === "done").length}</h3>

      <h2>Tasks</h2>

      {tasks.map((t) => (
        <div
          key={t._id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5
          }}
        >
          <b>{t.title}</b> - {t.status}

          <br />

          <button onClick={() => updateStatus(t._id)}>✔ Done</button>
          <button onClick={() => deleteTask(t._id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
