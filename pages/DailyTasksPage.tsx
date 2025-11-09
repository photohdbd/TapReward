
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DailyTasksPageProps {
    setView: (view: 'main') => void;
}

const DAILY_SPIN_LIMIT = 5;

const DailyTasksPage: React.FC<DailyTasksPageProps> = ({ setView }) => {
    const { user, updateUser } = useAuth();
    const [message, setMessage] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const isCheckInDone = user?.lastCheckIn === today;
    const isDailyTaskDone = user?.lastDailyTask === today;
    
    // Reset spins if the date has changed
    if (user && user.lastSpinDate !== today) {
        updateUser({ spinsToday: 0, lastSpinDate: today });
    }
    const spinsRemaining = DAILY_SPIN_LIMIT - (user?.spinsToday || 0);

    const handleCheckIn = () => {
        if (isCheckInDone || !user) return;
        const reward = 0.10;
        updateUser({
            balance: user.balance + reward,
            lastCheckIn: today,
        });
        setMessage(`You've earned $${reward.toFixed(2)} from daily check-in!`);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDailyTask = () => {
        if (isDailyTaskDone || !user) return;
        const reward = 0.20;
        updateUser({
            balance: user.balance + reward,
            lastDailyTask: today,
        });
        setMessage(`You've earned $${reward.toFixed(2)} from the daily task!`);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSpin = () => {
        if (spinsRemaining <= 0 || !user) return;
        const reward = parseFloat((Math.random() * (1.00 - 0.01) + 0.01).toFixed(2));
        updateUser({
            balance: user.balance + reward,
            spinsToday: (user.spinsToday || 0) + 1,
        });
        setMessage(`You won $${reward.toFixed(2)} from the spin!`);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="flex flex-col animate-slide-up">
            <button onClick={() => setView('main')} className="self-start mb-6 px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition">
                &larr; Back to Dashboard
            </button>
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">Daily Tasks & Rewards</h2>
                {message && <div className="text-center bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">{message}</div>}
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg">
                        <div>
                            <p className="font-bold text-lg">Daily Check-in</p>
                            <p className="text-sm text-slate-400">Earn $0.10 every day.</p>
                        </div>
                        <button onClick={handleCheckIn} disabled={isCheckInDone} className="px-4 py-2 font-semibold text-brand-dark bg-brand-primary rounded-lg disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition">
                            {isCheckInDone ? 'Claimed' : 'Claim'}
                        </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg">
                        <div>
                            <p className="font-bold text-lg">Daily One-Time Task</p>
                            <p className="text-sm text-slate-400">Complete a simple task for $0.20.</p>
                        </div>
                        <button onClick={handleDailyTask} disabled={isDailyTaskDone} className="px-4 py-2 font-semibold text-brand-dark bg-brand-primary rounded-lg disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition">
                            {isDailyTaskDone ? 'Completed' : 'Complete'}
                        </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg">
                        <div>
                            <p className="font-bold text-lg">Spin to Win</p>
                            <p className="text-sm text-slate-400">Win between $0.01 - $1.00. ({spinsRemaining} spins left)</p>
                        </div>
                        <button onClick={handleSpin} disabled={spinsRemaining <= 0} className="px-4 py-2 font-semibold text-brand-dark bg-brand-primary rounded-lg disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition">
                            Spin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyTasksPage;
