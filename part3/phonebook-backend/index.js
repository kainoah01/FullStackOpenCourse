require("dotenv").config();

const express = require("express");
const Person = require("./models/person");

const morgan = require("morgan");
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  Person.find({}).then((phonebook) => {
    response.send(
      `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`,
    );
  });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   Person.findByIdAndRemove(id).then(() => {
//     response.status(204).end();
//   });
// });

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Both the name and number fields are required",
    });
  }
  //   if (phonebook.find((person) => person.name === body.name)) {
  //     return response.status(400).json({
  //       error: "Name must be unique",
  //     });
  //   }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
