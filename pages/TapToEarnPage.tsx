
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface TapToEarnPageProps {
    setView: (view: 'main') => void;
}

const DAILY_TAP_LIMIT = 1000;
const EARN_PER_TAP = 0.001;

const TapToEarnPage: React.FC<TapToEarnPageProps> = ({ setView }) => {
    const { user, updateUser } = useAuth();
    const [taps, setTaps] = useState(user?.tapsToday || 0);
    const [lastTapTime, setLastTapTime] = useState(0);

    // Reset daily taps if the date has changed
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (user && user.lastTapDate !== today) {
            updateUser({ tapsToday: 0, lastTapDate: today });
            setTaps(0);
        }
    }, [user, updateUser]);

    const handleTap = () => {
        const now = Date.now();
        // Simple anti-fraud: prevent taps faster than 50ms
        if (now - lastTapTime < 50) {
            return;
        }

        if (taps < DAILY_TAP_LIMIT && user) {
            const newTaps = taps + 1;
            setTaps(newTaps);
            const newBalance = user.balance + EARN_PER_TAP;
            updateUser({ balance: newBalance, tapsToday: newTaps });
            setLastTapTime(now);

            // Visual feedback
            showFloatingText();
        }
    };
    
    const showFloatingText = () => {
        const tapButton = document.getElementById('tap-button');
        if (!tapButton) return;
        const floatingText = document.createElement('div');
        floatingText.innerText = `+$${EARN_PER_TAP.toFixed(3)}`;
        floatingText.className = 'absolute text-3xl font-bold text-brand-primary opacity-100 transition-all duration-1000 pointer-events-none';
        
        const rect = tapButton.getBoundingClientRect();
        // Random position within the button
        const x = Math.random() * (rect.width - 50);
        const y = Math.random() * (rect.height - 50);

        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        floatingText.style.transform = 'translateY(0)';
        floatingText.style.opacity = '1';

        tapButton.appendChild(floatingText);

        setTimeout(() => {
            floatingText.style.transform = 'translateY(-100px)';
            floatingText.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    };

    const remainingTaps = DAILY_TAP_LIMIT - taps;
    const progressPercentage = (taps / DAILY_TAP_LIMIT) * 100;

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] animate-slide-up">
            <button onClick={() => setView('main')} className="self-start mb-4 px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition">
                &larr; Back to Dashboard
            </button>

            <div className="flex-grow flex flex-col items-center justify-center text-center">
                 <div className="mb-4">
                    <p className="text-slate-400 text-lg">Your Balance</p>
                    <p className="text-4xl font-extrabold text-brand-light">${user?.balance.toFixed(4)}</p>
                 </div>

                <div id="tap-button" className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl select-none cursor-pointer transform active:scale-95 transition-transform duration-100">
                    <button onClick={handleTap} className="w-full h-full rounded-full flex flex-col items-center justify-center focus:outline-none">
                         <span className="text-8xl">👆</span>
                         <p className="text-3xl font-bold text-slate-800">TAP!</p>
                    </button>
                </div>
                
                <div className="w-full max-w-sm mt-8">
                    <div className="flex justify-between font-bold text-lg mb-2">
                        <span className="text-brand-primary">{taps}</span>
                        <span className="text-slate-400">/ {DAILY_TAP_LIMIT}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4">
                        <div className="bg-brand-primary h-4 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="mt-2 text-slate-300">{remainingTaps} taps remaining today</p>
                </div>
            </div>
        </div>
    );
};

export default TapToEarnPage;
