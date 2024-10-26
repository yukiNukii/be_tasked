import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const [pins, setPins] = useState<string[]>([]);
  const [newPin, setNewPin] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const addPin = () => {
    if (newPin.trim() !== '') {
      setPins([...pins, newPin.trim()]);
      setNewPin('');
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-4">
            N
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Nyuki</h2>
            <p className="text-gray-600 dark:text-gray-400">@nyukki</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Pins</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {pins.map((pin, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {pin}
            </div>
          ))}
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded flex items-center justify-center">
            <input
              type="text"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="新しいPin"
              className="w-full bg-transparent outline-none"
            />
            <button onClick={addPin} className="ml-2 text-blue-500">+</button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">あなたのメモリー</h3>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="text-gray-600 dark:text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {currentMonth.toLocaleString('ja-JP', { year: 'numeric', month: 'long' })}
          </span>
          <button onClick={nextMonth} className="text-gray-600 dark:text-gray-400">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(getDaysInMonth(currentMonth))].map((_, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === currentMonth.getDate() - 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;