import React, { useState } from 'react';
import { X, Camera, Book, Bell, Moon, HelpCircle, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [useDeviceSettings, setUseDeviceSettings] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  const handleSave = () => {
    // Save settings logic here
    navigate('/');
  };

  const handleLogout = () => {
    // Logout logic here
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Delete account logic here
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={handleClose} className="text-gray-600 dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">設定</h1>
          <button
            onClick={handleSave}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            保存
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-800" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名"
              className="w-full px-4 py-3 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="w-full px-4 py-3 bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>

          <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">パスワードをリセット</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-4 mb-8">
          <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center">
            <Book className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">学習&サウンド設定</span>
            <ChevronRight className="w-5 h-5 ml-auto text-gray-400" />
          </button>

          <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center">
            <Bell className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">通知設定</span>
            <ChevronRight className="w-5 h-5 ml-auto text-gray-400" />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
            DARK MODE
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">デバイス設定を使用する</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDeviceSettings}
                  onChange={() => setUseDeviceSettings(!useDeviceSettings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Help and Account Management */}
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center">
            <HelpCircle className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">ヘルプ</span>
            <ChevronRight className="w-5 h-5 ml-auto text-gray-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">ログアウト</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center"
          >
            <Trash2 className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-red-500">アカウントを削除</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;