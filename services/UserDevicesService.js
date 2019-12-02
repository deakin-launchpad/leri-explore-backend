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

//Function to fetch user details from DB
const getDevices = (deviceId, callback) => {
    //Model returns promise so calling callback either with results or to throw an error
    userDevicesModel.findAll({
        where: {
            device_id: deviceId
        }
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
    getDevices: getDevices
};
