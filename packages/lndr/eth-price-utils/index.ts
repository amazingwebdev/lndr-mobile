declare const global

import FetchUtil from 'lndr/fetch-util'

const fetchUtil = new FetchUtil(fetch)

const tempStorage = {
  ethExchange: '',
  gasPrice: 0
}

export const usdToEth = async (usd: number) => {
  const rates = await fetchUtil.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
  const conversionRate = rates.data.rates.USD
  return Number(usd) / 100 / Number(conversionRate)
}

export const settlementCost = async (usd: number) => {
  const settlementAmount = await usdToEth(usd)
  const transactionCost = await getGasPrice()
  return settlementAmount + ( Number(transactionCost) / Math.pow(10, 18) )
}

export const getGasPrice = async () => {
  if (tempStorage.gasPrice) {
    return tempStorage.gasPrice
  }
  const prices = await fetchUtil.get('https://ethgasstation.info/json/ethgasAPI.json')
  return tempStorage.gasPrice = prices.safeLow * 1.3 * Math.pow(10, 8)
}

export const getEthExchange = async () => {
  if (tempStorage.ethExchange) {
    return tempStorage.ethExchange
  }
  const rates = await fetchUtil.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
  return tempStorage.ethExchange = rates.data.rates.USD
}

export const ethToUsd = (eth, exchange) => {
  const usd = String(Number(eth) * Number(exchange))
  const decimalIndex = usd.indexOf('.')
  if (decimalIndex === -1) {
    return `${usd}.00`
  }
  return usd.slice(0, decimalIndex + 3)
}
