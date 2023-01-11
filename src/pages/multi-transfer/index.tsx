import { Box } from "@chakra-ui/react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useAccount, useSigner, useContract } from "wagmi";
import Confirm from "./Confirm";
import Ready from "./Ready";
import Feedback from "./Feedback";
import { Stepper } from 'react-form-stepper'
import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { CONTRACT_ADDRESS } from '../../config'
import abi from '../../assets/abi/batchTransfer.json'
export interface IReceipt {
  address: string,
  amount: string
}

export default function MultiTransfer () {
  const { data: signer } = useSigner()
  const [txHash, setTxHash] = useState('')

  const [activeIndex, setActiveIndex] = useState(0)
  
  const [formatedReceipts, setFormatedReceipts] = useState<Array<IReceipt>>([])

  const goNext = (index: number, receipts: Array<IReceipt>) => {
    setActiveIndex(index)
    console.log(receipts)
    setFormatedReceipts(receipts)
  }

  const confirm = async () => {
    console.log('确认转账')
    console.log(CONTRACT_ADDRESS)
    console.log(abi);
    console.log(signer)
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer!)

    const receives: Array<Array<string | BigNumber>> = []
    let totalAmount: BigNumber = BigNumber.from(0)

    formatedReceipts.forEach((item) => {
      receives.push([item.address, ethers.utils.parseEther(item.amount)])
      totalAmount = totalAmount.add(ethers.utils.parseEther(item.amount))
    })
    console.log(totalAmount.toString());

    const tx = await contract.distribute(receives, '0x0000000000000000000000000000000000000000', {
      gasLimit: 150000,
      value: totalAmount.toString()
    })

    await tx.wait()

    setTxHash(tx.hash)

    setActiveIndex(2)
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
    </Box>
  )
}
