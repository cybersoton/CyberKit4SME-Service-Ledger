import algosdk from 'algosdk'

export default function createAlgoAccount() {
  try {
    const account = algosdk.generateAccount()
    const account_address = account.addr
    const account_sk = account.sk
    const account_mnemonic = algosdk.secretKeyToMnemonic(account_sk)
    return { account_address, account_sk, account_mnemonic }
  } catch (err) {
    console.log('err', err)
  }
}
