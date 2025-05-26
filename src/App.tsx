import React from 'react';
import { Bitcoin } from 'lucide-react';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
      <footer className="container mx-auto px-4 py-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Bitcoin className="h-5 w-5 text-primary-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Bitcoin Tracker © {new Date().getFullYear()}
            </span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-500">
            Disclaimer: Trading recommendations are for informational purposes only. 
            Always do your own research before making investment decisions.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;