import { Box } from "@chakra-ui/react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";
import Confirm from "./Confirm";
import Ready from "./Ready";
import Transfer from "./Transfer";
import { Stepper } from 'react-form-stepper'
import { useState } from "react";

export interface IReceipt {
  address: string,
  amount: string
}

export default function MultiTransfer () {
  const [activeIndex, setActiveIndex] = useState(0)
  const [formatedReceipts, setFormatedReceipts] = useState<Array<IReceipt>>([])

  const goNext = (index: number, receipts: Array<IReceipt>) => {
    setActiveIndex(index)
    console.log(receipts)
    setFormatedReceipts(receipts)
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
        activeIndex === 1 && <Confirm receipts={formatedReceipts} />
      }
      {
        activeIndex === 2 && <Transfer />
      }
    </Box>
  )
}
