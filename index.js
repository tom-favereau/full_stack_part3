const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


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

app.get('/api/persons',
    (req, res) =>
        res.json(persons))

app.get(`/api/persons/:id`,
    (req, res) => {
        const id = req.params.id
        const person = persons.find(elem => elem.id.toString() === id)
        if (person){
            res.json(person)
        } else{
            res.status(404).send('person not found')
        }
    }
)


app.get('/info',
    (req, res) => {
        const count = persons.length;
        const date = new Date();
        res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
  `)
})

app.delete('/api/persons/:id',
    (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id.toString() !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }
    if (persons.find(elem => elem.name === body.name)){
        return res.status(400).json({error: { error: 'name must be unique' }})
    }
    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))