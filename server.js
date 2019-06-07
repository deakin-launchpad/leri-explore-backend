/**
 * Created by Navit
 */

'use strict'
// External Dependencies
var Hapi = require('hapi')

//Internal Dependencies

var PLUGINS = require('./plugins')
var ROUTES = require('./routes')
var Config = require('./config')
require('./models')

const init = async () => {

  //Create Server
  var server = new Hapi.Server({
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.HAPI_PORT,
    routes: { cors: true }
  })


  //Register All Plugins
  await server.register(PLUGINS, {}, (err) => {
    if (err) {
      server.log(['error'], 'Error while loading plugins : ' + err)
    }
    else {
      server.log(['info'], 'Plugins Loaded')
    }
  })

  //add views
  await server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views'
  })

  //Default Routes
  server.route(
    {
      method: 'GET',
      path: '/',
      handler: function (req, res) {
        return res.view('welcome')
      }
    }
  )

  server.route(ROUTES)

  server.events.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname + ' --> ' + request.response.statusCode)
    console.log('Request payload:', request.payload)
  })

  // Start Server
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {

  console.log(err)
  process.exit(1)
})

init()
