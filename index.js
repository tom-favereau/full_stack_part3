const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')


const app = express()
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())




app.get('/api/persons',
    (req, res) =>
        Person.find({}).then((persons) => res.json(persons))
    )

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).send({ error: 'person not found' })
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    // Vérifie les doublons côté base de données
    Person.findOne({ name: body.name })
        .then(existing => {
            if (existing) {
                return res.status(400).json({ error: 'name must be unique' })
            }

            const person = new Person({
                name: body.name,
                number: body.number,
            })

            return person.save().then(saved => res.status(201).json(saved))
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    const updatedPerson = {
        name,
        number,
    }

    Person.findByIdAndUpdate(
        req.params.id,
        updatedPerson,
        { new: true } // ← important pour valider
    )
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))