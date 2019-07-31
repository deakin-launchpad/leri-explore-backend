const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class Mappings extends Sequelize.Model { }
Mappings.init({
  map_name: { type: Sequelize.STRING, required: true, allowNull: false, unique: true },
  end_as: { type: Sequelize.STRING, required: true, allowNull: false },
  eval_expr: { type: Sequelize.STRING, required: true, allowNull: false },
  eval_expr_type: { type: Sequelize.STRING, required: true, allowNull: false }
}, { sequelize: sequelizeInstance, modelName: 'mapping', timestamps: true })


module.exports = Mappings
