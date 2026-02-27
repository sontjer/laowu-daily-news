import { LLM } from '../config/sources.js'

export async function summarizeNews(newsItems) {
  if (!LLM.apiKey) {
    console.log('No LLM API key, using raw news')
    return newsItems.map(n => `【${n.source}】${n.title}`).join('\n\n')
  }
  
  const prompt = `请将以下新闻整理成简洁的中文摘要，每条不超过30字，按类别分组：

${newsItems.map((n, i) => `${i + 1}. [${n.source}] ${n.title}`).join('\n')}

要求：
- 用中文输出
- 每条新闻用一句话概括
- 相同类别的放在一起
- 重要的放前面`

  let response
  
  if (LLM.provider === 'deepseek' || LLM.provider === 'siliconflow') {
    response = await fetch(`${LLM.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM.apiKey}`
      },
      body: JSON.stringify({
        model: LLM.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      })
    })
  }
  
  const data = await response.json()
  return data.choices?.[0]?.message?.content || '摘要生成失败'
}

export async function fetchArticleContent(url) {
  const fetch = (await import('node-fetch')).default
  
  try {
    const response = await fetch(`https://r.jina.ai/${url}`)
    const text = await response.text()
    return text.slice(0, 3000)
  } catch {
    return ''
  }
}
