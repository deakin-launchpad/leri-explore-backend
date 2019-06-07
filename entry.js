'use strict'
// Read .env file.
require('dotenv').config()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
// require(`./src/config/environments/${process.env.NODE_ENV}`)

const db = require('./config/database')(process.env.NODE_ENV)
const dbConnection = new (require('./utils/dbHelper'))(db)

/**
 * This is required in all environments since this is what mongoose uses to establish connection to a MongoDB instance.
 */
dbConnection.establishConnection((err) => {
  if (err) throw err
  require('./server')
})
