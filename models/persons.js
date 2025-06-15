const mongoose = require("mongoose")
require('dotenv').config()


//const password = encodeURIComponent(process.env.MONGODB_PASSWORD)
const url = process.env.MONGODB_URI
//const url = `mongodb+srv://tom-favereau:${password}@cluster0.wzcazzk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters']
    },
    number: {
        type: String,
        required: [true, 'Number is required'],
        validate: {
            validator: function (value) {
                const pattern = /^\d{2,3}-\d+$/
                if (!pattern.test(value)) {
                    return false
                } else {
                    const digitsOnly = value.replace('-', '')
                    return digitsOnly.length >= 8
                }
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)


