import { useState } from "react";
import { Navigate } from "react-router";
import { useFindMany, useAction, useUser, useFindFirst } from "@gadgetinc/react";
import { api } from "../api";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  todoList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  todoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  todoText: {
    flex: 1,
  },
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  form: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  let user;

  try {
    user = useUser();
  } catch (error) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  const [{ data: todos, fetching, error }] = useFindMany(api.todo, {
    filter: { user: { id: { equals: user.id } } },
    sort: { createdAt: "Descending" },
  });

  if (fetching) return <div style={styles.container}>Loading todos...</div>;
  if (error)
    return (
      <div style={styles.container}>Error loading todos: {error.message}</div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.todoList}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>

      {showForm ? (
        <NewTodoForm onComplete={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)} style={styles.fab}>
          +
        </button>
      )}
    </div>
  );
}

function TodoItem({ todo }) {
  const [{ fetching, error }, update] = useAction(api.todo.update);

  return (
    <div style={styles.todoItem}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        disabled={fetching}
        onChange={() => {
          update({
            id: todo.id,
            isCompleted: !todo.isCompleted,
            skill: todo.skill,
            score: todo.score,
          });
        }}
      />
      <span style={styles.todoText}>
        {todo.taskName} ({todo.skill} - {todo.score})
      </span>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </div>
  );
}

function NewTodoForm({ onComplete }) {
  const user = useUser();
  const [{ data: userStat, fetching: fetchingStats, error: statsError }] = useFindFirst(api.userStat, {
    filter: { user: { id: { equals: user.id } } },
  });

  const [taskName, setTaskName] = useState("");
  const [skill, setSkill] = useState("");
  const [score, setScore] = useState("");
  const [{ fetching, error }, create] = useAction(api.todo.create);

  if (fetchingStats) {
    return (
      <div style={styles.form}>
        <div>Loading skills...</div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div style={styles.form}>
        <div style={{ color: "red" }}>Error loading skills: {statsError.message}</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await create({
        taskName,
        skill,
        score: parseInt(score),
        user: { _link: user.id },
      });
      onComplete();
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
        required
        style={styles.input}
      />
      <select
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        required
        style={styles.input}
      >
        <option value="">Select a skill</option>
        <option value={userStat.skillOne}>{userStat.skillOne}</option>
        <option value={userStat.skillTwo}>{userStat.skillTwo}</option>
        <option value={userStat.skillThree}>{userStat.skillThree}</option>
        <option value={userStat.skillFour}>{userStat.skillFour}</option>
        <option value={userStat.skillFive}>{userStat.skillFive}</option>
      </select>
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Score (0-100)"
        min="0"
        max="100"
        required
        style={styles.input}
      />
      <button type="submit" disabled={fetching} style={styles.button}>
        Add Todo
      </button>
    </form>
  );
}