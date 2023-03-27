const bcrypt = require('bcrypt')

//función que crea hash para encriptar contraseña
const createHash = (password)=> bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//salt es un string aleatorio (dinámico, va cambiando) que se usa a modo de firma. Se le pasa el largo.

const isValidPassword = (userPassword, dbPassword) => bcrypt.compareSync(userPassword, dbPassword)
//devuelve true/false

module.exports = {createHash, isValidPassword}