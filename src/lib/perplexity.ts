const PERPLEXITY_TOKEN = import.meta.env.VITE_PPLX_TOKEN;

export const perplexity = {
  chat: async (message: string, isMission: boolean = false, isHospitality: boolean = false) => {
    try {
      let systemPrompt;
      
      if (isMission && !isHospitality) {
        // ビジネスミッション用のプロンプト
        systemPrompt = `あなたはビジネスミッションの課題を一緒に解決するAIアシスタントです。
以下のような課題に対して、ユーザーと対話しながら具体的な解決策を導き出してください：

例えば：
- お礼メールの文面作成をサポート
- プレゼン資料の文章を一緒に改善
- 議事録の要約をステップバイステップで作成
など

以下の点を意識して対話してください：
- ユーザーの状況を具体的に質問する
- 一緒に考えながら解決策を提案する
- 「〇〇はどうでしょうか？」という提案形式で話す
- 専門用語は分かりやすく説明する
- 長文の箇条書きは避け、会話的な返答を心がける

ユーザーと対話しながら、最適な解決策を見つけていきましょう。`;
      } else if (isHospitality) {
        // 接待ミッション作成用のプロンプト（変更なし）
        systemPrompt = `あなたは接待ミッションの作成を支援するAIアシスタントです。
フィードバックは必ず1-2文で簡潔に返してください。
以下の点を評価します：
- 接待スキルの向上に繋がるか
- 挑戦者のレベルに適しているか
- 具体的で実践的な内容か`;
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_TOKEN}`
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-chat",
          messages: [
            { 
              role: "system", 
              content: systemPrompt
            },
            { 
              role: "user", 
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }
};
