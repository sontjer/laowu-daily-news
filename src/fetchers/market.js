export async function fetchMarketData() {
  const fetch = (await import('node-fetch')).default
  
  const data = { usd_cny: 'N/A', usd_jpy: 'N/A', btc_usd: 'N/A' }
  
  try {
    const forexRes = await fetch('https://open.er-api.com/v6/latest/USD')
    const forex = await forexRes.json()
    if (forex.rates) {
      data.usd_cny = forex.rates.CNY ? Number(forex.rates.CNY).toFixed(2) : 'N/A'
      data.usd_jpy = forex.rates.JPY ? Number(forex.rates.JPY).toFixed(2) : 'N/A'
    }
  } catch (e) {
    console.log('Forex API error:', e.message)
  }
  
  try {
    const btcRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    const btc = await btcRes.json()
    if (btc.price) {
      data.btc_usd = Math.round(parseFloat(btc.price)).toLocaleString()
    }
  } catch (e) {
    console.log('BTC API error:', e.message)
  }
  
  return data
}
