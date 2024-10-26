import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Share2, AlertCircle } from 'lucide-react';

const DIFFICULTY_LEVELS = ['初級', '中級', '上級'];

const TASKS = {
  '初級': [
    "AIを使って1日のスケジュールを最適化する方法を考えてください。",
    "AIを活用して、会議の議事録を自動で要約する方法を提案してください。",
    "AIを使って、顧客からのよくある質問に自動で回答するシステムを設計してください。",
  ],
  '中級': [
    "AIを活用して、データ分析の効率を上げる方法を提案してください。",
    "AIを使って、社内コミュニケーションを改善するアイデアを出してください。",
    "AIを活用して、新製品のアイデアを生み出す方法を考えてください。",
  ],
  '上級': [
    "AIを使って業務プロセスを自動化する方法を考えてください。",
    "AIを使って、顧客サービスの質を向上させる戦略を立ててください。",
    "AIを活用して、市場動向を予測し、ビジネス戦略を立案する方法を提案してください。",
  ]
};

const Dashboard: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2分
  const [isTaskActive, setIsTaskActive] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>('初級');
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    getNewTask();
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTaskActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTaskActive(false);
      setFeedback("時間切れです！次のタスクに挑戦しましょう。");
    }
    return () => clearInterval(timer);
  }, [isTaskActive, timeLeft]);

  const getNewTask = () => {
    const tasks = TASKS[difficulty as keyof typeof TASKS];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setCurrentTask(randomTask);
    setTimeLeft(120);
    setFeedback(null);
  };

  const startTask = () => {
    setIsTaskActive(true);
    setFeedback(null);
  };

  const completeTask = () => {
    setIsTaskActive(false);
    setCompletedTasks(prev => prev + 1);
    setFeedback("素晴らしい！タスクを完了しました。");
    
    if (completedTasks + 1 >= 3 && difficulty !== '上級') {
      const nextDifficultyIndex = DIFFICULTY_LEVELS.indexOf(difficulty) + 1;
      setDifficulty(DIFFICULTY_LEVELS[nextDifficultyIndex]);
      setFeedback(`おめでとうございます！難易度が${DIFFICULTY_LEVELS[nextDifficultyIndex]}に上がりました！`);
      setCompletedTasks(0);
    } else {
      getNewTask();
    }
  };

  const shareTask = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BeTasked - 今日のタスク',
        text: currentTask,
        url: window.location.href,
      })
        .then(() => console.log('タスクを共有しました'))
        .catch((error) => console.log('共有エラー:', error));
    } else {
      alert('お使いのブラウザは共有機能をサポートしていません。');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">現在のタスク</h2>
          <span className="bg-blue-500 text-white px-2 py-1 rounded">{difficulty}</span>
        </div>
        {currentTask ? (
          <>
            <p className="mb-4">{currentTask}</p>
            {!isTaskActive ? (
              <div className="flex justify-between items-center">
                <button
                  onClick={startTask}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  タスク開始
                </button>
                <button
                  onClick={shareTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  共有
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">残り時間: {timeLeft} 秒</p>
                <button
                  onClick={completeTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  タスク完了
                </button>
              </div>
            )}
          </>
        ) : (
          <p>タスクを読み込み中...</p>
        )}
      </div>
      {feedback && (
        <div className={`bg-${feedback.includes('おめでとう') ? 'green' : 'yellow'}-100 border-l-4 border-${feedback.includes('おめでとう') ? 'green' : 'yellow'}-500 text-${feedback.includes('おめでとう') ? 'green' : 'yellow'}-700 p-4 mb-6`} role="alert">
          <p className="font-bold">フィードバック</p>
          <p>{feedback}</p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">進捗状況</h3>
        <p>難易度: {difficulty}</p>
        <p>完了タスク数: {completedTasks} / 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(completedTasks / 3) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;