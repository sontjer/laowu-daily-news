import { SOURCES, TELEGRAM, LLM, CONFIG } from '../config/sources.js'

async function fetchRSS(url) {
  const { default: Parser } = await import('feedparser')
  const fetch = (await import('node-fetch')).default
  
  const response = await fetch(url)
  const stream = response.body
  
  return new Promise((resolve, reject) => {
    const items = []
    const parser = new Parser()
    
    parser.on('error', reject)
    parser.on('readable', () => {
      let item
      while ((item = parser.read())) {
        items.push({
          title: item.title,
          link: item.link,
          description: item.description?.replace(/<[^>]+>/g, '').slice(0, 200),
          pubDate: item.pubDate,
          source: ''
        })
      }
    })
    parser.on('end', () => resolve(items))
    
    stream.pipe(parser)
  })
}

async function fetchJina(url) {
  const fetch = (await import('node-fetch')).default
  
  const response = await fetch(url)
  const text = await response.text()
  
  const lines = text.split('\n')
  const news = []
  let currentTitle = ''
  let currentLink = ''
  
  for (const line of lines) {
    const titleMatch = line.match(/###? \[(.+?)\]\((.+?)\)/)
    if (titleMatch) {
      if (currentTitle) {
        news.push({ title: currentTitle, link: currentLink, description: '' })
      }
      currentTitle = titleMatch[1]
      currentLink = titleMatch[2]
    }
  }
  if (currentTitle) {
    news.push({ title: currentTitle, link: currentLink, description: '' })
  }
  
  return news.slice(0, CONFIG.maxNewsPerSource)
}

export async function fetchAllNews() {
  const allNews = []
  
  for (const [key, source] of Object.entries(SOURCES)) {
    console.log(`Fetching ${source.name}...`)
    try {
      let items = []
      if (source.type === 'rss') {
        items = await fetchRSS(source.url)
      } else if (source.type === 'jina') {
        items = await fetchJina(source.url)
      }
      
      items = items.slice(0, CONFIG.maxNewsPerSource).map(item => ({
        ...item,
        source: source.name
      }))
      
      allNews.push(...items)
      console.log(`  -> Got ${items.length} items`)
    } catch (err) {
      console.error(`  -> Error: ${err.message}`)
    }
  }
  
  return allNews.slice(0, CONFIG.maxTotalNews)
}

export async function sendToTelegram(message) {
  const fetch = (await import('node-fetch')).default
  
  // Convert to Telegram HTML format
  let html = message
    .replace(/^标题：(.+)$/gm, '<b>标题：$1</b>')
    .replace(/^## (.+)$/gm, '<b>$1</b>')
    .replace(/^\*\*([^*]+)\*\*$/gm, '<b>$1</b>')
    .replace(/^标题 /gm, '<b>标题：')
    .replace(/^描述：/gm, '描述：')
  
  const url = `https://api.telegram.org/bot${TELEGRAM.botToken}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM.chatId,
      text: html,
      parse_mode: 'HTML'
    })
  })
  
  const result = await response.json()
  if (!result.ok) {
    throw new Error(result.description)
  }
  return result
}

export async function sendHtmlToTelegram(html) {
  const fetch = (await import('node-fetch')).default
  
  // Send as document (HTML file)
  const formData = new FormData()
  const blob = new Blob([html], { type: 'text/html' })
  formData.append('document', blob, 'laowu-jianbao.html')
  formData.append('chat_id', TELEGRAM.chatId)
  formData.append('caption', '📰 老五简报')
  
  const url = `https://api.telegram.org/bot${TELEGRAM.botToken}/sendDocument`
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  if (!result.ok) {
    throw new Error(result.description)
  }
  return result
}
