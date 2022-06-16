import bip39 from 'bip39'
import HDWallet from 'ethereum-hdwallet'

// 生成助记词
const mnemonic = bip39.generateMnemonic()

console.log(mnemonic);
const createAccount = async () => {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  console.log(seed.toString('hex'))

  const hdwallet = HDWallet.fromSeed(seed)

	for (let i = 0; i < 10; i++) {
    const key = hdwallet.derive(`m/44'/60'/0'/0/${i}`)
    key.getPrivateKey().toString('hex')
    key.getPublicKey().toString('hex')
    const address = key.getAddress().toString('hex')
    console.log(`address${i}: 0x${address}`)
  }
}

createAccount()
