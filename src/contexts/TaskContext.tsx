import React, { createContext, useContext, useState } from 'react';

export interface Task {
  id: string;
  content: string;
  difficulty: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  addTask: (task: Omit<Task, 'id'>) => void;
  completeTask: (taskId: string) => void;
  getNextTask: () => Task | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'AIを使って1日のスケジュールを最適化する方法を考えてください。', difficulty: '初級', completed: false, createdAt: new Date() },
    { id: '2', content: 'AIを活用して、データ分析の効率を上げる方法を提案してください。', difficulty: '中級', completed: false, createdAt: new Date() },
    { id: '3', content: 'AIを使って業務プロセスを自動化する方法を考えてください。', difficulty: '上級', completed: false, createdAt: new Date() },
  ]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
  };

  const completeTask = (taskId: string) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: true } : task));
    setCurrentTask(null);
  };

  const getNextTask = (): Task | null => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length > 0) {
      const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
      setCurrentTask(randomTask);
      return randomTask;
    }
    return null;
  };

  return (
    <TaskContext.Provider value={{ tasks, currentTask, loading, addTask, completeTask, getNextTask }}>
      {children}
    </TaskContext.Provider>
  );
};