/**
 * 
 * Description: Model to map sensor fields with devices
 * Author: Somanshu Kalra
 * Date: 05th December 2019
 * 
 */

//Imports
const Sequelize = require('sequelize');
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection();


//Class definition
class SensorFieldMapping extends Sequelize.Model { }

//Initialize model
SensorFieldMapping.init({
    //Defining field names  
    fieldName: {type: Sequelize.STRING, required: true, allowNull: false},
    
    //Defining aliases for fields
    alias: {type: Sequelize.STRING, required: true, allowNull: false  },

},{ sequelize: sequelizeInstance, modelName: 'sensor_field_mapping' });

//Module Export
module.exports = SensorFieldMapping;
