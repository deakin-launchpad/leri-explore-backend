const GenericDBService = require('./MongoDBService')

module.exports = {
  ResearcherService: new GenericDBService("Researcher")
}
