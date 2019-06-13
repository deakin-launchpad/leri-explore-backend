const GenericDBService = require('./genricDBService')
const ResearcherService = new GenericDBService("ResearcherDetail")

module.exports = {
  ResearcherService: ResearcherService
}
