import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TaskArena from './pages/TaskArena';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Router>
          <ScrollToTop />
          <div className="flex min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
            <Footer />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/task-arena" element={<TaskArena />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;