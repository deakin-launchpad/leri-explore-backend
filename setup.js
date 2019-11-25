require('dotenv').config()
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const MongoClient = require("mongoose").mongo.MongoClient
const { Client } = require('pg')
const async = require('async')

const mongoConfig = require('./config/database')('MONGO', process.env.NODE_ENV)
const pgConfig = require('./config/database')('PG', process.env.NODE_ENV)


if (!(mongoConfig.database || mongoConfig.username || mongoConfig.password || mongoConfig.host || mongoConfig.port)) {
  console.error('Error: .env file does not exist or MongoDB connection parameters are not configured properly! Make sure they are.')
  console.error("(MacOS/Linux) Run `cp .env.example .env` to initialise the file if it hasn't been already.")
  process.exit(0)
}

if (!(pgConfig.database || pgConfig.username || pgConfig.password || pgConfig.host || pgConfig.port)) {
  console.error('Error: .env file does not exist or Postgres connection parameters are not configured properly! Make sure they are.')
  console.error("(MacOS/Linux) Run `cp .env.example .env` to initialise the file if it hasn't been already.")
  process.exit(0)
}

// const mongoURI = `mongodb://${mongoConfig.admin_username}:${mongoConfig.admin_password}@${mongoConfig.host}:${mongoConfig.port}/admin?authMechanism=DEFAULT&authSource=admin`
const mongoURI = `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`

console.log(mongoURI)

var mongoConn, pgConn

async.series([
  function (cb) {
    MongoClient.connect(mongoURI, (err, res) => {
      if (err) return cb(err)
      console.log('MongoDB connected.')
      mongoConn = res
      cb()
    })
  },
  function (cb) {
    // TODO: Create user with all required permissions for DB, including creating and dropping the database
    mongoConn.db(mongoConfig.database).command({ createUser: mongoConfig.username, pwd: mongoConfig.password, roles: ["readWrite"] }, (err) => {
      // We are not throwing error anymore because we still want the next thing to work. Error here could be that the DB user already exists.
      if (err) console.log(err)
      cb()
    })
  },
  async function () {
    pgConn = new Client({
      host: pgConfig.host,
      user: pgConfig.admin_username,
      password: pgConfig.admin_password,
      port: pgConfig.port,
    })

    console.log(pgConfig)
    await pgConn.connect()
    console.log('PG connected.')

    // const res = await pgConn.query(`SELECT now()`)
    const res = await pgConn.query(`SELECT now();`)
    await pgConn.query(`CREATE DATABASE ${pgConfig.database};`)
    await pgConn.query(`CREATE USER ${pgConfig.username} WITH ENCRYPTED PASSWORD '${pgConfig.password}';`)
    await pgConn.query(`GRANT ALL PRIVILEGES ON DATABASE ${pgConfig.database} TO ${pgConfig.username};`)

    console.log(res.rows[0])
    await pgConn.end()
  }
],
  function (err) {
    if (err) {
      console.error(err)
    }
    // console.log(`User ${mongoConfig.username} created for ${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}.`)
    // console.log("If you run setup script again without dropping the user, you will receive an error, saying that the user exists.")
    // console.log("If you run `show dbs` command in Mongo shell, the create database will not appear since it doesn't have any collections yet, even though the user has been added.")
    process.exit(0)
  }
)
