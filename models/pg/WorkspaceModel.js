const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class Workspace extends Sequelize.Model { }
Workspace.init({
  title: Sequelize.STRING
}, { sequelize: sequelizeInstance, modelName: 'workspace', timestamps: true })

Workspace.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table

module.exports = Workspace
