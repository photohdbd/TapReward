
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ReferralPageProps {
    setView: (view: 'main') => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ setView }) => {
    const { user } = useAuth();
    const referralLink = `https://tapreward.app/ref/${user?.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied!');
    };
    
    const perReferralEarning = 1 + (user?.referralLevel || 1); // $2 for level 1, $3 for level 2, etc.

    return (
        <div className="flex flex-col animate-slide-up">
            <button onClick={() => setView('main')} className="self-start mb-6 px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition">
                &larr; Back to Dashboard
            </button>
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">Referral System</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
                    <div className="bg-slate-900 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Your Referrals</p>
                        <p className="text-2xl font-bold text-brand-light">{user?.referrals}</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Referral Level</p>
                        <p className="text-2xl font-bold text-brand-light">{user?.referralLevel}</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Earn per Referral</p>
                        <p className="text-2xl font-bold text-brand-light">${perReferralEarning.toFixed(2)}</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Your Referral Link</h3>
                    <div className="flex items-center space-x-2 bg-slate-700 p-3 rounded-lg">
                        <input type="text" readOnly value={referralLink} className="bg-transparent text-slate-300 w-full outline-none text-sm"/>
                        <button onClick={handleCopyLink} className="p-2 bg-brand-primary rounded-md text-brand-dark hover:bg-brand-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>
                        </button>
                    </div>
                </div>

                <div className="text-sm text-slate-400 space-y-2">
                   <p><strong className="text-slate-200">Level 1:</strong> Earn $2 per referral.</p>
                   <p><strong className="text-slate-200">Level 2 (10 referrals):</strong> Earn $3 per referral.</p>
                   <p>Each new level unlocks after 10 more referrals and increases your earnings by $1 per referral. Keep sharing to level up!</p>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;
