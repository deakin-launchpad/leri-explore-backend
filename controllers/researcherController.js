/*
Created by Sanchit Dang
*/

const SERVICES = require('../services')
const UniversalFunctions = require('../utils/UniversalFunctions')
const async = require('async')
const TokenManager = require('../lib/TokenManager')
const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
const CONFIG = require('../config')

const researcherRegister = (payload, callback) => {
  let accessToken = null
  let dataToSave = payload
  let userFound
  if (dataToSave.password)
    dataToSave.password = UniversalFunctions.CryptData(dataToSave.password)
  async.series([
    function (cb) {
      query = { emailId: payload.emailId }
      SERVICES.ResearcherService.getRecord(query, {}, {}, (error, data) => {
        if (error) return cb(error)
        if (data && data.length > 0) return cb(ERROR.USER_ALREADY_REGISTERED)

        cb()
      })
    },
    function (cb) {
      SERVICES.ResearcherService.createRecord(dataToSave, (error, DataFromDB) => {
        if (error) return cb(error)

        userFound = DataFromDB
        cb()
      })
    },
    function (cb) {
      if (!userFound) return cb(ERROR.IMP_ERROR)

      let tokenData = {
        id: userFound._id,
        type: CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.RESEARCHER
      }
      TokenManager.setToken(tokenData, (error, output) => {
        if (error) return cb(error)

        accessToken = output && output.accessToken || null
        cb()
      })
    },
    function (cb) {
      let criteria = {
        _id: userFound._id
      }
      SERVICES.ResearcherService.getRecord(criteria, {}, {}, (error, data) => {
        if (err) return cb(err)
        if (data || data.length === 0) return cb("USER NOT FOUND")

        userFound = data[0]
        cb()
      })
    }
  ],
    function (err) {
      if (err) return callback(err)

      callback(null, {
        accessToken: accessToken,
        ResearcherDetails: userFound
      })
    })
}


const researcherLogin = (payload, callback) => {
  let userFound
  var accessToken = null
  var successLogin = false
  async.series([
    function (cb) {
      query = { emailId: payload.emailId }
      SERVICES.ResearcherService.getRecord(query, {}, {}, (err, result) => {
        if (err) return cb(err)

        userFound = result && result[0] || null
        cb()
      })
    },
    function (cb) {
      if (!userFound) return cb(ERROR.USER_NOT_FOUND)
      if (userFound && userFound.password !== UniversalFunctions.CryptData(payload.password)) return cb(ERROR.INCORRECT_PASSWORD)

      successLogin = true
      cb()
    },
    function (cb) {
      if (!successLogin) return cb(ERROR.IMP_ERROR)

      let tokenData = {
        id: userFound._id,
        type: CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.RESEARCHER
      }
      TokenManager.setToken(tokenData, (err, output) => {
        if (err) return cb(err)

        accessToken = output && output.accessToken || null
        cb()
      })
    },
    function (cb) {
      let criteria = { _id: userFound._id }
      SERVICES.ResearcherService.getRecord(criteria, {}, {}, (err, data) => {
        if (err) return cb(err)
        if (data || data.length === 0) return cb("USER NOT FOUND")

        userFound = data[0]
        cb()
      })
    }
  ],
    function (err) {
      if (err) return callback(err)
      
      callback(null, {
        accessToken: accessToken,
        ResearcherDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound)
      })
    })
}

module.exports = {
  researcherRegister: researcherRegister,
  researcherLogin: researcherLogin
}

