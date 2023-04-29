import React, { useEffect, useState, useMemo } from "react";
import PouchDB from "pouchdb";

const PeopleList = () => {
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

  const handleDelete = (item) => {
    db.remove(item._id, item._rev)
      .then(() => {
        setData(data.filter((i) => i._id !== item._id));
      })
      .catch((error) => {
        alert("Error deleting document", error);
      });
  };

  const sum = data.reduce((acc, curr) => acc + parseInt(curr.amount), 0);

  return (
    <div className="people">
      <div className="peopleList">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`row ${item._deleted ? "deleted" : ""} ${
              index === data.length - 1 ? "last-item" : ""
            }`}
          >
            <h3>{item.name}</h3>
            <p>{item.amount}</p>
            <button onClick={() => handleDelete(item)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="row">
        <h3>Total:</h3>
        <p className="sum">{sum}</p>
      </div>
    </div>
  );
};

export default PeopleList;
