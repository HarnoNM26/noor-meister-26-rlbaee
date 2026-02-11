import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [db, setDb] = useState("");

  useEffect(() => {
    const getStatus = async () => {
      const [status, setStatus] = useState("");
      const res = await fetch("http://localhost:5000/api/health");
      setStatus(res.status);
      setDb(res.db);
    };
    getStatus();
  }, []);

  return (
    <>
      <p>Status: {status}</p>
      <p>Database: {db}</p>
    </>
  );
}

export default App;
