const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class GenericLookups extends Sequelize.Model { }
GenericLookups.init({
  entity_id: { type: Sequelize.INTEGER, required: true, allowNull: false },
  lookup_name: { type: Sequelize.STRING, required: true, allowNull: false },
  criteria_type: { type: Sequelize.STRING, required: true, allowNull: false },
  data_type: { type: Sequelize.STRING, required: true, allowNull: false },
  criteria: { type: 'JSONB', required: true, allowNull: false },
}, { sequelize: sequelizeInstance, modelName: 'generic_lookup', timestamps: true })


module.exports = GenericLookups

/**
 * Example:
  {
    "lookup_name": "age", // age or school_id
    "criteria_type": "range",
    "data_type": "time",
    "criteria": {
      "range_name": "",
      "from": "",
      "to": ""
    }
  }
 */
