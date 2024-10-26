import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Share2, 
  Upload, 
  ArrowRight, 
  MessageCircle, 
  Mail,
  FileText, 
  PenTool,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Briefcase,
  FileSearch,
  Globe,
  PieChart,
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  Mic, 
  Edit3,
  HelpCircle,
  Zap,
  X,
  Send,
  Star,
  UserCheck,
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import { useTask } from '../contexts/TaskContext';
import { perplexity } from '../lib/perplexity';

interface Mission {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  difficulty: string;
  points: number;
  category: 'mission' | 'chat';
  hints?: string[];
  prompt?: string;
}

interface SuggestedResponse {
  text: string;
  translation?: string;
}

interface ChallengerInfo {
  level: number;
  description: string;
  recommendedTopics: string[];
}

const TaskArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'normal' | 'hospitality'>('normal');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [completedConversations, setCompletedConversations] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' | 'system' }>>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isJapanese, setIsJapanese] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([]);
  const [challengerLevel, setChallengerLevel] = useState<number>(1);
  const [missionTitle, setMissionTitle] = useState<string>('');
  const [missionDescription, setMissionDescription] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'title' | 'description'>('title');
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const normalMissions: Mission[] = [
    {
      id: 1,
      title: "商談後のお礼メール作成",
      description: "先日の商談のお礼と、次回の約束を確認するメールを作成します。AIと協力して適切な表現を選びましょう。",
      image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4",
      icon: <Mail className="w-6 h-6" />,
      difficulty: "初級",
      points: 30,
      category: 'mission'
    },
    {
      id: 2,
      title: "プレゼン資料の校正",
      description: "重要なプレゼンテーション資料の文章を校正します。AIを使って、より説得力のある表現に改善しましょう。",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      icon: <FileText className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 3,
      title: "議事録の要約作成",
      description: "長時間の会議の議事録か重要なポイントを抽出し、簡潔な要約を作成します。",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      icon: <PenTool className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 4,
      title: "スケジュール最適化",
      description: "1週間の予定を効率的に組み直します。AIを使って優先順位付けとタイムマネジメントを行います。",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
      icon: <Calendar className="w-6 h-6" />,
      difficulty: "初級",
      points: 30,
      category: 'mission'
    },
    {
      id: 5,
      title: "チーム目標定",
      description: "チームの四期目標をSMART原則に基づいて設定します。AIと対話しながら具体的な目標を定めましょう。",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      icon: <Users className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    },
    {
      id: 6,
      title: "市場調査レポート作成",
      description: "新規事業の市場調査レポートを作成します。AIを活用してデータ分析と洞察を導き出しましょう。",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      icon: <Target className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    },
    {
      id: 7,
      title: "営業戦略の立案",
      description: "次四半期の営業戦略を立案します。AIと協力して市場動向を分析し、効果的な戦略を考えましょう。",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      icon: <TrendingUp className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    },
    {
      id: 8,
      title: "クライアントへの提案書作成",
      description: "新規クライアントへの提案書を作成します。AIを使って、説得力のある提案内容を組み立てましょう。",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
      icon: <Briefcase className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 9,
      title: "業務マニュアルの作成",
      description: "新入社員向けの業務マニュアルを作成します。AIと対話しながら、分かりやすい手順書を作りましょう。",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      icon: <FileSearch className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 10,
      title: "海外取引先とのメール",
      description: "海外取引先とのビジネスメールを作成します。AIを使って適切な英語表現を学びながら作成しましょう。",
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42",
      icon: <Globe className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    },
    {
      id: 11,
      title: "経費レポート分析",
      description: "部門の経費データを分析し、コスト削減案を作成します。AIを使ってデータから有用な情報を抽出しましょう。",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      icon: <PieChart className="w-6 h-6" />,
      difficulty: "中級",
      points: 50,
      category: 'mission'
    },
    {
      id: 12,
      title: "クレーム対応文書作成",
      description: "顧客からのクレームに対する回答文書を作成します。AIと協力して適切な対応を考えましょう。",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      icon: <MessageCircle className="w-6 h-6" />,
      difficulty: "上級",
      points: 70,
      category: 'mission'
    }
  ];

  const challengerLevels: ChallengerInfo[] = [
    {
      level: 1,
      description: "初めてAIを使う方",
      recommendedTopics: [
        "基本的な挨拶と自己紹介",
        "簡単な質問への回答",
        "日常的な話題についての会話"
      ]
    },
    {
      level: 2,
      description: "AIに少し慣れて方",
      recommendedTopics: [
        "趣味や興味についの会話",
        "簡単な意見交",
        "本的なビジネストピック"
      ]
    },
    {
      level: 3,
      description: "AIを日常に使用している方",
      recommendedTopics: [
        "専門的な話題についての議論",
        "複雑な問題解決",
        "ビジネスネゴシエーション"
      ]
    }
  ];

  const getAIFeedback = (mission: { title: string; description: string; difficulty: string }) => {
    const challenger = challengerLevels[challengerLevel - 1];
    let feedback = '';

    if (mission.difficulty === '上級' && challengerLevel === 1) {
      feedback = `このミッションは初AIを使う方には難しいかもしれません。
以下の点の調整を検討してください：
- より基本的な話題に変更
- 段階的な指示の追加
- 具体的な例の提示`;
    } else if (mission.description.length > 200 && challengerLevel === 1) {
      feedback = '説明がやや複雑です。より簡潔で分かりやすい説明にすることをお勧めします。';
    } else {
      feedback = `良い感じのミッションですね！
以下の点を意識するとさらに良くなるかもしれません：
- ${challenger.recommendedTopics[0]}
- ${challenger.recommendedTopics[1]}`;
    }

    return feedback;
  };

  const handleCreateMission = async () => {
    try {
      const prompt = `
あなたはビジネスミッションの作成を支援するAIアドバイザーです。
以下のミッション内容を、AI初心者（レベル${challengerLevel}）向けに評価してください。

タイトル: ${missionTitle}
説明: ${missionDescription}

特に以下の点に注目してアドバイスしてください：
1. 内容の難易度は初心者に適切か
2. 説明は分かりやすいか
3. 具体的な改善案

レベル${challengerLevel}の特徴：
${challengerLevels[challengerLevel - 1].description}
`;

      const feedback = await perplexity.chat(prompt);
      
      setChatMessages([
        {
          text: `新しい接待ミッションが作成されました！\n\n題名: ${missionTitle}\n\nAIアシスタントからのフィードバック:\n${feedback}`,
          sender: 'system'
        }
      ]);
      setShowPreview(true);
    } catch (error) {
      console.error('Create mission error:', error);
      setChatMessages([
        {
          text: "申し訳ありません。ミッション作成中にエラーが発生しました。",
          sender: 'system'
        }
      ]);
    }
  };

  const openMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    setShowCompletionScreen(false);
    
    // ミッションごとの初期メッセージを設定
    let initialMessage = "";
    switch (mission.id) {
      case 1: // 商談後のお礼メール作成
        initialMessage = "商談後のお礼メールを作成しましょう！\n\n以下の要素を含めると良いでしょう：\n1. 商談への参加のお礼\n2. 商談内容の簡単な振り返り\n3. 次回の約束の確認\n\nメールの文面を考えてみましょう。";
        break;
      case 2: // プレゼン資料の校正
        initialMessage = "プレゼン資料の校正を始めましょう！\n\n校正したい文章や内容を共有してください。より説得力のある表現方法をアドバイスさせていただきます。";
        break;
      case 3: // 議事録の要約作成
        initialMessage = "議事録の要約を作成しましょう！\n\n議事録の容を共有してください。重要なポイントを抽出し、簡潔な要約にまとめていきます。";
        break;
      // 他のミッションも同様に追加...
      default:
        initialMessage = `${mission.title}を始めましょう！\n\n${mission.description}\n\nどの��うな内容から取り組みますか？`;
    }
    
    setChatMessages([{ text: initialMessage, sender: 'bot' }]);
    setShowHints(false);
  };

  const closeMissionDetail = () => {
    setSelectedMission(null);
    setChatMessages([]);
    setUserInput('');
    setShowHints(false);
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      try {
        // ユーザーメッセージを表示
        const newUserMessage = { text: userInput, sender: 'user' as const };
        setChatMessages(prev => [...prev, newUserMessage]);
        
        // perplexityクライアントを使用
        const response = await perplexity.chat(userInput);
        
        // AIの応答を表示
        const botMessage = { 
          text: response, 
          sender: 'bot' as const 
        };
        setChatMessages(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = { 
          text: "申し訳ありません。エラーが発生しました。" + (error instanceof Error ? error.message : ''), 
          sender: 'bot' as const 
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
      
      setUserInput('');
    }
  };

  const completeMission = () => {
    if (selectedMission) {
      setEarnedPoints(selectedMission.points);
      setCompletedConversations(prev => prev + 1);
      setShowCompletionScreen(true);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  // debounce関数を追加
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // handleMissionInputChange関数を修正
  const handleMissionInputChange = async (
    field: 'title' | 'description', 
    value: string
  ) => {
    if (field === 'title') {
      setMissionTitle(value);
    } else {
      setMissionDescription(value);
    }

    // 最初の入力時のみ初期メッセージを表示
    if (chatMessages.length === 0) {
      const initialFeedback = `今回の挑戦者はレベル${challengerLevel}（${challengerLevels[challengerLevel - 1].description}）です。

このレベルに適した以下のようなミッションを作成してみましょう：

推奨トピック：
${challengerLevels[challengerLevel - 1].recommendedTopics.map(topic => `・${topic}`).join('\n')}

それでは、ミッションの内容を入力してください！`;

      setChatMessages([{
        text: initialFeedback,
        sender: 'system'
      }]);
      return;
    }

    // タイトルと説明の両方が入力されている場合のみフィードバックを取得
    if (missionTitle.trim() && missionDescription.trim()) {
      try {
        const prompt = `
あなたはビジネスミッションの作成を支援するAIアドバイザーです。
以下のミッション内容を、レベル${challengerLevel}の挑戦者向けに評価してください。
挑戦者の特徴: ${challengerLevels[challengerLevel - 1].description}

タイトル: ${field === 'title' ? value : missionTitle}
説明: ${field === 'description' ? value : missionDescription}

このミッションの難易度は挑戦者のレベルに適していますか？
改善点があれば、具体的に指摘してください。
`;

        const feedback = await perplexity.chat(prompt);
        
        setChatMessages(prev => [...prev, {
          text: feedback,
          sender: 'system'
        }]);
        
      } catch (error) {
        console.error('Feedback error:', error);
        setChatMessages(prev => [...prev, {
          text: "申し訳ありません。フィードバックの取得中にエラーが発生しました。",
          sender: 'system'
        }]);
      }
    }
  };

  const CompletionScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-background-dark rounded-lg w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">
            ミッションクリア！
          </h2>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">完了したミッション</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mt-2">
              {completedConversations}
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-300">
              <Star className="w-5 h-5" />
              <span className="font-medium">獲得ポイント</span>
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-300 mt-2">
              {earnedPoints}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowCompletionScreen(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              続ける
            </button>
            <button
              onClick={closeMissionDetail}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded-lg shadow transition duration-300"
            >
              ミッション一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // activeTabの変更を監視して初期メッセージを表示
  useEffect(() => {
    if (activeTab === 'hospitality') {
      const initialMessage = `今回の挑戦者はレベル${challengerLevel}（${challengerLevels[challengerLevel - 1].description}）です。

このレベルに適した以下のようなミッションを作成してみましょう：

推奨トピック：
${challengerLevels[challengerLevel - 1].recommendedTopics.map(topic => `・${topic}`).join('\n')}

それでは、ミッションの内容を入力してください！`;

      setChatMessages([{
        text: initialMessage,
        sender: 'system'
      }]);
    } else {
      // 通常のミッション一覧に戻る時はメッセージをクリア
      setChatMessages([]);
    }
  }, [activeTab, challengerLevel]);

  if (selectedMission) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={closeMissionDetail}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ミッション一覧に戻る
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <img
              src={selectedMission.image}
              alt={selectedMission.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {selectedMission.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{selectedMission.title}</h1>
                <p className="text-gray-600">{selectedMission.difficulty}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">ミッション内容:</h2>
              <p className="text-gray-700">{selectedMission.description}</p>
            </div>

            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-50'
                      : 'bg-gray-50'
                  }`}>
                    {message.text}
                    {message.sender === 'bot' && (
                      <div className="flex items-center mt-2 space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center bg-gray-50 rounded-lg p-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    // isComposingがtrueの場合は日本語入力中
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="メッセージを入力..."
                  className="flex-1 bg-transparent border-none focus:outline-none px-2"
                />
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleHints}
                    className={`p-2 ${showHints ? 'text-primary' : 'text-gray-500'} hover:text-gray-700`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showHints && selectedMission.hints && (
                <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">ヒント:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMission.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-gray-700">{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setActiveTab('normal')}
          className={`flex-1 py-3 px-4 text-center rounded-l-lg transition duration-300 ease-in-out ${
            activeTab === 'normal'
              ? 'bg-primary text-white'
              : 'bg-background-light text-text hover:bg-gray-200'
          }`}
        >
          ビジネスミッション
        </button>
        <button
          onClick={() => setActiveTab('hospitality')}
          className={`flex-1 py-3 px-4 text-center rounded-r-lg transition duration-300 ease-in-out ${
            activeTab === 'hospitality'
              ? 'bg-primary text-white'
              : 'bg-background-light text-text hover:bg-gray-200'
          }`}
        >
          ホスピミッション作成
        </button>
      </div>

      {activeTab === 'hospitality' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">ミッション作成</h2>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <span className="text-gray-600">挑戦者レベル: {challengerLevel}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                挑戦者がギリギリ達成できるホスピタリティミッションを作成しましょう
              </p>
            </div>

            {/* AIフィードバックエリアを上部に移動 */}
            <div className="mb-6">
              {chatMessages.length > 0 && (
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.sender === 'system'
                          ? 'bg-green-50 text-gray-800'
                          : message.sender === 'user'
                          ? 'bg-blue-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-blue-700">現在の挑戦者情報</h3>
              </div>
              <p className="text-gray-700">レベル {challengerLevel}: {challengerLevels[challengerLevel - 1].description}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-600">推奨トピック:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {challengerLevels[challengerLevel - 1].recommendedTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* タイトル入力部分 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ミッションタイトル
                </label>
                <div className="space-y-2">
                  {currentStep === 'title' ? (
                    <>
                      <input
                        type="text"
                        value={missionTitle}
                        onChange={(e) => {
                          setMissionTitle(e.target.value);
                          setIsNextEnabled(e.target.value.trim().length > 0);
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="例: メールの返信文を書いてもらう"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={async () => {
                            if (missionTitle.trim()) {
                              try {
                                const feedback = await perplexity.chat(`このミッションタイトル「${missionTitle}」は、レベル${challengerLevel}の挑戦者に適していますか？`);
                                setChatMessages(prev => [...prev, {
                                  text: feedback,
                                  sender: 'system'
                                }]);
                                setCurrentStep('description');
                              } catch (error) {
                                console.error('Feedback error:', error);
                              }
                            }
                          }}
                          disabled={!isNextEnabled}
                          className={`px-6 py-2 rounded-lg transition duration-300 ${
                            isNextEnabled 
                              ? 'bg-primary text-white hover:bg-primary-dark' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          次へ
                        </button>
                      </div>
                    </>
                  ) : (
                    // 説明入力時のタイトル表示
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      {missionTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* 説明入力部分 */}
              {currentStep === 'description' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ミッション説明
                  </label>
                  <div className="space-y-2">
                    <textarea
                      value={missionDescription}
                      onChange={(e) => {
                        setMissionDescription(e.target.value);
                        setIsNextEnabled(e.target.value.trim().length > 0);
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary h-32"
                      placeholder="ミッションの目的と達成条件を記入してください"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          setCurrentStep('title');
                          setIsNextEnabled(true);
                        }}
                        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300"
                      >
                        戻る
                      </button>
                      <button
                        onClick={async () => {
                          if (missionDescription.trim()) {
                            try {
                              const feedback = await perplexity.chat(`このミッション説明「${missionDescription}」は、レベル${challengerLevel}の挑戦者に適していますか？`);
                              setChatMessages(prev => [...prev, {
                                text: feedback,
                                sender: 'system'
                              }]);
                              handleCreateMission();
                            } catch (error) {
                              console.error('Feedback error:', error);
                            }
                          }
                        }}
                        disabled={!isNextEnabled}
                        className={`px-6 py-2 rounded-lg transition duration-300 ${
                          isNextEnabled 
                            ? 'bg-primary text-white hover:bg-primary-dark' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        ミッションを作成
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {normalMissions.map((mission) => (
            <div 
              key={mission.id} 
              className="bg-white dark:bg-background-dark shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="relative">
                <img 
                  src={mission.image} 
                  alt={mission.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm">
                  {mission.category === 'mission' ? 'ミッション' : 'チャット'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{mission.title}</h3>
                  {mission.icon}
                </div>
                <p className="text-sm text-text dark:text-text-dark mb-4 line-clamp-2">
                  {mission.description}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                    {mission.difficulty}
                  </span>
                  <button
                    onClick={() => openMissionDetail(mission)}
                    className="bg-secondary text-white px-4 py-2 rounded text-sm transition duration-300 ease-in-out hover:bg-secondary-dark"
                  >
                    開始
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompletionScreen && <CompletionScreen />}
    </div>
  );
};

export default TaskArena;
