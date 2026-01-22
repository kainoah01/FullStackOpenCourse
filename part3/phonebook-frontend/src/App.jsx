import { useState, useEffect } from "react";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import personService from "./services/persons.js";
import Notification from "./components/Notification.jsx";
import ErrorNotification from "./components/ErrorNotification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handlePersonsChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    // check for duplicate names
    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameExists) {
      const confirmed = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (!confirmed) {
        setNewName("");
        setNewNumber("");
        return;
      }

      // Update existing person with id
      const personCopy = persons.find((person) => person.name === newName);
      const newPersonObject = { ...personCopy, number: newNumber };
      personService
        .modifyUser(personCopy.id, newPersonObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== personCopy.id ? person : returnedPerson,
            ),
          );

          // Clear input fields
          setNewName("");
          setNewNumber("");

          // Show notification
          setNotification(`Updated ${newName}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorNotification(error.response.data.error);
          setTimeout(() => {
            setErrorNotification(null);
          }, 5000);
        });

      return;
    }

    const personObject = { name: newName, number: newNumber };

    // Add new person to the server db
    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));

        // Show notification
        setNotification(`Added ${newName}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch((error) => {
        setErrorNotification(error.response.data.error);
        setTimeout(() => {
          setErrorNotification(null);
        }, 5000);
      });
  };

  const deleteUser = (id) => {
    console.log("delete user with id", id);

    const user = persons.find((p) => p.id === id);
    const confirmed = confirm(`Delete ${user.name}?`);
    if (!confirmed) return;

    // Delete user from server db
    personService.deleteUser(id).then(() => {
      setNotification(`Deleted ${user.name}`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    // Remove user from persons state
    setPersons(persons.filter((p) => p.id !== id));
  };

  return (
    <div>
      <Notification message={notification} />
      <ErrorNotification message={errorNotification} />
      <h2>Phonebook</h2>
      <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
      <h3>add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handlePersonsChange={handlePersonsChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filterValue={filterValue}
        deleteUser={deleteUser}
      />
    </div>
  );
};

export default App;
