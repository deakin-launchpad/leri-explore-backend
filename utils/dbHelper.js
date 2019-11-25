const debug = require('debug')('app:dbHelper')
const MONGO = 'MONGO', PG = 'PG'

// Static connection objects.
var DB_OBJECTS = {}

module.exports = class DBHelper {
  constructor(db) {
    this.db = db
    this.DB_OBJECT = null
  }

  connectMongoose(callback) {
    const mongoose = require('mongoose')
    mongoose.connect(this.getConnector(), { useNewUrlParser: true }, (err) => {
      if (err) {
        console.log("\n\nDB Error: ", err)
        return process.exit(1)
      }
      debug('MongoDB connected, database:', this.db.database)
      DB_OBJECTS[MONGO] = mongoose
      callback()
    })
  }

  dropMongooseDatabase(callback) {
    DB_OBJECTS[MONGO].connection.db.dropDatabase((err) => {
      if (err) return callback(err)
      callback()
    })
  }

  connectPostgres(callback) {
    const Sequelize = require('sequelize')
    DB_OBJECTS[PG] = new Sequelize(this.getConnector(), {
      pool: {
        max: parseInt(process.env.MAX_POOL_SIZE),
        min: 0 || parseInt(process.env.MIN_POOL_SIZE),
        acquire: 30000 || process.env.PG_CONN_ACQUIRE,
        idle: 10000 || process.env.PG_CONN_IDLE
      },
      logging: false
    })
    callback()
  }

  dropPostgres(callback) {
    // TODO: Implement for pg
  }

  getConnector() {
    var connector = null
    switch (this.db.adapter) {
      case 'mongodb':
        connector = 'mongodb://'
        break
      case 'postgres':
        connector = 'postgres://'
        if (!(this.db.username && this.db.username !== '' && this.db.password && this.db.password !== ''))
          return connector += `${this.db.host}:${this.db.port}/${this.db.database}`
        break
    }
    connector += `${this.db.username}:${this.db.password}@${this.db.host}:${this.db.port}/${this.db.database}`
    return connector
  }

  isConnected() {
    switch (this.db.adapter) {
      case 'mongodb':
        let DB_OBJECT = DB_OBJECTS[MONGO]
        return (DB_OBJECT && DB_OBJECT.connection && DB_OBJECT.connection.readyState && DB_OBJECT.connection.readyState === 1)
      // TODO: Implement for pg
    }
  }

  establishConnection(callback) {
    switch (this.db.adapter) {
      case 'mongodb':
        this.connectMongoose(callback)
        break
      case 'postgres':
        this.connectPostgres(callback)
        break
    }
  }

  destroyConnection() {

  }

  static getMongoConnection() {
    return DB_OBJECTS[MONGO]
  }

  static getPGConnection() {
    return DB_OBJECTS[PG]
  }

  dropDatabase(callback) {
    switch (this.db.adapter) {
      case 'mongodb':
        this.dropMongooseDatabase(callback)
        break
      case 'postgres':
        this.dropPostgres(callback)
        break
    }
  }

}
