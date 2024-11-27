import { Entity } from 'redis-om'

export interface Session {
  name: string
  organisation: string
  role: string
  groups: Array<string>
  token: string
}

export class Session extends Entity {}
