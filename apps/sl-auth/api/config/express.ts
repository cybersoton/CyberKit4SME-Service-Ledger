import express from 'express'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import { RoutesConfig } from './routes'

import { V1 } from '../routes'

const expressApp: express.Application = express()

const v1Routes: Array<RoutesConfig> = []

// here we are adding middleware to parse all incoming requests as JSON
expressApp.use(express.json())

// here we are adding middleware to allow cross-origin requests
expressApp.use(cors())

expressApp.use(express.static('public'))

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
expressApp.use(expressWinston.logger(loggerOptions))

// after sending the Express.js application object to have the routes added to our app!
v1Routes.push(
  new V1.SignupRoutes.AdminRoute(expressApp),
  new V1.SignupRoutes.UserRoute(expressApp),
  new V1.LoginRoute(expressApp),
  new V1.AdminOpsRoutes(expressApp)
)

expressApp.use((_: express.Request, res: express.Response) => {
  res.status(400).send({ error: 'Internal server error' })
})

export { expressApp, v1Routes }
