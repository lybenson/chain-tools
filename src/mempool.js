// watch pending transaction
import { ethers } from "ethers";

const url = 'wss://mainnet.infura.io/ws/v3/390b9494e39f45178910876a08bc5c3e'

const wsProvider = new ethers.providers.WebSocketProvider(url)

wsProvider.on('pending', async tx => {
  const transaction = await wsProvider.getTransaction(tx)
  console.log(transaction.hash)
})

