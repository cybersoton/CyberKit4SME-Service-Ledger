import algosdk from 'algosdk'

export default function importAlgoAccount(mn: string) {
  try {
    const account = algosdk.mnemonicToSecretKey(mn)
    const account_address = account.addr
    const account_sk = account.sk
    const account_mnemonic = undefined
    return { account_address, account_sk, account_mnemonic }
  } catch (err) {
    console.log('err', err)
  }
}
