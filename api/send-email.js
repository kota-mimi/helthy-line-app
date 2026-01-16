module.exports = async function handler(req, res) {
    // CORSヘッダーを設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONSリクエストに対応
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POSTメソッドのみを許可
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

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

        // Formsubmitを使用して確実にメール送信
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone || '未入力');
        formData.append('category', categoryText);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('_subject', `【ヘルシーくんお問い合わせ】${subject}`);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        const formsubmitResponse = await fetch('https://formsubmit.co/healthy.contact.line@gmail.com', {
            method: 'POST',
            body: formData
        });

        if (!formsubmitResponse.ok) {
            throw new Error('メール送信に失敗しました');
        }

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
};