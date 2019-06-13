const MongoDBGenericService = require('./MongoDBGenericService')

module.exports = {
  ResearcherService: new MongoDBGenericService("Researcher")
}
