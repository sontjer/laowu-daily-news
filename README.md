# 老五简报

每日自动生成的新闻简报，推送到 Telegram。

## 功能

- 🤖 自动抓取全球新闻源（RSS + Jina Reader）
- 🧠 LLM 摘要生成（SiliconFlow DeepSeek V3）
- 📱 Telegram 推送
- ⏰ 每日 7:45 自动运行

## 新闻源

| 类型 | 来源 |
|------|------|
| 国际 | France 24, BBC, Al Jazeera, DW |
| 中文 | 环球时报, 观察者网 |
| 科技 | OpenAI Blog, TechCrunch, Hacker News |

## 筛选优先级

1. 中国相关新闻
2. 世界热点（俄乌、美伊、特朗普等）
3. 科技新闻（AI 等）
4. 经济新闻（A股、港股等）

## 技术栈

- Node.js
- GitHub Actions (self-hosted runner)
- SiliconFlow API
- Telegram Bot API

## 部署

### 1. 配置 Secrets

在 GitHub 仓库设置中添加：

| Secret | 说明 |
|--------|------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token |
| `TELEGRAM_CHAT_ID` | 你的 Chat ID |
| `SILICONFLOW_API_KEY` | SiliconFlow API Key |

### 2. Self-hosted Runner

在服务器上配置 runner：

```bash
cd /root/actions-runner
./config.sh --url https://github.com/sontjer/laowu-daily-news --token <token>
./run.sh &
```

### 3. Cron 定时开关

```bash
# 7:40 开启
40 7 * * * cd /root/actions-runner && ./run.sh &

# 7:45 关闭
45 7 * * * pkill -f Runner.Listener
```

## License

MIT
