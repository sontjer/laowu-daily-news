export const SOURCES = {
  // 国际新闻 RSS
  france24: {
    name: 'France 24',
    url: 'https://www.france24.com/en/rss',
    type: 'rss'
  },
  bbc: {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    type: 'rss'
  },
  aljazeera: {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    type: 'rss'
  },
  dw: {
    name: 'Deutsche Welle',
    url: 'https://rss.dw.com/rdf/rss-en-all',
    type: 'rss'
  },
  
  // 中文媒体 (Jina Reader)
  huanqiu: {
    name: '环球时报',
    url: 'https://r.jina.ai/https://www.huanqiu.com/',
    type: 'jina'
  },
  guancha: {
    name: '观察者网',
    url: 'https://r.jina.ai/https://www.guancha.cn/internation',
    type: 'jina'
  },
  
  // 科技新闻
  openai: {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    type: 'rss'
  },
  techcrunch: {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    type: 'rss'
  },
  hackernews: {
    name: 'Hacker News',
    url: 'https://hnrss.org/newest',
    type: 'rss'
  }
}

export const TELEGRAM = {
  botToken: '8487956919:AAHqKoNIYRBmIqN4R2s7nqmzkYbpzuPTJqo',
  chatId: '347674041'
}

export const LLM = {
  provider: 'siliconflow',
  model: 'deepseek-ai/DeepSeek-V3',
  apiKey: 'sk-nycxwwsnszrakdsbpgjirsnhhkxarjkkgvzmsiihonwqmymt',
  baseUrl: 'https://api.siliconflow.cn/v1'
}

export const CONFIG = {
  maxNewsPerSource: 5,
  maxTotalNews: 20,
  publishTime: '08:00', // 每日发布时间
  language: 'zh-CN' // 输出语言
}
