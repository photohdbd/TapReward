
import React, { useState } from 'react';
import { Page, SetPage, UserStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/mockApi';

interface PaymentPageProps {
    setCurrentPage: SetPage;
}

const BINANCE_USDT_WALLET = "0x1234ABCD5678EFGH9101IJKL"; // Example wallet

const PaymentPage: React.FC<PaymentPageProps> = ({ setCurrentPage }) => {
    const { user, updateUser, logout } = useAuth();
    const [showCheckout, setShowCheckout] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayNow = () => {
        setShowCheckout(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(BINANCE_USDT_WALLET);
        alert('Wallet ID copied to clipboard!');
    };

    const handleSubmitTxID = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionId.trim()) {
            setError('Please enter a valid Transaction ID.');
            return;
        }
        setError('');
        setLoading(true);
        if (user) {
            const updatedUser = await api.submitPayment(user.id, transactionId);
            if (updatedUser) {
                updateUser({ status: updatedUser.status });
            }
        }
        setLoading(false);
        setShowCheckout(false);
    };

    if (!user) {
        return (
            <div className="p-4 text-center">
                <p>You need to be logged in to view this page.</p>
                <button onClick={() => setCurrentPage(Page.LOGIN)} className="mt-4 px-4 py-2 bg-brand-primary text-brand-dark rounded-lg">Go to Login</button>
            </div>
        );
    }
    
    if (user.status === UserStatus.PENDING_APPROVAL) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-brand-dark animate-fade-in">
                <div className="w-20 h-20 text-brand-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-brand-light">Waiting For Approval</h1>
                <p className="mt-2 text-slate-300 max-w-md">
                    Your payment is being verified. This usually takes 3-4 hours. Please be patient. You will be able to access your dashboard once your account is approved.
                </p>
                 <button onClick={logout} className="mt-8 px-6 py-2 bg-slate-700 text-brand-light rounded-lg hover:bg-slate-600 transition">
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-brand-dark animate-fade-in">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-lg max-w-lg w-full">
                <h1 className="text-3xl font-extrabold text-brand-primary">Account Activation Required</h1>
                <p className="mt-4 text-slate-300">A one-time fee is required to activate your account and unlock all earning features.</p>
                <div className="my-8 p-6 bg-slate-900 rounded-lg">
                    <p className="text-lg text-slate-400">Activation Fee</p>
                    <p className="text-5xl font-bold text-brand-light">20 USD</p>
                </div>
                <button
                    onClick={handlePayNow}
                    className="w-full px-8 py-4 bg-brand-primary text-brand-dark font-bold text-lg rounded-lg shadow-lg hover:bg-brand-secondary transform hover:scale-105 transition-all duration-300"
                >
                    Pay Now
                </button>
                 <button onClick={logout} className="mt-4 text-sm text-slate-400 hover:text-brand-primary transition">
                    Logout
                </button>
            </div>

            {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                        <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h2 className="text-2xl font-bold text-brand-primary mb-4">Complete Your Payment</h2>
                        <p className="text-slate-300 mb-2">1. Send exactly <strong className="text-brand-light">20 USDT</strong> (TRC-20) to the address below.</p>
                        <div className="flex items-center space-x-2 bg-slate-900 p-3 rounded-lg mb-4">
                            <input type="text" readOnly value={BINANCE_USDT_WALLET} className="bg-transparent text-brand-light w-full outline-none text-sm"/>
                            <button onClick={handleCopy} className="p-2 bg-brand-primary rounded-md text-brand-dark hover:bg-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>
                            </button>
                        </div>
                        <p className="text-slate-300 mb-2">2. After sending, enter the Transaction ID (TxID) below.</p>
                        <form onSubmit={handleSubmitTxID} className="space-y-4">
                             {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="Enter Transaction ID (TxID)"
                                required
                            />
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Transaction ID'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
