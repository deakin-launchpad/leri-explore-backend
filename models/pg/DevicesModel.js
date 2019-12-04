/**
 * 
 * Description: Model to store device information using ids.
 * Author: Somanshu Kalra
 * Date: 03 December 2019
 * 
 */

//Imports
const Sequelize = require('sequelize');
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection();

//Class definition
class Devices extends Sequelize.Model { }

//Initialize model
Devices.init({
  //Defining device id as a string 
  device_id: {
    type: Sequelize.STRING, 
    required: true, 
    unique:true, 
    allowNull: false
  }
},{ sequelize: sequelizeInstance, modelName: 'devices' });

//Module export
module.exports = Devices;
