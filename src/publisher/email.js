import nodemailer from 'nodemailer'

export const EMAIL = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  to: process.env.EMAIL_TO || ''
}

let transporter = null

export async function initEmailTransporter() {
  if (!EMAIL.user || !EMAIL.pass) {
    console.log('Email not configured, skipping...')
    return false
  }
  
  transporter = nodemailer.createTransport({
    host: EMAIL.host,
    port: EMAIL.port,
    secure: EMAIL.secure,
    auth: {
      user: EMAIL.user,
      pass: EMAIL.pass
    }
  })
  
  try {
    await transporter.verify()
    console.log('Email transporter verified!')
    return true
  } catch (err) {
    console.error('Email error:', err.message)
    return false
  }
}

export async function sendEmail(htmlContent, subject) {
  if (!transporter) {
    await initEmailTransporter()
    if (!transporter) {
      throw new Error('Email not configured')
    }
  }
  
  const info = await transporter.sendMail({
    from: `"老五简报" <${EMAIL.user}>`,
    to: EMAIL.to,
    subject: subject,
    html: htmlContent
  })
  
  console.log('Email sent:', info.messageId)
  return info
}

export function generateHtml(news, market, summary) {
  const date = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>老五简报 - ${date}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 28px; margin-bottom: 5px; color: #333; }
    .header .date { color: #888; font-size: 14px; }
    .market { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
    .market h3 { margin: 0 0 15px 0; color: #333; }
    .market-grid { display: flex; gap: 20px; flex-wrap: wrap; }
    .market-item { flex: 1; min-width: 120px; text-align: center; }
    .market-item .label { color: #888; font-size: 12px; }
    .market-item .value { font-size: 24px; font-weight: bold; color: #333; }
    .content { background: #fff; border-radius: 12px; padding: 30px; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 18px; color: #222; border-left: 4px solid #e74c3c; padding-left: 12px; margin-bottom: 20px; }
    .news-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .news-item:last-child { border-bottom: none; }
    .news-item h4 { margin: 0 0 10px 0; font-size: 16px; color: #333; }
    .news-item p { margin: 0; color: #666; line-height: 1.6; font-size: 14px; }
    .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
    .footer .stars { color: #f1c40f; }
    .keyword { background: #e74c3c; color: #fff; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📰 老五简报</h1>
    <div class="date">${date}</div>
  </div>
  
  <div class="market">
    <h3>📊 今日数据</h3>
    <div class="market-grid">
      <div class="market-item">
        <div class="label">美元兑人民币</div>
        <div class="value">${market.usd_cny}</div>
      </div>
      <div class="market-item">
        <div class="label">美元兑日元</div>
        <div class="value">${market.usd_jpy}</div>
      </div>
      <div class="market-item">
        <div class="label">比特币</div>
        <div class="value">$${market.btc_usd}</div>
      </div>
    </div>
  </div>
  
  <div class="content">
    ${summary}
  </div>
  
  <div class="footer">
    —<br>
    本期 ${news.length} 度 <span class="stars">⭐</span>
  </div>
</body>
</html>
`
}
