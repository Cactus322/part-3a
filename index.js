const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();

app.use(express.json())

morgan.token('person', function getPerson (req) {
    return req.person
})

app.use(cors())
app.use(assignPerson)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const randomId = () => {
    return Math.floor(Math.random() * 10000)
} 

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const personsCount = persons.length;
    const currentDate = new Date;
    const info = `Phonebook has info for ${personsCount} people`;
  

    response.send(`
        <p>${info}</p>
        <p>${currentDate}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id)

    response.json(persons)
})



app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: randomId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(persons);
})

function assignPerson (req,res, next) {
    req.person = JSON.stringify(req.body);

    next()
}

app.get('/', (request, response) => {
    response.send(`
        <h1>Hello world</h1>
    `)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
