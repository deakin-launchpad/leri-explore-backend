/**
 * 
 * Description: Controller for interacting with filter routes and services . Fetches column names to used in the filter.
 * Author: Somanshu Kalra
 * Date: 05th December 2019
 * 
 */

'use strict';

//Imports
const filterDataService = require('../services/FilterDataService');
const async = require('async')

/**
 * Method to fetch results from UserDeviceService
 * Author: Somanshu Kalra
 */
const getAllColumns = (callback) => {
  async.series([
    (cb) => {
      filterDataService.getAllColumns((err, data) => {
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
  getAllColumns: getAllColumns
};
