import { Box, Input } from '@chakra-ui/react'
import { IReceipt } from './index'

interface IConfirmProps {
  receipts: Array<IReceipt>
}

export default function Confirm (props: IConfirmProps) {
  const { receipts } = props
  return (
    <div>
      {
        receipts.map(receipt => {
          return (
            <Box display='flex' mb='20px'>
              <Input value={receipt.address} mr='20px' />
              <Input value={receipt.amount} />
            </Box>
          )
        })
      }
    </div>
  )
}
