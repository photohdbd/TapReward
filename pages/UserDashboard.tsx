
import React, { useState } from 'react';
import { Page, SetPage } from '../types';
import { useAuth } from '../context/AuthContext';
import TapToEarnPage from './TapToEarnPage';
import ReferralPage from './ReferralPage';
import DailyTasksPage from './DailyTasksPage';
import WithdrawPage from './WithdrawPage';
import EarningHistoryPage from './EarningHistoryPage';

type DashboardView = 'main' | 'tap' | 'referral' | 'tasks' | 'withdraw' | 'history';

const UserDashboard: React.FC<{ setCurrentPage: SetPage }> = ({ setCurrentPage }) => {
    const { user, logout } = useAuth();
    const [currentView, setCurrentView] = useState<DashboardView>('main');

    const renderView = () => {
        switch (currentView) {
            case 'tap':
                return <TapToEarnPage setView={setCurrentView} />;
            case 'referral':
                return <ReferralPage setView={setCurrentView} />;
            case 'tasks':
                return <DailyTasksPage setView={setCurrentView} />;
            case 'withdraw':
                return <WithdrawPage setView={setCurrentView} />;
             case 'history':
                return <EarningHistoryPage setView={setCurrentView} />;
            default:
                return <MainDashboard setView={setCurrentView} />;
        }
    };
    
    return (
      <div className="min-h-screen bg-brand-dark text-brand-light p-4 md:p-6 animate-fade-in">
        <header className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome, <span className="text-brand-primary">{user?.name}</span></h1>
                <p className="text-slate-400">Let's make some money!</p>
            </div>
            <button onClick={logout} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        </header>
        {renderView()}
      </div>
    );
};

const MainDashboard: React.FC<{setView: (view: DashboardView) => void}> = ({setView}) => {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Daily Check-in', icon: '📅', view: 'tasks' },
        { name: 'Daily Task', icon: '📝', view: 'tasks' },
        { name: 'Spin & Win', icon: '🎰', view: 'tasks' },
        { name: 'Tap-to-Earn', icon: '👆', view: 'tap' },
        { name: 'Referral System', icon: '🤝', view: 'referral' },
        { name: 'Withdraw', icon: '💸', view: 'withdraw' },
        { name: 'Earning History', icon: '📜', view: 'history' },
        { name: 'Profile', icon: '👤', view: 'main' }, // Placeholder
    ];

    return (
         <div className="animate-slide-up">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-6 text-center">
                <p className="text-slate-400 text-sm">ACCOUNT BALANCE</p>
                <p className="text-4xl font-extrabold text-brand-primary tracking-wider">${user?.balance.toFixed(4)}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {menuItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setView(item.view as DashboardView)}
                        className="flex flex-col items-center justify-center text-center p-4 bg-slate-800 rounded-2xl shadow-md hover:bg-slate-700 hover:scale-105 transform transition-all duration-300 aspect-square"
                    >
                        <span className="text-4xl mb-2">{item.icon}</span>
                        <p className="font-semibold text-sm">{item.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default UserDashboard;
