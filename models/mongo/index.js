const Researcher = require('./ResearcherModel')
const HELPER = require('../../utils/helper')

async function seed() {
  if (process.env.NODE_ENV !== ('test' || 'dev' || 'development')) return
  await Researcher.deleteMany()

  await Researcher.create([{
    _id: "5d3920e3f973925b8a8869a1",
    first_name: "Akash",
    last_name: "Who",
    emailId: "akash@test.com",
    password: HELPER.CryptData("password"),
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMzkyMGUzZjk3MzkyNWI4YTg4NjlhMSIsInR5cGUiOiJSRVNFQVJDSEVSIiwiaWF0IjoxNTY0MDI1MjMwfQ.AyNkKsSShjooNYXCFI06R_OS0wwYBbUAugBc0NqjbQE"
  },
  {
    first_name: "Sanchit",
    last_name: "Who",
    emailId: "sanchit@test.com",
    password: HELPER.CryptData("password")
  }])
}

seed()


module.exports = {
  Researcher: Researcher
}
