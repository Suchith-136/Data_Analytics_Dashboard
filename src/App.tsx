import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  return (
    <>
      {currentView === 'home' ? (
        <HomePage onEnterDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onBackToHome={() => setCurrentView('home')} />
      )}
    </>
  );
}
