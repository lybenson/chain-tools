import { AlertDialog, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useAccount, useSigner, useContract, useNetwork } from "wagmi";
import Confirm from "./Confirm";
import Ready from "./Ready";
import Feedback from "./Feedback";
import { Stepper } from 'react-form-stepper'
import { useRef, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { POLYGON_CONTRACT_ADDRESS } from '../../config'
import abi from '../../assets/abi/batchTransfer.json'
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

  const goNext = (index: number, receipts: Array<IReceipt>) => {
    setActiveIndex(index)
    console.log(receipts)
    setFormatedReceipts(receipts)
  }

  const confirmTransfer = async () => {
    onClose()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer!)

    const receives: Array<Array<string | BigNumber>> = []
    let totalAmount: BigNumber = BigNumber.from(0)

    formatedReceipts.forEach((item) => {
      receives.push([item.address, ethers.utils.parseEther(item.amount)])
      totalAmount = totalAmount.add(ethers.utils.parseEther(item.amount))
    })
    const zeroAddress = '0x0000000000000000000000000000000000000000'
    // const gasLimit = await contract.estimateGas.distribute(receives, zeroAddress)

    const tx = await contract.distribute(receives, zeroAddress, {
      gasLimit: 1e6,
      value: totalAmount.toString()
    })

    await tx.wait()

    setTxHash(tx.hash)

    setActiveIndex(2)
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
