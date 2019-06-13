/*
Created by Sanchit Dang
*/

var Service = require('../services');
var UniversalFunctions = require('../utils/UniversalFunctions');
var async = require('async');
var TokenManager = require('../lib/TokenManager');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var CONFIG = require('../config')

const researcherRegister = (payload, callback) => {
  let accessToken = null;
  let dataToSave = payload;
  let userFound;
  if (dataToSave.password)
    dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
  async.series([
    (cb) => {
      query = { emailId: payload.emailId }
      Service.ResearcherService.getRecord(query, {}, {}, (error, data) => {
        if (error)
          cb(error);
        else
          if (data && data.length > 0) cb(ERROR.USER_ALREADY_REGISTERED);
          else cb(null);
      })
    },
    (cb) => {
      Service.ResearcherService.createRecord(dataToSave, (error, DataFromDB) => {
        if (error) cb(error);
        else {
          userFound = DataFromDB;
          cb();
        }
      })
    }, (cb) => {
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
    (cb) => {
      let criteria = {
        _id: userFound._id
      };
      Service.ResearcherService.getRecord(criteria, {}, {}, (error, data) => {
        if (data && data[0]) {
          userFound = data[0];
          cb();
        } else cb(error)
      });
    }
  ], (error, data) => {
    if (error) return callback(error);
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
    (cb) => {
      query = { emailId: payload.emailId };
      Service.ResearcherService.getRecord(query, {}, {}, (error, result) => {
        if (error) cb(error)
        else {
          userFound = result && result[0] || null;
          cb();
        }
      })
    }, (cb) => {
      if (!userFound) cb(ERROR.USER_NOT_FOUND);
      else {
        if (userFound && userFound.password !== UniversalFunctions.CryptData(payload.password)) cb(ERROR.INCORRECT_PASSWORD);
        else {
          successLogin = true;
          cb();
        }
      }
    }, (cb) => {
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
    }, (cb) => {
      let criteria = { _id: userFound._id };
      Service.ResearcherService.getRecord(criteria, {}, {}, (error, data) => {
        if (data && data[0]) {
          userFound = data[0];
          cb();
        } else cb(error);
      })
    }
  ], (error, result) => {
    if (error) return callback(error)
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

