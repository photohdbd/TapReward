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
    const [showProfile, setShowProfile] = useState(false);

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
                return <MainDashboard setView={setCurrentView} setShowProfile={setShowProfile} />;
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
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>
    );
};

const MainDashboard: React.FC<{setView: (view: DashboardView) => void; setShowProfile: (show: boolean) => void;}> = ({setView, setShowProfile}) => {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Daily Tasks', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, view: 'tasks' },
        { name: 'Tap-to-Earn', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 8.812a9.025 9.025 0 011.588-1.588M4.222 11.222a9.025 9.025 0 011.588-1.588" /></svg>, view: 'tap' },
        { name: 'Referrals', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, view: 'referral' },
        { name: 'Withdraw', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, view: 'withdraw' },
        { name: 'History', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, view: 'history' },
        { name: 'Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, view: 'profile' },
    ];

    return (
         <div className="animate-slide-up">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-6 text-center">
                <p className="text-slate-400 text-sm">ACCOUNT BALANCE</p>
                <p className="text-4xl font-extrabold text-brand-primary tracking-wider">${user?.balance.toFixed(4)}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {menuItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => item.view === 'profile' ? setShowProfile(true) : setView(item.view as DashboardView)}
                        className="flex flex-col items-center justify-center text-center p-4 bg-slate-800 rounded-2xl shadow-md hover:bg-slate-700 hover:scale-105 transform transition-all duration-300 aspect-square"
                    >
                        <div className="text-brand-primary mb-2">{item.icon}</div>
                        <p className="font-semibold text-sm text-slate-300">{item.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

const ProfileModal: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { user } = useAuth();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-light">{user?.name}</h2>
                    <p className="text-slate-400">{user?.email}</p>
                </div>
            </div>
        </div>
    );
};


export default UserDashboard;