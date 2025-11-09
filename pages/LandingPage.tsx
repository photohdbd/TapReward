import React from 'react';
import { Page, SetPage } from '../types';

interface LandingPageProps {
    setCurrentPage: SetPage;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-brand-dark animate-fade-in">
            <div className="max-w-2xl">
                <div className="w-24 h-24 mb-4 mx-auto">
                     <svg className="w-full h-full text-brand-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                </div>
                <h1 className="text-5xl font-extrabold text-brand-primary">Welcome to TapReward</h1>
                <p className="mt-4 text-lg text-slate-300">
                    The easiest way to earn rewards online. Complete simple tasks, refer friends, and watch your earnings grow every day.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => setCurrentPage(Page.SIGNUP)}
                        className="px-8 py-4 bg-brand-primary text-brand-dark font-bold text-lg rounded-lg shadow-lg hover:bg-brand-secondary transform hover:scale-105 transition-all duration-300"
                    >
                        Get Started Now
                    </button>
                    <button
                        onClick={() => setCurrentPage(Page.LOGIN)}
                        className="px-8 py-4 bg-slate-700 text-brand-light font-bold text-lg rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-300"
                    >
                        Login
                    </button>
                </div>
                 <button onClick={() => setCurrentPage(Page.ADMIN_LOGIN)} className="mt-8 text-xs text-slate-500 hover:text-slate-400 transition">
                    Admin Login
                </button>
            </div>
        </div>
    );
};

export default LandingPage;