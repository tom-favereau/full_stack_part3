const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('  node mongo.js <password> <name> <number> → add contact')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://tom-favereau:${password}@cluster0.wzcazzk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

mongoose.set('strictQuery', false)
mongoose.connect(url).then( result => {
  console.log('connected')
  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({ name, number })

    person.save().then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      return mongoose.connection.close()
    })

  } else if (process.argv.length === 3) {
    Person.find({}).then((result) => {
      console.log('phonebook:')
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      return mongoose.connection.close()
    })

  } else {
    console.log('Invalid number of arguments.')
    return mongoose.connection.close()
  }
})




