// const Sequelize = require('sequelize')
// const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

// class Workspaces extends Sequelize.Model { }
// Workspaces.init({
//   title: Sequelize.STRING
// }, { sequelize: sequelizeInstance, modelName: 'workspace', timestamps: true, paranoid: true })



// class ResearcherEmailLookups extends Sequelize.Model { }
// ResearcherEmailLookups.init({
//   emailId: { type: Sequelize.STRING, unique: true, allowNull: false }
// }, { sequelize: sequelizeInstance, modelName: 'researcher_email_lookup', timestamps: true })



// class UserSensors extends Sequelize.Model { }
// UserSensors.init({
//   user_id: Sequelize.STRING,
//   timestamp: { type: 'TIMESTAMP', defaultValue: Sequelize.NOW },
//   s1: Sequelize.INTEGER,
//   s2: Sequelize.INTEGER,
//   s3: Sequelize.INTEGER,
//   s4: Sequelize.INTEGER,
//   s5: Sequelize.INTEGER,
//   s6: Sequelize.INTEGER,
//   s7: Sequelize.INTEGER,
//   s8: Sequelize.INTEGER,
//   s9: Sequelize.INTEGER,
// }, { sequelize: sequelizeInstance, modelName: 'user_sensor', timestamps: true })


// class AgeActivityRangeLookups extends Sequelize.Model { }
// AgeActivityRangeLookups.init({
//   age: Sequelize.INTEGER,
//   activity_id: Sequelize.INTEGER,
//   min: Sequelize.INTEGER,
//   max: Sequelize.INTEGER
// }, { sequelize: sequelizeInstance, modelName: 'age_activity_range_lookup', timestamps: true })
// // TODO: Add unique constraint to all 4 columns together


// class ResearcherWorkspaces extends Sequelize.Model { }
// ResearcherWorkspaces.init({
//   workspace_id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,

//     references: {
//       // This is a reference to another model
//       model: 'workspaces',

//       // This is the column name of the referenced model
//       key: 'id'
//     }
//   },
//   researcher_id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,

//     references: {
//       // This is a reference to another model
//       model: 'researcher_email_lookups',

//       // This is the column name of the referenced model
//       key: 'id'
//     }
//   }
// }, { sequelize: sequelizeInstance, modelName: 'researcher_workspace', timestamps: true })




// class ResearcherWorkspaceQueries extends Sequelize.Model { }
// ResearcherWorkspaceQueries.init({
//   researcher_workspace_id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,

//     references: {
//       // This is a reference to another model
//       model: 'researcher_workspaces',

//       // This is the column name of the referenced model
//       key: 'id',
//     }
//   },
//   query: { type: 'JSONB' }
// }, { sequelize: sequelizeInstance, modelName: 'researcher_workspace_query', timestamps: true })

const Workspaces = require('./WorkspacesModel')
const ResearcherEmailLookups = require('./ResearcherEmailLookupsModel')
const ResearcherWorkspaces = require('./ResearcherWorkspacesModel')
const ResearcherWorkspaceQueries = require('./ResearcherQueriesModel')
const UserSensors = require('./UserSensorsModel')
const AgeActivityRangeLookups = require('./AgeActivityRangeLookupsModel')


Workspaces.sync({ force: true })
.then(() => {
  ResearcherEmailLookups.sync({ force: true })
  .then(() => {
    ResearcherWorkspaces.sync({ force: true })
    .then(() => {
      ResearcherWorkspaceQueries.sync({ force: true })
      .then(() => {
      
      })
    })
  })
})





UserSensors.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table
  .then(() => UserSensors.create({
    user_id: '12345',
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0,
    s6: 0,
    s7: 0,
    s8: 0,
    s9: 0
  }))


AgeActivityRangeLookups.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table
  .then(() => {

    let allObjs = []
    let keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = 0; i < 100; ++i) { // loop for ages

      let ageSD = 0
      if (i < 10) ageSD = 0
      else if (i < 20) ageSD = 20
      else if (i < 40) ageSD = 10
      else if (i < 50) ageSD = -10
      else if (i < 60) ageSD = -20

      else if (i > 79) ageSD = -50
      else if (i > 59) ageSD = -30

      keys.forEach((k, j) => {
        allObjs.push({
          age: i + 1,
          activityId: k,
          min: (j * 100 + ageSD) < 0 ? 0 : (j * 100 + ageSD),
          max: (j + 1) * 100 + ageSD
        })
      })
    }

    AgeActivityRangeLookups.bulkCreate(allObjs)

  })


module.exports = {
  Workspace: Workspaces,
  ResearcherEmailLookups: ResearcherEmailLookups,
  ResearcherWorkspace: ResearcherWorkspaces,
  ResearcherWorkspaceQueries: ResearcherWorkspaceQueries,
  UserSensors: UserSensors,
  AgeActivityRangeLookups: AgeActivityRangeLookups,
}
