import { Client, Schema } from 'redis-om'
import { Session } from '../types'

const client = new Client()

async function connect() {
  if (!client.isOpen()) await client.open(process.env.REDIS_URL)
}

const sessionSchema = new Schema(
  Session,
  {
    name: { type: 'string' },
    organisation: { type: 'string' },
    role: { type: 'string' },
    groups: { type: 'string[]' },
    token: { type: 'string' },
  },
  { dataStructure: 'JSON' }
)

export async function createAndSaveSession({ name, organisation, role, groups, token }: Session) {
  await connect()

  const sessionRepository = client.fetchRepository(sessionSchema)

  const { entityId } = await sessionRepository.createAndSave({
    name: name,
    organisation: organisation,
    role: role,
    groups: groups,
    token: token,
  })
  await sessionRepository.expire(entityId, 60 * 60)
  return entityId
}

export async function fetchSession(entityId: string) {
  await connect()

  const sessionRepository = client.fetchRepository(sessionSchema)

  return sessionRepository.fetch(entityId)
}
