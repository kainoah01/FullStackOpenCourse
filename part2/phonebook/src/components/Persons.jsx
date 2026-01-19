const Persons = ({ persons, filterValue, deleteUser }) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filterValue.toLowerCase())
        )
        .map((person, index) => (
          <p key={index}>
            {person.name} {person.number}{" "}
            <button onClick={() => deleteUser(person.id)}>delete</button>
          </p>
        ))}
    </>
  );
};

export default Persons;
