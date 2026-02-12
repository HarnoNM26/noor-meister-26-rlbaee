import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("");
  const [db, setDb] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const newerStartDate = newStartDate.toISOString();
    const newerEndDate = newEndDate.toISOString();

    setStartDate(newerStartDate);
    setEndDate(newerEndDate);
    // const dateToIso = newDate.toISOString();
    // console.log(dateToIso);

    console.log(newerStartDate, newerEndDate);

    console.log(startDate, endDate);
    try {
      const res = await fetch("http://localhost:5000/api/sync/prices", {
        method: "POST",
        body: JSON.stringify({
          start: startDate,
          end: endDate,
          fields: fields,
        }),
      });
      setData(res.json());
    } catch (error) {
      console.log(error.message);
    }
    console.log(startDate, "       ", endDate);
  };

  useEffect(() => {
    const getStatus = async () => {
      const res = await fetch("http://localhost:5000/api/health");
      const resJson = await res.json();
      setStatus(resJson.status);
      setDb(resJson.db);
    };
  }, []);

  return (
    <>
      <input
        type="datetime-local"
        name="date"
        onChange={(event) => setStartDate(event.target.value)}
      />
      {/* {console.log(startDate.toISOString())} */}
      <input
        type="datetime-local"
        name="date"
        onChange={(event) => setEndDate(event.target.value)}
      />

      <button name="date" type="submit" onClick={handleSubmit}>
        Search
      </button>

      <div className="data">
        <table>
          <tr>
            <thead>
              <td></td>
            </thead>
          </tr>
        </table>
      </div>
    </>
  );
}

export default App;
