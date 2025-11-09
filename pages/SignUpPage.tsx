import React, { useState } from 'react';
import { Page, SetPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface SignUpPageProps {
    setCurrentPage: SetPage;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setCurrentPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const user = await signup(name, email, password);
            if (!user) {
                setError('An account with this email already exists.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-dark">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-lg animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary">Create Your Account</h1>
                    <p className="text-slate-400 mt-2">Join us and start earning today!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                 <div className="mt-6 text-center text-sm">
                    <p className="text-slate-400">
                        Already have an account?{' '}
                        <button onClick={() => setCurrentPage(Page.LOGIN)} className="font-semibold text-brand-primary hover:underline">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
