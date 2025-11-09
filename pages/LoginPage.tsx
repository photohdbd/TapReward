import React, { useState } from 'react';
import { Page, SetPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
    setCurrentPage: SetPage;
    isAdminLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage, isAdminLogin = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login, adminLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isAdminLogin) {
                const success = await adminLogin('', password);
                if (!success) {
                    setError('Invalid admin credentials.');
                }
            } else {
                const user = await login(email, password);
                if (!user) {
                    setError('Invalid email or password.');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const pageTitle = isAdminLogin ? "Admin Login" : "Welcome Back!";
    const pageSubtitle = isAdminLogin ? "Enter the admin password to access the panel." : "Login to continue your earning journey.";
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-dark">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-lg animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary">{pageTitle}</h1>
                    <p className="text-slate-400 mt-2">{pageSubtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                     {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
                    {!isAdminLogin && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary disabled:opacity-50 transition">
                        {loading ? 'Logging in...' : (isAdminLogin ? 'Login as Admin' : 'Login')}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    {!isAdminLogin && (
                        <button onClick={() => setShowForgotPassword(true)} className="font-semibold text-slate-400 hover:text-brand-primary hover:underline">
                            Forgot Password?
                        </button>
                    )}
                </div>
                <div className="mt-6 text-center text-sm">
                    {isAdminLogin ? (
                         <p className="text-slate-400">
                           <button onClick={() => setCurrentPage(Page.LANDING)} className="font-semibold text-brand-primary hover:underline">
                                &larr; Back to Home
                            </button>
                        </p>
                    ) : (
                        <p className="text-slate-400">
                            Don't have an account?{' '}
                            <button onClick={() => setCurrentPage(Page.SIGNUP)} className="font-semibold text-brand-primary hover:underline">
                                Sign Up
                            </button>
                        </p>
                    )}
                </div>
            </div>
            {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
        </div>
    );
};

const ForgotPasswordModal: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger an API call.
        // For this mock app, we'll just show the success message.
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-brand-primary mb-4">Reset Password</h2>
                {submitted ? (
                    <div className="text-center">
                        <p className="text-slate-300">If an account with that email exists, a password reset link has been sent.</p>
                        <button onClick={onClose} className="mt-4 w-full py-2 px-4 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className="text-slate-300 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary mb-4"
                            placeholder="you@example.com"
                            required
                        />
                        <button type="submit" className="w-full py-2 px-4 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary">
                            Send Reset Link
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;