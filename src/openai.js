import { LLM } from '../config/sources.js'

export async function summarizeNews(newsItems) {
  if (!LLM.apiKey) {
    console.log('No LLM API key, using raw news')
    return newsItems.map(n => `【${n.source}】${n.title}`).join('\n\n')
  }
  
  const prompt = `请将以下新闻整理成"老五简报"风格的Markdown文本。

**核心要求：所有新闻必须和中国相关！非中国相关的新闻忽略或跳过。**

格式要求：
1. 开头：一句话导语（不超过20字）
2. 按类别分组，每类用emoji+中文标题（如## 📰 国际、## 💰 经济）
3. 每条新闻格式：
   **标题**（15-30字，简洁有力）
   - 描述：200-300字，包含关键背景、数据、影响

新闻：
${newsItems.map((n, i) => `${i + 1}. [${n.source}] ${n.title}`).join('\n')}

要求：
- 用Markdown格式输出
- 用中文输出
- **只选择和中国相关的新闻**
- 非中国的新闻直接跳过，不要放入简报
- 标题要抓人眼球
- 描述要有信息增量（背景、数据、影响）
- 科技/经济类要包含具体数字
- 相同类别放一起
- 重要放前面`

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
