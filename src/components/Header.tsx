import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-background-dark shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-xl font-display font-bold text-primary dark:text-primary-light">
          <Brain className="w-6 h-6 mr-2" />
          BeTasked
        </Link>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-text dark:text-text-dark cursor-pointer" />
          <button onClick={toggleTheme} className="text-text dark:text-text-dark">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;