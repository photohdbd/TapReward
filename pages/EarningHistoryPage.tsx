
import React from 'react';

interface EarningHistoryPageProps {
    setView: (view: 'main') => void;
}

const EarningHistoryPage: React.FC<EarningHistoryPageProps> = ({ setView }) => {
    // This is a placeholder. A real implementation would fetch earning history from an API.
    const mockHistory = [
        { id: 1, type: 'Tap-to-Earn', amount: 1.00, date: '2023-10-27' },
        { id: 2, type: 'Daily Check-in', amount: 0.10, date: '2023-10-27' },
        { id: 3, type: 'Referral Bonus', amount: 2.00, date: '2023-10-26' },
        { id: 4, type: 'Spin & Win', amount: 0.55, date: '2023-10-26' },
    ];

    return (
        <div className="flex flex-col animate-slide-up">
            <button onClick={() => setView('main')} className="self-start mb-6 px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition">
                &larr; Back to Dashboard
            </button>
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">Earning History</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {mockHistory.length > 0 ? mockHistory.map(item => (
                        <div key={item.id} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-brand-light">{item.type}</p>
                                <p className="text-xs text-slate-400">{item.date}</p>
                            </div>
                            <span className="font-bold text-green-400">+${item.amount.toFixed(2)}</span>
                        </div>
                    )) : (
                        <p className="text-center text-slate-400 pt-8">No earning history found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EarningHistoryPage;
