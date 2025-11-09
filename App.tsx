
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PaymentPage from './pages/PaymentPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Page } from './types';
import { UserStatus } from './types';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
    const { user, loading, isAdmin } = useAuth();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    if (loading || showSplash) {
        return <SplashScreen />;
    }

    const renderPage = () => {
        if (isAdmin) {
             return <AdminDashboard setCurrentPage={setCurrentPage} />;
        }
        if (user) {
            switch (user.status) {
                case UserStatus.PENDING_PAYMENT:
                case UserStatus.PENDING_APPROVAL:
                    return <PaymentPage setCurrentPage={setCurrentPage} />;
                case UserStatus.ACTIVE:
                    return <UserDashboard setCurrentPage={setCurrentPage} />;
                default:
                    return <LandingPage setCurrentPage={setCurrentPage} />;
            }
        }

        switch (currentPage) {
            case Page.LOGIN:
                return <LoginPage setCurrentPage={setCurrentPage} />;
            case Page.SIGNUP:
                return <SignUpPage setCurrentPage={setCurrentPage} />;
            case Page.ADMIN_LOGIN:
                return <LoginPage setCurrentPage={setCurrentPage} isAdminLogin={true} />;
            default:
                return <LandingPage setCurrentPage={setCurrentPage} />;
        }
    };

    return <div className="min-h-screen bg-brand-dark text-brand-light font-sans">{renderPage()}</div>;
};

const SplashScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark">
        <div className="w-24 h-24 mb-4">
            <svg className="w-full h-full text-brand-primary animate-pulse-fast" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-brand-primary">TapReward</h1>
        <p className="text-brand-light mt-2">Loading your earnings...</p>
    </div>
);


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
