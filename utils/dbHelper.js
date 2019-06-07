const debug = require('debug')('app:dbHelper')

var pgObj = null
module.exports = class DBHelper {
  constructor(db) {
    this.db = db
    this.DB_OBJECT = null
  }

  connectMongoose(callback) {
    const mongoose = require('mongoose')
    mongoose.connect(this.getConnector(), (err) => {
      if (err) {
        console.log("\n\nDB Error: ", err)
        return process.exit(1)
      }
      debug('MongoDB connected, database:', this.db.database)
      this.DB_OBJECT = mongoose
      callback()
    })
  }

  dropMongooseDatabase(callback) {
    this.DB_OBJECT.connection.db.dropDatabase((err) => {
      if (err) return callback(err)
      callback()
    })
  }

  connectPostgres(callback) {
    const Sequelize = require('sequelize')
    pgObj = new Sequelize(this.getConnector(), {
      pool: {
        max: parseInt(process.env.MAX_POOL_SIZE),
        min: 0 || parseInt(process.env.MIN_POOL_SIZE),
        acquire: 30000 || process.env.PG_CONN_ACQUIRE,
        idle: 10000 || process.env.PG_CONN_IDLE
      }
    })
    callback()
  }

  dropPostgres(callback) {

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
    const DB_OBJECT = this.DB_OBJECT
    switch (this.db.adapter) {
      case 'mongodb':
        // debug(DB_OBJECT)
        return (DB_OBJECT && DB_OBJECT.connection && DB_OBJECT.connection.readyState && DB_OBJECT.connection.readyState === 1)
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

  static getPGConnection() {
    return pgObj // TODO: Make this better
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
