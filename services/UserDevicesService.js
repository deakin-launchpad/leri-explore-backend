/**
 * 
 * Description: Service for interacting with user devices model and service. Enables researcher to fetch, update and delete user device history.
 * Author: Somanshu Kalra
 * Date: 29th November 2019
 * 
 */

'use strict';

//Imports
const userDevicesModel = require('../models/pg/UserDevicesModel');
const participantsModel = require('../models/pg/ParticipantsModel');
const devicesModel = require('../models/pg/DevicesModel');

/**
 * 
 * Function to fetch user details from DB
 * Author: Somanshu Kalra
 * @param device_Id 
 * @param callback
 *  
 */
const getDevices = (device_Id, callback) => {
    //Model returns promise so calling callback either with results or to throw an error
    userDevicesModel.findAll({
        where: {
            deviceId: device_Id
        }, 
        include: [{
          model: participantsModel,
          as: 'participant_details',
          required: true
        }]
    })
    .then(data => {
        callback(null,data);
    })
    .catch(err => {
        callback(JSON.stringify(err));
    });

};

/**
 * 
 * Method to fetch all device details from the database.
 * Author: Somanshu Kalra
 * @param callback
 *  
 */
const getAllDevices = (callback) => {
  //Model returns promise so calling callback either with results or to throw an error
  devicesModel.findAll({
    attributes: ['id', 'device_id']
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
    getDevices: getDevices,
    getAllDevices: getAllDevices
};
