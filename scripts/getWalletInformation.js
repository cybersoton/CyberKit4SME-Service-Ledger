const algosdk = require('algosdk')

const kmdtoken =
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const kmdaddress = 'http://localhost'
const kdmport = 4002
const kmdclient = new algosdk.Kmd(kmdtoken, kmdaddress, kdmport)

;(async () => {
  let walletid = null
  let wallets = (await kmdclient.listWallets()).wallets
  wallets.forEach(function (arrayItem) {
    if (arrayItem.name === 'unencrypted-default-wallet') {
      walletid = arrayItem.id
    }
  })
  let wallethandle = (await kmdclient.initWalletHandle(walletid, ''))
    .wallet_handle_token
  let accounts = await kmdclient.listKeys(wallethandle)

  for await (const address of accounts.addresses) {
    let accountKey = await kmdclient.exportKey(wallethandle, '', address)
    let mn = await algosdk.secretKeyToMnemonic(accountKey.private_key)
    console.log({
      publicAddress: address,
      privateKey: accountKey.private_key,
      mn: mn,
    })
  }
})().catch(e => {
  console.log(e.text)
})
