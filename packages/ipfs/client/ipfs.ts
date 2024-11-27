import { create, CID } from 'ipfs-http-client'
import toBuffer from 'it-to-buffer'
import { concat } from 'uint8arrays/concat'

import all from 'it-all'

import debug from 'debug'
import { STIXObjectPackage } from '../types'

const log: debug.IDebugger = debug('sl-api:IPFS-service')

const ipfsClient = create({
  host: process.env.IPFS_SERVER,
  port: Number.parseInt(process.env.IPFS_PORT || '0'),
  protocol: process.env.IPFS_PROTOCOL,
})

export async function catStreamString(cid: string) {
  const bufferedContents = await toBuffer(ipfsClient.cat(cid))

  const enc = new TextDecoder('utf-8')

  return Promise.resolve(enc.decode(bufferedContents))
}

export async function catStreamJSON(cid: string) {
  console.log(cid)

  const data = await catStreamString(cid)

  return Promise.resolve(JSON.parse(data))
}

export async function addFile(file: Buffer) {
  return ipfsClient.add(file)
}

export async function addFilesWithDirectory(
  stixObjectPackage: STIXObjectPackage
) {
  const cidArray: Array<CID> = []

  const results = ipfsClient.addAll(
    [stixObjectPackage.metadata, stixObjectPackage.object],
    {
      wrapWithDirectory: true,
    }
  )

  for await (const iterator of results) {
    cidArray.push(iterator.cid)
  }

  return Promise.resolve(cidArray[cidArray.length - 1])
}

export async function readFile(cid: CID) {
  return Promise.resolve(concat(await all(ipfsClient.cat(cid))))
}
