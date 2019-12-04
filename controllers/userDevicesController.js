/**
 * 
 * Description: Controller for interacting with user devices model and service. Enables researcher to fetch, update and delete user device history.
 * Author: Somanshu Kalra
 * Date: 29th November 2019
 * 
 */

'use strict';

//Imports
const userDeviceService = require('../services/UserDevicesService');
const async = require('async')

/**
 * Method to fetch results from UserDeviceService
 * Author: Somanshu Kalra
 */
const getUserDevices = (params, callback) => {
  const device_id = params.device;
  async.series([
    (cb) => {
      userDeviceService.getDevices(device_id, (err, data) => {
        if (err) cb(err);
        else {
          cb(null, data);
        }
      })
    }
  ], (err, result) => {
    if (err) callback(err)
    else callback(null, { result: result })
  });
};


/**
 * 
 * Method to fetch all devices
 * Author: Somanshu Kalra
 * 
 */
const getAllDevices = (callback) => {
  async.series([
    (cb) => {
      userDeviceService.getAllDevices((err, data) => {
        if (err) cb(err);
        else {
          cb(null, data);
        }
      })
    }
  ], (err, result) => {
    if (err) callback(err)
    else callback(null, { result: result })
  });
};

//Exports
module.exports = {
  getUserDevices: getUserDevices,
  getAllDevices: getAllDevices
};
