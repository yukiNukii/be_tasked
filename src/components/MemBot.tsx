import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Task } from '../contexts/TaskContext';

interface MemBotProps {
  task: Task;
}

const MemBot: React.FC<MemBotProps> = ({ task }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: `こんにちは！タスク「${task.content}」について、どのようなサポートが必要ですか？`, sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      // ここで実際のAI応答を生成する代わりに、簡単な応答を返します
      setTimeout(() => {
        setMessages(prev => [...prev, { text: getBotResponse(input, task), sender: 'bot' }]);
      }, 1000);
      setInput('');
    }
  };

  const getBotResponse = (userInput: string, task: Task) => {
    // 実際のプロジェクトでは、ここでAIモデルを使用して応答を生成します
    const responses = [
      `タスク「${task.content}」について、まずは${task.difficulty}レベルに適した方法を考えてみましょう。`,
      "そうですね、その方法は良いアプローチだと思います。さらに詳しく説明していただけますか？",
      "なるほど、その考え方は面白いですね。他の視点からも考えてみましょう。",
      `${task.difficulty}レベルのタスクでは、このような方法も効果的かもしれません。試してみてはいかがでしょうか？`,
      "素晴らしいアイデアです！それを実行に移す際の具体的な手順を考えてみましょう。",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">MemBot</h3>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-lg dark:bg-gray-800 dark:border-gray-600"
          placeholder="メッセージを入力..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg flex items-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MemBot;