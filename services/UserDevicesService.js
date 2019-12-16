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

/**
 * Method to create user and device information in DB. Interacts with userDevices Model
 * @param payload 
 * @param callback 
 */
const createUserDevices = (payload, callback) => {
  // Adding user details with participantId, deviceId,from_time and to_time
  userDevicesModel.create({
    participantId: payload.participant_id,
    deviceId: payload.device_id,
    from_time: payload.from,
    to_time: payload.to
  }).then(data => {
      //If user is created successfully, return results
      return callback(null,data);
  }).catch(err => {
      //If error returned, display appropriate error message
      return callback(err);
  })
};

/**
 * Method to update user and device details in DB. Interacts with userDevices model. 
 * @param payload 
 * @param callback 
 */
const updateUserDevices = (request, callback) => {
  // Updating 
  userDevicesModel.update({
    participantId: request.payload.participant_id,
    deviceId: request.payload.device_id,
    from_time: request.payload.from,
    to_time: request.payload.to
  },{
    where: {
      id: request.params.id 
    }
  }
).then(data => {
    callback(null,data);
  }).catch(err => {
    callback(error);
  })
};

//Exports
module.exports = {
    getDevices: getDevices,
    getAllDevices: getAllDevices,
    createUserDevices: createUserDevices,
    updateUserDevices: updateUserDevices
};
