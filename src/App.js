import React, { useEffect, useState, useMemo } from "react";
import PouchDB from "pouchdb";
const uuid = require("uuid");

function App() {
  const db = useMemo(() => {
    return new PouchDB("mydb");
  }, []);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await db.allDocs({ include_docs: true });
        setData(result.rows.map((row) => row.doc));
      } catch (err) {
        console.log(err);
      }
    };

    fetchDocuments();

    const changes = db.changes({
      live: true,
      since: "now",
      include_docs: true,
    });
    changes.on("change", (change) => {
      setData((prevDocs) => [...prevDocs, change.doc]);
    });
    return () => changes.cancel();
  }, [db]);

  const handleSubmit = () => {
    db.put({
      _id: uuid.v4(),
      title: "My Document",
      content: "This is my document.",
    })
      .then(function (response) {
        alert("Document added successfully");
      })
      .catch(function (err) {
        alert(err);
      });
  };

  const handleDelete = (item) => {
    db.remove(item._id, item._rev)
      .then(() => {
        setData(data.filter((item) => item._id !== item._id));
      })
      .catch((error) => {
        alert("Error deleting document", error);
      });
  };

  return (
    <ul>
      <button onClick={handleSubmit}>Add a new Data</button>
      {data.map((item) => (
        <div key={item._id} className="row">
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <button onClick={() => handleDelete(item)}>Delete</button>
        </div>
      ))}
    </ul>
  );
}

export default App;
