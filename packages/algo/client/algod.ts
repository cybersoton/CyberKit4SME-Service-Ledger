import algosdk from 'algosdk'

const SL_ASSET_PARAMETERS = {
  decimals: 0,
  total: 1,
  defaultFrozen: false,
  unitName: 'SLIX',
  assetName: 'SL Intelligence Xpression',
}

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN || '',
  process.env.ALGOD_SERVER || '',
  process.env.ALGOD_PORT || 0
)

async function getTransactionParameters() {
  try {
    const params = await algodClient.getTransactionParams().do()
    params.fee = 1000
    params.flatFee = true
    return Promise.resolve(params)
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function createAssetTxnWithIpfsParams(
  publicAddress: string,
  assetCID: string
) {
  return algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    suggestedParams: await getTransactionParameters(),
    ...SL_ASSET_PARAMETERS,
    from: publicAddress,
    assetURL: `ipfs://${assetCID}/metadata.json#arc3`,
  })
}

export async function signAndWaitForConfirmation(
  txn: algosdk.Transaction,
  privateKey: Uint8Array
) {
  const rawSignedTxn = txn.signTxn(privateKey)
  const tx = await algodClient.sendRawTransaction(rawSignedTxn).do()

  // wait for transaction to be confirmed
  const ptx = await algosdk.waitForConfirmation(algodClient, tx.txId, 4)
  // Get the new asset's information from the creator account

  console.log(
    'Transaction ' + tx.txId + ' confirmed in round ' + ptx['confirmed-round']
  )
  return { assetId: ptx['asset-index'], txId: tx.txId }
}

export async function searchPublicAddressForAsset(
  publicAddress: string,
  assetId: number
) {
  // note: if you have an indexer instance available it is easier to just search accounts for an asset
  const accountInfo = await algodClient.accountInformation(publicAddress).do()
  for (const element of accountInfo['created-assets']) {
    const scrutinizedAsset = element
    if (scrutinizedAsset['index'] == assetId) {
      return Promise.resolve(scrutinizedAsset['params'])
    }
  }

  return Promise.reject('No Matching Asset Found')
}
