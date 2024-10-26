const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

export const perplexity = {
  chat: async (message: string) => {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-chat",
          messages: [
            { 
              role: "system", 
              content: "あなたはビジネスシーンでのコミュニケーションを支援するAIアシスタントです。"
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
