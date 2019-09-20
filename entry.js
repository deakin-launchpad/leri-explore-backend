'use strict'
// Read .env file.
require('dotenv').config()
// require('pretty-error').start()
const async = require('async')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dbHelper = require('./utils/dbHelper')
const PGConfig = require('./config/database')('PG', process.env.NODE_ENV)
const pgConnection = new (dbHelper)(PGConfig)

const MongoConfig = require('./config/database')('MONGO', process.env.NODE_ENV)
const mongoConnection = new (dbHelper)(MongoConfig)

/**
 * This is required in all environments since this is what mongoose uses to establish connection to the required DB instances.
 */

async.parallel([
  function (cb) {
    pgConnection.establishConnection((err) => {
      if (err) return cb(err)
      cb()
    })
  },
  function (cb) {
    mongoConnection.establishConnection((err) => {
      if (err) return cb(err)
      cb()
    })
  }
],
  function (err) {
    if (err) throw err
    require('./server')
  }
)
