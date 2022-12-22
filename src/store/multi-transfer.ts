import create from 'zustand'

export interface IReceipt {
  address: string,
  amount: string
}
interface MultiTransferState {
  receipts: Array<IReceipt>,
  setReceipts: (value: Array<IReceipt>) => void
}

const useMultiTransferStore = create<MultiTransferState>((set) => ({
  receipts: [],
  setReceipts: (value: Array<IReceipt>) => {
    set(state => {
      return {
        receipts: value
      }
    })
  }
}))

export default useMultiTransferStore
