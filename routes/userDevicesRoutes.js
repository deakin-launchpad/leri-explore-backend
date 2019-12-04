/**
 * 
 * Description: Route to access users associated with different device ids. Used to perform CRUD operation on user_devices table 
 * Author: Somanshu Kalra
 * Date: 29th November 2019
 * 
 */

'use strict';

const HELPER = require("../utils/helper");
const Joi = require("joi");
const Config = require("../config");
const UserDevicesController = require("../controllers").UserDevicesController;

/**
 * 
 * Method to fetch all users associated with a device
 * Author: Somanshu Kalra
 * 
 */
const fetchUserDevices = {
  method: "GET",
  path: "/api/user_devices/{device}",
  config: {
    description: "Fetch users by device id",
    auth: 'UserAuth',
    tags: ["api", "user_devices"],
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        UserDevicesController.getUserDevices(request.params, (err, data) => {
          //Call UserDevicesController to get list of users linked with a device
          //If received error, return error response 
          if (err) return reject(HELPER.sendError(err))
          //Else return success resolve 
          //TODO: Configure appropriate success message 
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          );
        });
      });

    },
    validate: {
      params: {
        device: Joi.string().required()
      },
      headers: HELPER.authorizationHeaderObj,
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

/**
 * 
 * Method to fetch all devices registered
 * Author: Somanshu Kalra
 * 
 */
const getAllDevices = {
  method: 'GET',
  path: '/api/user_devices/devices',
  config: {
    description: 'Fetch all devices',
    auth: 'UserAuth',
    tags: ['api', 'user_devices','devices'],
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        UserDevicesController.getAllDevices((err, data) => {
          //Call UserDevicesController to get list of all device
          //If received error, return error response 
          if (err) return reject(HELPER.sendError(err))
          //Else return success resolve 
          //TODO: Configure appropriate success message 
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          );
        });
      });

    },
    validate: {
      headers: HELPER.authorizationHeaderObj,
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

//Export functions
module.exports = [ fetchUserDevices, getAllDevices ]
    

