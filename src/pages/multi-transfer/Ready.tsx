import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from "@chakra-ui/react"
import { ChangeEvent, ChangeEventHandler, useState } from "react"
import { useAccount } from "wagmi"
import Papa from 'papaparse'
import { IReceipt } from './index'
import useMultiTransferStore from "../../store/multi-transfer"


interface IReadyProps {
  goNext: (index: number, receipts: Array<IReceipt>) => void
}

export default function Ready (props: IReadyProps) {
  const toast = useToast()
  const { address } = useAccount()
  const [formatedReceipts, setFormatedReceipts] = useState<Array<IReceipt>>([])
  const [ receipts, setReceipts ] = useState('')

  useMultiTransferStore(state => state.setReceipts)

  const parseComplete = (data: Array<Array<string>>) => {
    const formatResult = formatReceipts(data)
    setFormatedReceipts(formatResult)
    stringifyReceipt(formatResult)
  }

  const formatReceipts = (data: Array<Array<string>>): Array<IReceipt>  => {
    const result: Array<IReceipt> = []
    data.forEach(item => {
      result.push({
        address: item[0],
        amount: item[1]
      })
    })
    return result
  }
  const stringifyReceipt = (data: Array<IReceipt>) => {
    let res = ''
    data.forEach((item, index) => {
      if (index === data.length - 1) {
        res += `${item.address},${item.amount}`
      } else {
        res += `${item.address},${item.amount}\n`
      }
    })
    setReceipts(res)
  }

  const parse = (event: ChangeEvent<HTMLInputElement>) => {
    const files = (event.target! as HTMLInputElement).files || []
    let file
    if (files.length > 0) file = files[0]
    else return

    Papa.parse(file, {
      complete: (results: any) => parseComplete(results.data)
    })
  }

  const editReceipt = (event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event)
    const value = event.target.value

    const items = value.split('\n')

    let arr: Array<Array<string>> = []

    items.forEach(item  => {
      const splitArr = item.split(',')
      arr.push([splitArr[0], splitArr[1]])
    })

    console.log(arr)

    const formatResult = formatReceipts(arr)
    setFormatedReceipts(formatResult)
    // stringifyReceipt(formatResult)
    setReceipts(value)
  }

  const nextStep = () => {
    if (formatedReceipts.length < 2) {
      return toast({
        description: '请至少提供两个地址'
      })
    }
    props.goNext(1, formatedReceipts)
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>token地址，默认为主币</FormLabel>
        <Input></Input>
      </FormControl>

      <FormControl>
        <FormLabel>收款地址列表</FormLabel>
        <Textarea resize='vertical' value={receipts} onChange={event => editReceipt(event)}></Textarea>
      </FormControl>
      <Input type='file' accept=".csv" onChange={event => parse(event)}></Input>

      <Button onClick={nextStep}>下一步</Button>
    </Box>
  )
}
