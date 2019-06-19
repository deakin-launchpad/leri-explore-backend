const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class Workspaces extends Sequelize.Model { }
Workspaces.init({
  title: Sequelize.STRING
}, { sequelize: sequelizeInstance, modelName: 'workspace', timestamps: true, paranoid: true })

module.exports = Workspaces
