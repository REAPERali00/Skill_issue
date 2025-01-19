import React, { useState, useRef } from "react";
import { Navigate } from "react-router";
import { useFindMany, useAction, useUser } from "@gadgetinc/react";
import Webcam from "react-webcam"; // Add this for the camera functionality
import { api } from "../api";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
    padding: "20px",
  },
  todoList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    margin: "18px 15px 0px 15px",
  },
  todoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  todoText: {
    flex: 1,
  },
  fabContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  fab: {
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
  displayBox: {
    border: "2px solid white",
    borderRadius: "10px",
    backgroundColor: "rgb(200, 200, 200)",
    width: "90%",
    marginTop: "5px",
    height: "80vh",
    padding: "5px",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  cameraButton: {
    padding: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null); // Reference for the webcam
  const [capturedImage, setCapturedImage] = useState(null); // State to store captured image
  const [facingMode, setFacingMode] = useState("user");
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

  const capturePhoto = () => {
    imageSrc = webcamRef.current.getScreenshot();
    const [{ fetching, error }, create] = useAction(api.todo.analyzeImage);

    try {
      await create({
        taskName,
        user: { _link: user.id },
      });
      onComplete();
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
    
    setCapturedImage(imageSrc);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div style={styles.container}>
      <div style={styles.displayBox}>
        <div style={styles.todoList}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>

      <div style={styles.fabContainer}>
        <button onClick={() => setShowForm(true)} style={styles.fab}>
          +
        </button>
        <button
          onClick={() => setShowCamera((prev) => !prev)}
          style={styles.fab}
        >
          📸
        </button>
      </div>

      {showForm && <NewTodoForm onComplete={() => setShowForm(false)} />}

      {showCamera && (
        <div style={styles.cameraContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width={300}
            videoConstraints={{ facingMode }}
          />
          <button onClick={toggleCamera}>
            Switch to {facingMode === "user" ? "Rear" : "Front"} Camera
          </button>
          <button onClick={capturePhoto} style={styles.cameraButton}>
            Capture Photo
          </button>
          {capturedImage && (
            <div>
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <button
                onClick={() => setCapturedImage(null)}
                style={styles.cameraButton}
              >
                Retake
              </button>
            </div>
          )}
        </div>
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
  const [taskName, setTaskName] = useState("");
  const [{ fetching, error }, create] = useAction(api.todo.create);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await create({
        taskName,
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
      <button type="submit" disabled={fetching} style={styles.button}>
        Add Todo
      </button>
    </form>
  );
}
