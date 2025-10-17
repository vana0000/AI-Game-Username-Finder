// src/App.js
import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validate input before calling the backend
  const validateUsername = (name) => {
    if (!name.trim()) return "Username cannot be empty.";
    if (name.length < 3 || name.length > 16)
      return "Username must be between 3 and 16 characters.";
    if (name.startsWith(" ") || name.endsWith(" "))
      return "Username cannot start or end with a space.";
    if (/\s{2,}/.test(name))
      return "Username cannot contain multiple spaces in a row.";
    return "";
  };

  const checkUsername = async () => {
    // Run local validation first
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/usernames/check?username=${username}`
      );
      setResult(res.data);
    } catch (err) {
      setResult({
        error: err.response?.data?.detail || "Server error. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Critical Ops Username Finder</h1>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          marginRight: "0.5rem",
          width: "250px",
        }}
      />

      <button
        onClick={checkUsername}
        disabled={loading || !username.trim()}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Checking..." : "Check"}
      </button>

      {/* Local validation error (before API) */}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>⚠️ {error}</p>}

      {/* API result (after backend call) */}
      {result && !error && (
        <div style={{ marginTop: "1rem" }}>
          {result.error ? (
            <p style={{ color: "red" }}>⚠️ {result.error}</p>
          ) : result.available ? (
            <p style={{ color: "green" }}>
              ✅ <strong>{result.username}</strong> is available!
            </p>
          ) : (
            <div>
              <p style={{ color: "red" }}>
                ❌ <strong>{result.username}</strong> is taken!
              </p>

              {/* 👇 Show reasoning from backend */}
              {result.reason && (
                <p style={{ color: "gray" }}>
                  <strong>Reason:</strong> {result.reason}
                </p>
              )}

              {/* 👇 Show where the result came from */}
              {result.source && (
                <p style={{ color: "gray" }}>
                  <strong>Source:</strong> {result.source}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
