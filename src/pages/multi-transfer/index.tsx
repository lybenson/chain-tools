import { AlertDialog, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useAccount, useSigner, useContract, useNetwork } from "wagmi";
import Confirm from "./Confirm";
import Ready from "./Ready";
import Feedback from "./Feedback";
import { Stepper } from 'react-form-stepper'
import { useRef, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { POLYGON_TESTNET_CONTRACT_ADDRESS, ETHER_TESTNET_CONTRACT_ADDRESS, POLYGON_CONTRACT_ADDRESS, ETHER_CONTRACT_ADDRESS } from '../../config'
import abi from '../../assets/abi/batchTransfer.json'
import tokenAbi from '../../assets/abi/token.json'
export interface IReceipt {
  address: string,
  amount: string
}

const CONTRACT_ADDRESS = POLYGON_CONTRACT_ADDRESS

export default function MultiTransfer () {
  const { data: signer } = useSigner()
  const { chain, chains } = useNetwork()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [txHash, setTxHash] = useState('')
  const [totalTransferAmount, setTotalTransferAmount] = useState('0')

  const [activeIndex, setActiveIndex] = useState(0)
  
  const [formatedReceipts, setFormatedReceipts] = useState<Array<IReceipt>>([])
  const [token, setToken] = useState('')

  const goNext = (index: number, receipts: Array<IReceipt>, token: string) => {
    setActiveIndex(index)
    setFormatedReceipts(receipts)
    if (token) setToken(token)
  }

  const confirmTransfer = async () => {
    onClose()
    console.log(chain);
    

    let CONTRACT_ADDRESS = ETHER_CONTRACT_ADDRESS
    if (chain?.id === 5) CONTRACT_ADDRESS = ETHER_TESTNET_CONTRACT_ADDRESS
    if (chain?.id === 1) CONTRACT_ADDRESS = ETHER_CONTRACT_ADDRESS
    if (chain?.id === 80001) CONTRACT_ADDRESS = POLYGON_TESTNET_CONTRACT_ADDRESS
    if (chain?.id === 137) CONTRACT_ADDRESS = POLYGON_CONTRACT_ADDRESS

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer!)

    let receives: Array<Array<string | BigNumber>> = []
    let totalAmount: BigNumber = BigNumber.from(0)

    const zeroAddress = '0x0000000000000000000000000000000000000000'
    // const gasLimit = await contract.estimateGas.distribute(receives, zeroAddress)

    let address = zeroAddress
    let tx = null

    try {
      if (token) {
        address = token
        const tokenContract = new ethers.Contract(token, tokenAbi, signer!)
        let decimals = await tokenContract.decimals()
        if (!decimals) decimals = 18

        receives = []
        totalAmount = BigNumber.from(0)
        formatedReceipts.forEach((item) => {
          receives.push([item.address.trim(), ethers.utils.parseUnits(item.amount, decimals)])
          totalAmount = totalAmount.add(ethers.utils.parseUnits(item.amount, decimals))
        })

        const approveTx = await tokenContract.approve(contract.address, totalAmount.toString())
        await approveTx.wait()
  
        tx = await contract.distribute(receives, address, {
          gasLimit: 1e6
        })
      } else {
        receives = []
        totalAmount = BigNumber.from(0)
        formatedReceipts.forEach((item) => {
          receives.push([item.address.trim(), ethers.utils.parseEther(item.amount)])
          totalAmount = totalAmount.add(ethers.utils.parseEther(item.amount))
        })
        tx = await contract.distribute(receives, address, {
          gasLimit: 1e7,
          value: totalAmount.toString() 
        })
      }
      await tx.wait()

      setTxHash(tx.hash)
  
      setActiveIndex(2)
    } catch (e) {
      console.log(e)
    }
  }

  const confirm = async () => {
    let totalAmount: BigNumber = BigNumber.from(0)

    formatedReceipts.forEach((item) => {
      totalAmount = totalAmount.add(ethers.utils.parseEther(item.amount))
    })
    setTotalTransferAmount(ethers.utils.formatEther(totalAmount.toString()))
    onOpen()
  }
  return (
    <Box pt='200px'>
      <Stepper
        steps={[{ label: '准备' }, { label: '确认' }, { label: '发送' }]}
        activeStep={activeIndex}
      />
      {
        activeIndex === 0 && <Ready goNext={goNext}/>
      }
      {
        activeIndex === 1 && <Confirm receipts={formatedReceipts} confirm={confirm}/>
      }
      {
        activeIndex === 2 && <Feedback txHash={txHash} />
      }

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>提醒</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              是否确认在 {chain!.name} 转账{totalTransferAmount}？
            </div>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>取消</Button>
            <Button colorScheme='blue' ml={3} onClick={confirmTransfer}>
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  )
}
