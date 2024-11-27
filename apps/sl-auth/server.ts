/**
 * Module dependencies.
 */
import debug from 'debug'
import * as http from 'http'
//import * as https from 'https'
//import * as fs from 'fs'
import * as express from './api/config/express'
import { RoutesConfig } from './api/config/routes'

const env: string = process.env.NODE_ENV || 'default'

const log: debug.IDebugger = debug('sl-auth:server')

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '6012')

/**
 * Retrieve SSL private key and certificate for the server.
 */
 
//const signkey = fs.readFileSync('ssl-certificate/sl-auth.key')
//const certificate = fs.readFileSync('ssl-certificate/sl-auth.crt')

//const credentials = {key: signkey, cert: certificate}

/**
 * Create HTTPS server.
 */

const server: http.Server = http.createServer(express.expressApp)
//const server: https.Server = https.createServer(credentials, express.expressApp)


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  express.v1Routes.forEach((route: RoutesConfig) => {
    log(`V1 Routes configured for ${route.getName()}`)
  })

  console.log(`Server running in ${env} mode -> http://localhost:${port}`)
})

server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const parsedPort = parseInt(val, 10)

  if (isNaN(parsedPort)) {
    // named pipe
    return val
  }

  if (parsedPort >= 0) {
    // port number
    return parsedPort
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  log(`Listening on ${bind}`)
}
