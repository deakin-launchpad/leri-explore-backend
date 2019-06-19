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
