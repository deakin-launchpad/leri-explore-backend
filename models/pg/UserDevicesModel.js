/**
 * 
 * Description: Model to store user ids along with device ids and the time device is worn by the user
 * Author: Somanshu Kalra
 * Date: 28th November 2019
 * 
 */

//Imports
const Sequelize = require('sequelize');
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection();


//Class definition
class UserDevices extends Sequelize.Model { }

//Initialize model
UserDevices.init({
    //Defining user_id attribute (required and not null)  
    participantId: {type: Sequelize.INTEGER, required: true, allowNull: false, references:{
      model: 'participants',
      key: 'id'
    }
},
    
    //Defining device_id attribute (required and not null)
    deviceId: {type: Sequelize.INTEGER, required: true, allowNull: false, references:{
      model: 'devices',
      key: 'id'
    }
  },

    //Defining from_time attribute. Stores time from when the device is used by user (required and not null)
    from_time: {type: 'TIMESTAMP', required: true, allowNull: false},

    //Defining to_time attribute. Stores time till when the user uses the device (not required and can be null)
    to_time: {type: 'TIMESTAMP', required: false, allowNull: true}
},{ sequelize: sequelizeInstance, modelName: 'user_devices' });



module.exports = UserDevices;
