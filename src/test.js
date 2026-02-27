import { SOURCES, TELEGRAM, LLM } from './config/sources.js'
import { fetchAllNews } from './fetchers/rss.js'
import { sendToTelegram } from './fetchers/rss.js'
import 'dotenv/config'

async function test() {
  console.log('Testing news sources...\n')
  
  const news = await fetchAllNews()
  console.log(`\nTotal: ${news.length} news\n`)
  
  for (const n of news.slice(5)) {
    console.log(`[${n.source}] ${n.title.slice(0, 60)}`)
  }
  
  console.log('\n--- Sending test to Telegram ---')
  await sendToTelegram(`🧪 Test from Daily News Bot\n\nNews count: ${news.length}`)
  console.log('✅ Test message sent!')
}

test().catch(console.error)
