import { Box, Button, Input } from '@chakra-ui/react'
import { IReceipt } from './index'

interface IConfirmProps {
  receipts: Array<IReceipt>
  confirm: () => void
}

export default function Confirm (props: IConfirmProps) {
  const { receipts } = props
  return (
    <div>
      {
        receipts.map(receipt => {
          return (
            <Box display='flex' mb='20px'>
              <Input value={receipt.address} mr='20px' isDisabled />
              <Input value={receipt.amount} isDisabled />
            </Box>
          )
        })
      }
      <Button onClick={props.confirm}>确认转账</Button>
    </div>
  )
}
