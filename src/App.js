import React from "react";
import PeopleList from "./components/PeopleList";
import Form from "./components/Form";
import DebtorsList from "./components/DebtorsList";

function App() {

  return (
    <div className="home">
      <PeopleList />
      <DebtorsList />
      <Form />
    </div>
  );
}

export default App;
