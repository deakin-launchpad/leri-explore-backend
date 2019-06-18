const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherQueries extends Sequelize.Model { }
ResearcherQueries.init({
  researcherId: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'researchers',

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  query: { type: 'JSONB' }
}, { sequelize: sequelizeInstance, modelName: 'researcher_queries', timestamps: true })

ResearcherQueries.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table

module.exports = ResearcherQueries