const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherQueries extends Sequelize.Model { }
ResearcherQueries.init({
  researcherId: Sequelize.INTEGER,
  query: { type: 'JSONB' }
}, { sequelize: sequelizeInstance, modelName: 'researcher_queries', timestamps: true })
// TODO: Add unique constraint to all 4 columns together

ResearcherQueries.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table

module.exports = ResearcherQueries
