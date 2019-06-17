const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherModel extends Sequelize.Model { }
ResearcherModel.init({
  emailId: { type: Sequelize.STRING, unique: true, allowNull: false }
}, { sequelize: sequelizeInstance, modelName: 'researcher', timestamps: true })

ResearcherModel.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table

module.exports = ResearcherModel
