const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class GenericLookups extends Sequelize.Model { }
GenericLookups.init({
  map_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'mappings',

      // This is the column name of the referenced model
      key: 'id'
    }
  },
  entity_id: { type: Sequelize.INTEGER, required: true, allowNull: false },
  lookup_name: { type: Sequelize.STRING, required: true, allowNull: false },
  // criteria_type: { type: Sequelize.STRING, required: true, allowNull: false }, // Probably needed
  criteria: { type: 'JSONB', required: true, allowNull: false },
}, { sequelize: sequelizeInstance, modelName: 'generic_lookup', timestamps: true })


module.exports = GenericLookups

/**
 * Example:
  {
    "entity_id": 1,
    "lookup_name": "age", // age or school_id
    "criteria": {
      "range_name": "",
      "from": "",
      "to": ""
    }
  }
 */
