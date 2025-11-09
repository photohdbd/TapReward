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
        </div>
    );
};

export default LoginPage;