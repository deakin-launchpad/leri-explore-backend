const moment = require('moment')

const Workspaces = require('./WorkspacesModel')
const ResearcherEmailLookups = require('./ResearcherEmailLookupsModel')
const ResearcherWorkspaces = require('./ResearcherWorkspacesModel')
const WorkspaceQueries = require('./WorkspaceQueriesModel')
const UserSensors = require('./UserSensorsModel')
const AgeActivityRangeLookups = require('./AgeActivityRangeLookupsModel')
const SchoolPeriodLookups = require('./SchoolPeriodLookupsModel')
const GenericLookups = require('./GenericLookupsModel')


async function seed() {
  if (process.env !== 'test' || 'dev' || 'development') return

  await Workspaces.sync({ force: true })
  await ResearcherEmailLookups.sync({ force: true })
  await ResearcherWorkspaces.sync({ force: true })
  await WorkspaceQueries.sync({ force: true })

  await ResearcherEmailLookups.create({ email_id: "akash@test.com" })
  await ResearcherEmailLookups.create({ email_id: "sanchit@test.com" })

  await Workspaces.create({ title: "Workspace 1 for user 1" })
  await Workspaces.create({ title: "Workspace 2 for user 1" })

  await Workspaces.create({ title: "Workspace 1 for user 2" })


  await ResearcherWorkspaces.create({ workspace_id: 1, researcher_id: 1 })
  await ResearcherWorkspaces.create({ workspace_id: 2, researcher_id: 1 })

  await ResearcherWorkspaces.create({ workspace_id: 3, researcher_id: 2 })

  UserSensors.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table
    .then(() => UserSensors.create({
      user_id: '12345',
      workspace_id: 1,
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

  SchoolPeriodLookups.sync({ force: true })
    .then(() => {
      let allObjs = [], i, j

      for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
          allObjs.push({
            school_id: i,
            period_name: `P${j + 1}`,
            period_start: moment().year(2000).dayOfYear(2).hour(-4).minute((j) * 50 + i % 5).toISOString(),
            period_end: moment().year(2000).dayOfYear(2).hour(-4).minute((j + 1) * 50 + i % 5).toISOString(),
          })
        }
      }

      SchoolPeriodLookups.bulkCreate(allObjs)
    })

  GenericLookups.sync({ force: true })
    .then(() => {
      let allObjs = [], i, j

      for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
          allObjs.push({
            entity_id: i,
            lookup_name: "school_id",
            criteria_type: "range",
            data_type: "time",
            criteria: JSON.stringify({
              range_name: `P${j + 1}`,
              from: moment().year(2000).dayOfYear(2).hour(-4).minute((j) * 50 + i % 5).toISOString(),
              to: moment().year(2000).dayOfYear(2).hour(-4).minute((j + 1) * 50 + i % 5).toISOString(),
            })
          })
        }
      }

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
            entity_id: i + 1,
            lookup_name: "age",
            criteria_type: "range",
            data_type: "int",
            criteria: JSON.stringify({
              range_name: k,
              min: (j * 100 + ageSD) < 0 ? 0 : (j * 100 + ageSD),
              max: (j + 1) * 100 + ageSD
            })
          })
        })
      }

      GenericLookups.bulkCreate(allObjs)
    })

}

seed()


module.exports = {
  Workspaces: Workspaces,
  ResearcherEmailLookups: ResearcherEmailLookups,
  ResearcherWorkspaces: ResearcherWorkspaces,
  WorkspaceQueries: WorkspaceQueries,
  UserSensors: UserSensors,
  AgeActivityRangeLookups: AgeActivityRangeLookups,
  SchoolPeriodLookups: SchoolPeriodLookups,
  GenericLookups: GenericLookups
}
