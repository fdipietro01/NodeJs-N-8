const {Schema, model} = require("mongoose")

const userCollection = 'Usuarios'
const userSchema =Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    }
})

module.exports = model(userCollection, userSchema)