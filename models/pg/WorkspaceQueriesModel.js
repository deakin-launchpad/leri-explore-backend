const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class WorkspaceQueries extends Sequelize.Model { }
WorkspaceQueries.init({
  workspace_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'workspaces',

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  q_type: { type: Sequelize.STRING, required: true, allowNull: false },
  name: { type: Sequelize.STRING, required: true, allowNull: false },
  query: { type: 'JSONB', required: true, allowNull: false }
}, { sequelize: sequelizeInstance, modelName: 'workspace_query', timestamps: true })

module.exports = WorkspaceQueries
