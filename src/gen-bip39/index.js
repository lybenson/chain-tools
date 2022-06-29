import bip39 from 'bip39'
import HDWallet from 'ethereum-hdwallet'

// 生成助记词
const mnemonic = bip39.generateMnemonic()
// party region outside icon dice eager enter bid abstract strong palm always

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

  // address0: 0xccac30979f18cd48d23fe5e9619dd0445c164a6d
  // address1: 0x91db9ad42ae0d5401d9b7fa5db2f998db99d2aeb
  // address2: 0xbd6258397f41bf79e57fca61a7e2d31039e72daf
  // address3: 0xc1e073158f4e58a3918c52ebce43c2e12e8bb78f
  // address4: 0xfba1386c223a397fd15cd7c2211ea009452a18b7
  // address5: 0x08635e22da57156cc6268f0565b34dd011845b08
  // address6: 0x57cbbb1caac3690ff42b2310fcfde56ccfefe239
  // address7: 0x0627f4877ec777902dbf5153f3a4999df7b50e2b
  // address8: 0x83cb17e59c4a852a49e1e2da9290eec4864b8f30
  // address9: 0x71aa90584420b57034de963f41211b56331ba3ab
}

createAccount()
