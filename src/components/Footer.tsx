import React, { useState } from 'react';
import { Home, Target, Send, ChevronRight, ChevronLeft, Settings, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // ログアウト処理をここに実装
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <Home className="w-6 h-6" />, label: 'ホーム' },
    { path: '/task-arena', icon: <Target className="w-6 h-6" />, label: 'タスクアリーナ' },
  ];

  const bottomMenuItems = [
    { 
      path: '/profile', 
      icon: <User className="w-6 h-6" />, 
      label: 'プロフィール',
      className: 'border-t border-gray-200 dark:border-gray-700'
    },
    { path: '/settings', icon: <Settings className="w-6 h-6" />, label: '設定' },
    { 
      path: '/logout', 
      icon: <LogOut className="w-6 h-6" />, 
      label: 'ログアウト',
      onClick: handleLogout 
    },
  ];

  return (
    <aside 
      className={`${
        isExpanded ? 'w-48' : 'w-16'
      } bg-white dark:bg-background-dark shadow-md flex flex-col justify-between transition-all duration-300 ease-in-out relative`}
    >
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-6 bg-white dark:bg-background-dark shadow-md rounded-full p-1 text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-light"
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="py-8 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 mx-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {isExpanded && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      <div className="py-8 space-y-4">
        {bottomMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.onClick}
            className={`flex items-center px-4 py-2 mx-2 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800'
            } ${item.className || ''}`}
          >
            {item.icon}
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Footer;