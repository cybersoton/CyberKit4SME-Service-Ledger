import algosdk from 'algosdk'
import { AssetInfo, AssetMetadata } from '../types'

const indexerClient = new algosdk.Indexer(
  process.env.INDEXER_TOKEN || '',
  process.env.INDEXER_SERVER || '',
  process.env.INDEXER_PORT || 0
)

async function searchForAccountForAsset(
  address: string,
  assetId: number
): Promise<AssetInfo> {
  const response: Array<AssetMetadata> = (
    await indexerClient.lookupAccountAssets(address).do()
  ).assets

  const foundAssetId = response.find(asset => asset['asset-id'] === assetId)

  if (foundAssetId) {
    const assetInfos: Array<AssetInfo> = (
      await indexerClient.searchForAssets().index(foundAssetId['asset-id']).do()
    ).assets

    const assetInfo = assetInfos.find(
      assetInfoItem => assetInfoItem.index === assetId
    )

    if (assetInfo) return Promise.resolve(assetInfo)
  }
  return Promise.reject('No Asset')
}

export async function getAssetInfoParams(address: string, assetId: number) {
  const assetInfo = await searchForAccountForAsset(address, assetId)

  if (assetInfo) return Promise.resolve(assetInfo.params)

  return Promise.reject('No Asset')
}
