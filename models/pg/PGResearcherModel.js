const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherEmailLookupModel extends Sequelize.Model { }
ResearcherEmailLookupModel.init({
  emailId: { type: Sequelize.STRING, unique: true, allowNull: false }
}, { sequelize: sequelizeInstance, modelName: 'researcher_email_lookup', timestamps: true })

// ResearcherEmailLookupModel.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table

module.exports = ResearcherEmailLookupModel
