import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = async () => {
    await axios.post("http://localhost:5000/task", {
      title,
      description: "simple task",
      userId: "demo"
    });
    getTasks();
  };

  const getTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>

      <input
        placeholder="Enter task"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <h2>Tasks</h2>
      {tasks.map((t) => (
        <div key={t._id}>
          {t.title} - {t.status}
        </div>
      ))}
    </div>
  );
}

export default App;