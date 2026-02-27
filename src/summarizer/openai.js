import { LLM } from '../config/sources.js'

export async function summarizeNews(newsItems) {
  if (!LLM.apiKey) {
    console.log('No LLM API key, using raw news')
    return newsItems.map(n => `【${n.source}】${n.title}`).join('\n\n')
  }
  
  const prompt = `请将以下新闻整理成老五简报。

重要输出格式（按这个格式输出）：
标题：xxx
描述：xxx（200-300字）

新闻：
${newsItems.map((n, i) => `${i + 1}. [${n.source}] ${n.title}`).join('\n')}

筛选规则：
1. 优先选择环球时报、观察者网的新闻（至少2-3条）
2. 然后选中国相关新闻
3. 世界热点（俄乌、美伊、特朗普等）
4. 科技新闻（AI、OpenAI等）
5. 经济新闻

要求：
- 每条描述200-300字
- 只输出标题和描述，不要其他文字
- 不要代码块
- 用中文`

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
        max_tokens: 4000
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
