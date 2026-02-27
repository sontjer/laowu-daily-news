export async function fetchMarketData() {
  const fetch = (await import('node-fetch')).default
  
  const data = {}
  
  try {
    const forexRes = await fetch('https://api.fxratesapi.com/latest?base=USD&symbols=CNY,JPY')
    const forex = await forexRes.json()
    data.usd_cny = forex.rates?.CNY?.toFixed(2) || 'N/A'
    data.usd_jpy = forex.rates?.JPY?.toFixed(2) || 'N/A'
  } catch {
    try {
      const forexRes = await fetch('https://open.er-api.com/v6/latest/USD')
      const forex = await forexRes.json()
      data.usd_cny = forex.rates?.CNY?.toFixed(2) || 'N/A'
      data.usd_jpy = forex.rates?.JPY?.toFixed(2) || 'N/A'
    } catch {
      data.usd_cny = 'N/A'
      data.usd_jpy = 'N/A'
    }
  }
  
  try {
    const btcRes = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    const btc = await btcRes.json()
    data.btc_usd = Math.round(btc.bpi?.USD?.rate_float || 0).toLocaleString()
  } catch {
    try {
      const btcRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      const btc = await btcRes.json()
      data.btc_usd = Math.round(parseFloat(btc.price)).toLocaleString()
    } catch {
      data.btc_usd = 'N/A'
    }
  }
  
  return data
}
