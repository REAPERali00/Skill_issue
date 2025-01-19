import { useState } from "react";
import { Navigate } from "react-router";
import { useFindMany, useAction, useUser, useFindFirst } from "@gadgetinc/react";
import { api } from "../api";
import { useGroq } from "../hooks/useGroq";

import "./todo.css";
 
export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  let user;

  try {
    user = useUser();
  } catch (error) {
    return <div className="todo-container">Loading...</div>;
 
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  const [{ data: todos, fetching, error }] = useFindMany(api.todo, {
    filter: { user: { id: { equals: user.id } } },
    sort: { createdAt: "Descending" },
  });

 
  if (fetching) return <div className="todo-container">Loading todos...</div>;
  if (error)
    return (
      <div className="todo-container">Error loading todos: {error.message}</div>
 
    );

  return (
 
    <div className="todo-container">
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))} 
 
      </div>

      {showForm ? (
        <NewTodoForm onComplete={() => setShowForm(false)} />
      ) : (
 
        <button onClick={() => setShowForm(true)} className="todo-fab">
          +
        </button>
      )}
    </div>
  );
}

function TodoItem({ todo }) {
  const [{ fetching, error }, update] = useAction(api.todo.update);

  return <div className="todo-item">
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
    <span className="todo-text">
      {todo.taskName} ({todo.skill} - {todo.score})
    </span>
    {error && <div className="error-message">{error.message}</div>}
  </div>;
}
-
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
      <div className="todo-form">
 
        <div>Loading skills...</div>
      </div>
    );
  }

  if (statsError) {
 
    return ( 
      <div className="todo-form">
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

  return <form onSubmit={handleSubmit} className="form">
    {error && <div className="error-message">{error.message}</div>}
    <input
      type="text"
      value={taskName}
      onChange={(e) => setTaskName(e.target.value)}
      placeholder="Task name" 
      required
      className="input"
    />
    <select
      value={skill}
      onChange={(e) => setSkill(e.target.value)}
      required
      className="input"
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
      className="input"
    />
    <button type="submit" disabled={fetching} className="button">
      Add Todo
    </button>
  </form>;
}