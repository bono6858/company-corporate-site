// Netlify Functions: microCMSからニュース一覧を取得する
// このファイルはプロジェクトの netlify/functions/ フォルダ内に配置します。

// Node.js 18以降のNetlify環境ではグローバルのfetchが利用可能です。
// 古い環境の場合は `npm install node-fetch` の上、 const fetch = require('node-fetch'); が必要です。

exports.handler = async function(event, context) {
  // Netlifyの環境変数からmicroCMSの情報を取得
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN; // 例: 'your-service-id'
  const apiKey = process.env.MICROCMS_API_KEY;               // 例: 'your-api-key'

  if (!serviceDomain || !apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '環境変数 MICROCMS_SERVICE_DOMAIN または MICROCMS_API_KEY が設定されていません。' })
    };
  }

  // 最新のニュースを3件取得するエンドポイント
  const endpoint = `https://${serviceDomain}.microcms.io/api/v1/news?limit=3`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'X-MICROCMS-API-KEY': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`microCMS APIエラー: ${response.status}`);
    }

    const data = await response.json();

    // フロントエンド（index.html）が要求するフォーマットに整形
    // ※ 以下のプロパティ名はmicroCMS側のスキーマ設定に合わせて調整してください。
    const formattedData = data.contents.map(item => {
      // 日付を YYYY.MM.DD 形式にフォーマット
      const dateObj = new Date(item.publishedAt);
      const formattedDate = dateObj.toLocaleDateString('ja-JP', { 
        year: 'numeric', month: '2-digit', day: '2-digit' 
      }).replace(/\//g, '.');

      return {
        id: item.id,
        date: formattedDate,
        // カテゴリが設定されている場合はカテゴリ名を、ない場合は固定テキスト
        category: item.category && item.category.name ? item.category.name : 'News',
        title: item.title,
        // ニュース詳細ページのURLパス構造（適宜変更してください）
        url: `/news/${item.id}`,
        // サムネイル画像がない場合のダミー画像も設定
        image: item.thumbnail && item.thumbnail.url ? item.thumbnail.url : 'https://picsum.photos/seed/default/400/400'
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // クロスオリジンが問題になるローカル開発用にCORSヘッダーを追加（必要に応じて）
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(formattedData)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ニュースの取得に失敗しました。' })
    };
  }
};