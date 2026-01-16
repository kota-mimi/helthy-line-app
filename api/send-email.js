const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, email, phone, category, subject, message } = req.body;

        // 必須項目チェック
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: '必須項目を入力してください。' });
        }

        // Gmail SMTP設定
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'healthy.contact.line@gmail.com',
                pass: 'mhoa tail ogqt qrku'
            }
        });

        // カテゴリーマッピング
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

        // メール本文
        const mailContent = `
【ヘルシーくんお問い合わせ】

■ お名前: ${name}
■ メールアドレス: ${email}
■ 電話番号: ${phone || '未入力'}
■ お問い合わせ種別: ${categoryText}
■ 件名: ${subject}

■ お問い合わせ内容:
${message}

--
このメールは、ヘルシーくんのお問い合わせフォームから送信されました。
返信は ${email} に直接お送りください。
`;

        // メール送信設定
        const mailOptions = {
            from: '"ヘルシーくん" <healthy.contact.line@gmail.com>',
            to: 'healthy.contact.line@gmail.com',
            replyTo: email,
            subject: `【お問い合わせ】${subject}`,
            text: mailContent
        };

        // メール送信実行
        await transporter.sendMail(mailOptions);
        
        console.log('メール送信成功:', { from: email, subject });
        res.json({ success: true, message: 'お問い合わせを受け付けました。ありがとうございます。' });

    } catch (error) {
        console.error('メール送信エラー:', error);
        res.status(500).json({ success: false, message: 'メール送信に失敗しました。' });
    }
};