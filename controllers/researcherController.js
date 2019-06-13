/*
Created by Sanchit Dang
*/

const SERVICES = require('../services');
const UniversalFunctions = require('../utils/UniversalFunctions');
const async = require('async');
const TokenManager = require('../lib/TokenManager');
const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const CONFIG = require('../config')

const researcherRegister = (payload, callback) => {
  let accessToken = null;
  let dataToSave = payload;
  let userFound;
  if (dataToSave.password)
    dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
  async.series([
    function (cb) {
      query = { emailId: payload.emailId }
      SERVICES.ResearcherService.getRecord(query, {}, {}, (error, data) => {
        if (error)
          cb(error);
        else
          if (data && data.length > 0) cb(ERROR.USER_ALREADY_REGISTERED);
          else cb(null);
      })
    },
    function (cb) {
      SERVICES.ResearcherService.createRecord(dataToSave, (error, DataFromDB) => {
        if (error) cb(error);
        else {
          userFound = DataFromDB;
          cb();
        }
      })
    },
    function (cb) {
      if (userFound) {
        let tokenData = {
          id: userFound._id,
          type: CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.RESEARCHER
        };
        TokenManager.setToken(tokenData, (error, output) => {
          if (error) cb(error);
          else {
            accessToken = output && output.accessToken || null;
            cb();
          }
        })
      } else cb(ERROR.IMP_ERROR)
    },
    function (cb) {
      let criteria = {
        _id: userFound._id
      };
      SERVICES.ResearcherService.getRecord(criteria, {}, {}, (error, data) => {
        if (data && data[0]) {
          userFound = data[0];
          cb();
        } else cb(error)
      });
    }
  ],
    function (err) {
      if (err) return callback(err);
      else return callback(null, {
        accessToken: accessToken,
        ResearcherDetails: userFound
      });
    });
}


const researcherLogin = (payload, callback) => {
  let userFound;
  var accessToken = null;
  var successLogin = false;
  async.series([
    function (cb) {
      query = { emailId: payload.emailId };
      SERVICES.ResearcherService.getRecord(query, {}, {}, (error, result) => {
        if (error) cb(error)
        else {
          userFound = result && result[0] || null;
          cb();
        }
      })
    },
    function (cb) {
      if (!userFound) cb(ERROR.USER_NOT_FOUND);
      else {
        if (userFound && userFound.password !== UniversalFunctions.CryptData(payload.password)) cb(ERROR.INCORRECT_PASSWORD);
        else {
          successLogin = true;
          cb();
        }
      }
    },
    function (cb) {
      if (successLogin) {
        let tokenData = {
          id: userFound._id,
          type: CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.RESEARCHER
        };
        TokenManager.setToken(tokenData, (error, output) => {
          if (error) cb(error)
          else {
            accessToken = output && output.accessToken || null;
            cb();
          }
        })
      } else cb(ERROR.IMP_ERROR)
    },
    function (cb) {
      let criteria = { _id: userFound._id };
      SERVICES.ResearcherService.getRecord(criteria, {}, {}, (error, data) => {
        if (data && data[0]) {
          userFound = data[0];
          cb();
        } else cb(error);
      })
    }
  ],
    function (err) {
      if (err) return callback(err)
      else return callback(null, {
        accessToken: accessToken,
        ResearcherDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound)
      })
    })
}

module.exports = {
  researcherRegister: researcherRegister,
  researcherLogin: researcherLogin
}

