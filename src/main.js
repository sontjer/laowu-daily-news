import { fetchAllNews, sendToTelegram } from './fetchers/rss.js'
import { fetchMarketData } from './fetchers/market.js'
import { summarizeNews } from './summarizer/openai.js'
import { SOURCES } from '../config/sources.js'
import 'dotenv/config'

async function main() {
  console.log('='.repeat(50))
  console.log('📰 老五简报 Started')
  console.log('='.repeat(50))
  
  console.log('\n[1/4] Fetching market data...')
  const market = await fetchMarketData()
  console.log(`  USD/CNY: ${market.usd_cny}, USD/JPY: ${market.usd_jpy}, BTC: $${market.btc_usd}`)
  
  console.log('\n[2/4] Fetching news from sources...')
  const news = await fetchAllNews()
  console.log(`Total news fetched: ${news.length}`)
  
  if (news.length === 0) {
    console.log('No news fetched, exiting')
    return
  }
  
  console.log('\n[3/4] Summarizing with LLM...')
  const summary = await summarizeNews(news)
  
  console.log('\n[4/4] Sending to Telegram...')
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const marketData = `📊 今日数据
💵 美元兑人民币：${market.usd_cny}
💴 美元兑日元：${market.usd_jpy}
₿ 比特币：$${market.btc_usd}`

  const message = `📰 <b>老五简报</b> - ${date}

${marketData}

${summary}

—
<b>本期 ${news.length} 度</b> ⭐`

  await sendToTelegram(message)
  console.log('✅ Done!')
}

main().catch(console.error)
