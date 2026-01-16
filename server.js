const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Gmail SMTP設定
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// メール送信エンドポイント
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, phone, category, subject, message, privacy } = req.body;

        // 必須フィールドのチェック
        if (!name || !email || !category || !subject || !message || !privacy) {
            return res.status(400).json({ 
                success: false, 
                message: '必須項目が入力されていません。' 
            });
        }

        // カテゴリーのマッピング
        const categoryMap = {
            'service': 'サービス・機能について',
            'payment': '料金・お支払いについて',
            'bug': '技術的な問題・バグ報告',
            'account': 'アカウント・登録について',
            'business': '法人・事業提携について',
            'media': 'メディア・取材について',
            'other': 'その他'
        };

        const categoryText = categoryMap[category] || category;

        // メール本文の作成
        const emailContent = `
【ヘルシーくんお問い合わせ】

■ お名前
${name}

■ メールアドレス
${email}

■ 電話番号
${phone || '未入力'}

■ お問い合わせ種別
${categoryText}

■ 件名
${subject}

■ お問い合わせ内容
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールは、ヘルシーくんのお問い合わせフォームから送信されました。
返信は上記のメールアドレス（${email}）に直接お送りください。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;

        // メールオプション
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'healthy.contact.line@gmail.com',
            replyTo: email, // お客様のメールアドレスを返信先に設定
            subject: `【ヘルシーくんお問い合わせ】${subject}`,
            text: emailContent
        };

        // メール送信
        await transporter.sendMail(mailOptions);

        console.log('メール送信成功:', {
            from: email,
            category: categoryText,
            subject: subject,
            timestamp: new Date().toISOString()
        });

        res.json({ 
            success: true, 
            message: 'お問い合わせを受け付けました。ありがとうございます。' 
        });

    } catch (error) {
        console.error('メール送信エラー:', error);
        res.status(500).json({ 
            success: false, 
            message: 'メール送信中にエラーが発生しました。しばらく時間をおいてから再度お試しください。' 
        });
    }
});

// ルートパス
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Gmail SMTP設定:');
    console.log('- GMAIL_USER:', process.env.GMAIL_USER || '未設定');
    console.log('- GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '設定済み' : '未設定');
});

module.exports = app;