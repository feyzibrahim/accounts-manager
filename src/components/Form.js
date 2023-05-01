import React, { useMemo, useState } from "react";
import PouchDB from "pouchdb";
const uuid = require("uuid");

function Form() {
  const db = useMemo(() => {
    return new PouchDB("mydb");
  }, []);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    db.put({
      _id: uuid.v4(),
      name: name,
      amount: amount,
    })
      .then(function (response) {
        console.log("Document added successfully");
        setName("");
        setAmount("");
      })
      .catch(function (err) {
        alert(err);
      });
  };

  return (
    <form className="form">
      <h2>Create a new member</h2>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Customer Name"
      />
      <label>Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
      />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
}

export default Form;
