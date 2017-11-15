//Using transactions?values={x}
export default class TransactionHistory {
  debtor: string
  creditor: string
  amount: number
  ucac: string
  doesUserOweFriend: boolean

  constructor (address, elem) {
    const { creditRecord: { creditor, debtor, amount, ucac } } = elem
    this.creditor = creditor
    this.debtor = debtor
    this.amount = amount
    this.ucac = ucac
    this.doesUserOweFriend = address === debtor
  }
}
