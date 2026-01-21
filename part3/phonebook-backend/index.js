const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(cors());

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === id);

  // If id not found then return code 400
  if (person) {
    response.json(person);
  } else {
    response.status(400).end();
  }
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`,
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Both the name and number fields are required",
    });
  }
  if (phonebook.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const newPerson = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(newPerson);
  response.status(204);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
