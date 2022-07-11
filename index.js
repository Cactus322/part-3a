const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();
require('dotenv').config();
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(assignPerson)

morgan.token('person', function getPerson (req) {
    return req.person
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const personsCount = persons.length;
        const currentDate = new Date;
        const info = `Phonebook has info for ${personsCount} people`;
        
        response.send(`
            <p>${info}</p>
            <p>${currentDate}</p>
        `)
    });
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    console.log(body);

    const person = new Person ({
        name: body.name,
        number: body.number,
    });

    return person.save().then(savedPerson => {
        response.json(savedPerson);
    });
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.content,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person)
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    
    next(error)
}

app.use(errorHandler)

function assignPerson (req,res, next) {
    req.person = JSON.stringify(req.body);

    next()
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
