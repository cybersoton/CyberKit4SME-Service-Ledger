import debug from 'debug'
import { Buffer } from 'node:buffer'
import { expose } from 'threads/worker'
import stixObjectService from '../../services/stix_object.service'
import { TransactionPackage } from '../../types'
import { STIXObjectPackage } from 'ipfs/types'
import { StatusDetail } from 'prisma-sl'
import { algodClient, Utils } from 'algo'
import { addFilesWithDirectory } from 'ipfs/client/ipfs'

const log: debug.IDebugger = debug('sl-taxii:status.thread')

const status = {
  async run(transactionPackage: TransactionPackage) {
    try {
      const metadataARC0003Buffer = Utils.createARC0003MetadataBufferFromJSON(
        transactionPackage.data,
        transactionPackage.version
      )

      const stixObjectPackage: STIXObjectPackage = {
        metadata: {
          path: 'metadata.json',
          content: metadataARC0003Buffer,
        },
        object: {
          path: 'object.json',
          content: Buffer.from(JSON.stringify(transactionPackage.data)),
        },
      }

      const directoryCID = await addFilesWithDirectory(stixObjectPackage)

      const txn = await algodClient.createAssetTxnWithIpfsParams(
        transactionPackage.public_address,
        directoryCID.toString()
      )

      const response = await algodClient.signAndWaitForConfirmation(
        txn,
        transactionPackage.privateKey
      )
      
      log(transactionPackage.data)

      const stixObjectDto = {
        identifier: transactionPackage.identifier,
        assetId: response.assetId,
        public_address: transactionPackage.public_address,
        spec_version:
          transactionPackage.data['spec_version' as keyof object] || '2,1',
        type: transactionPackage.type,
        version: transactionPackage.version,
        collectionId: transactionPackage.collectionId,
      }

      const stix_object = stixObjectService.create(stixObjectDto)

      await StatusDetail.update({
        data: {
          statusDetailStatus: 'success',
          message: `[Algorand blockchain] Transaction ID of the NFT representing the STIX object stored on IPFS: ${response.txId}`,
        },
        where: {
          id: transactionPackage.id,
        },
      })
      
      return stix_object
      
    } catch (e) {
      log(e)

      await StatusDetail.update({
        data: {
          statusDetailStatus: 'failure',
          message: (e as Error).message,
        },
        where: {
          id: transactionPackage.id,
        },
      })
      
      return e
    }
  }
}

export type StatusJob = typeof status

expose(status)
