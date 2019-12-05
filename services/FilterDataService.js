/**
 * 
 * Description: Service for interacting with sensorFielMapping model. Fetchesall column names to be used in the filter.
 * Author: Somanshu Kalra
 * Date: 05th December 2019
 * 
 */

'use strict';

//Imports
const sensorFieldMappingModel = require('../models/pg/SensorFieldMappingModel')

/**
 * 
 * Method to fetch all column names from the database.
 * Author: Somanshu Kalra
 * @param callback
 *  
 */
const getAllColumns = (callback) => {
  //Model returns promise so calling callback either with results or to throw an error
  sensorFieldMappingModel.findAll({
    attributes: ['fieldName', 'alias']
  })
  .then(data => {
      callback(null,data);
  })
  .catch(err => {
      callback(JSON.stringify(err));
  });

};

//Exports
module.exports = {
    getAllColumns: getAllColumns
};
