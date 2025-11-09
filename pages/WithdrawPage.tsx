
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/mockApi';
import { WithdrawalRequest } from '../types';

interface WithdrawPageProps {
    setView: (view: 'main') => void;
}

const MINIMUM_WITHDRAWAL = 10;

const WithdrawPage: React.FC<WithdrawPageProps> = ({ setView }) => {
    const { user, updateUser } = useAuth();
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<WithdrawalRequest[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user) {
                const userHistory = await api.getUserWithdrawalHistory(user.id);
                setHistory(userHistory.reverse());
            }
        };
        fetchHistory();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const numAmount = parseFloat(amount);

        if (!user || !numAmount || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (numAmount < MINIMUM_WITHDRAWAL) {
            setError(`Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL}.`);
            return;
        }
        if (numAmount > user.balance) {
            setError('Insufficient balance.');
            return;
        }
        if (!walletAddress.trim()) {
            setError('Please enter your Binance Wallet Address.');
            return;
        }

        setLoading(true);
        const success = await api.submitWithdrawalRequest(user.id, numAmount, walletAddress);
        setLoading(false);

        if (success) {
            setSuccess('Withdrawal request submitted successfully!');
            updateUser({ balance: user.balance - numAmount });
            setAmount('');
            setWalletAddress('');
            const userHistory = await api.getUserWithdrawalHistory(user.id);
            setHistory(userHistory.reverse());
        } else {
            setError('Failed to submit request. Please try again.');
        }
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'approved': return 'bg-green-500/20 text-green-300';
            case 'rejected': return 'bg-red-500/20 text-red-300';
            default: return 'bg-yellow-500/20 text-yellow-300';
        }
    }

    return (
        <div className="flex flex-col animate-slide-up">
            <button onClick={() => setView('main')} className="self-start mb-6 px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition">
                &larr; Back to Dashboard
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-center text-brand-primary mb-4">Request Withdrawal</h2>
                    <p className="text-center text-slate-400 mb-6">Minimum withdrawal is $10.00 via Binance USDT.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-center bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
                        {success && <div className="text-center bg-green-500/20 text-green-300 p-3 rounded-lg">{success}</div>}
                        
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">Amount (USD)</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="e.g., 15.50"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="wallet" className="block text-sm font-medium text-slate-300 mb-1">Binance Wallet Address (USDT)</label>
                            <input
                                type="text"
                                id="wallet"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="Your wallet address"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary disabled:opacity-50 transition">
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-center text-brand-primary mb-4">Withdrawal History</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {history.length > 0 ? history.map(item => (
                            <div key={item.id} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-brand-light">${item.amount.toFixed(2)}</p>
                                    <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 pt-8">No withdrawal history found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawPage;
