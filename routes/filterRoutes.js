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
const FilterDataController = require('../controllers/filterDataController');

/**
 * 
 * Method to fetch all users associated with a device
 * Author: Somanshu Kalra
 * 
 */
const getAllColumns = {
  method: "GET",
  path: "/api/ws/filters",
  config: {
    description: "Get column names for filters",
    auth: 'UserAuth',
    tags: ["api", "ws", "filters"],
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        FilterDataController.getAllColumns((err, data) => {
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
module.exports = [ getAllColumns ]
