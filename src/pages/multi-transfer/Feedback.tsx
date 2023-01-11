
interface IFeedbackProps {
  txHash? : string
}

export default function Feedback (props: IFeedbackProps) {
  return <div>
    {props.txHash ? `交易成功` : '交易失败'}
  </div>
}
