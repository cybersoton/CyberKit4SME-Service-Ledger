import { PrismaClient, Prisma } from '@prisma/client'

//const prisma = new PrismaClient()
let prisma

declare global {
  var globalPrisma: PrismaClient
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.globalPrisma) {
    global.globalPrisma = new PrismaClient()
  }

  prisma = global.globalPrisma
}

const Discovery = prisma.discovery
const APIRoot = prisma.aPIRoot
const Status = prisma.status
const StatusDetail = prisma.statusDetail
const Collection = prisma.collection
const STIXObject = prisma.sTIXObject

export {
  Prisma,
  prisma,
  Discovery,
  APIRoot,
  Status,
  StatusDetail,
  Collection,
  STIXObject,
}
