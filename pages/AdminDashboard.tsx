import React, { useState, useEffect, useCallback } from 'react';
import { Page, SetPage, User, PaymentRequest, WithdrawalRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/mockApi';

type AdminView = 'dashboard' | 'users' | 'payments' | 'withdrawals';

const AdminDashboard: React.FC<{ setCurrentPage: SetPage }> = ({ setCurrentPage }) => {
    const { logout } = useAuth();
    const [view, setView] = useState<AdminView>('dashboard');

    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const icons: { [key in AdminView]: React.ReactElement } = {
        dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
        users: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 14a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        payments: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        withdrawals: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    };

    const NavButton: React.FC<{ targetView: AdminView, label: string }> = ({ targetView, label }) => (
        <button
            onClick={() => setView(targetView)}
            className={`w-full flex items-center px-4 py-2 rounded-lg transition ${view === targetView ? 'bg-brand-primary text-brand-dark font-bold' : 'hover:bg-slate-700'}`}
        >
            {icons[targetView]}
            {label}
        </button>
    );

    return (
        <div className="min-h-screen flex bg-brand-dark text-brand-light">
            <nav className="w-64 bg-slate-900 p-4 flex-shrink-0 flex flex-col">
                <div className="flex items-center mb-8">
                    <svg className="w-8 h-8 text-brand-primary mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                    <h1 className="text-2xl font-bold text-brand-light">Admin</h1>
                </div>

                <div className="space-y-2 flex-grow">
                    <NavButton targetView="dashboard" label="Dashboard" />
                    <NavButton targetView="users" label="Users List" />
                    <NavButton targetView="payments" label="Approve Accounts" />
                    <NavButton targetView="withdrawals" label="Withdraw Requests" />
                </div>
                 <div className="space-y-2">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 rounded-lg transition hover:bg-slate-700">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Back to Site
                    </button>
                     <button onClick={logout} className="w-full flex items-center px-4 py-2 rounded-lg transition hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                 </div>
            </nav>
            <main className="flex-grow p-8 overflow-y-auto">
                {view === 'dashboard' && <DashboardView />}
                {view === 'users' && <UsersView />}
                {view === 'payments' && <PaymentsView />}
                {view === 'withdrawals' && <WithdrawalsView />}
            </main>
        </div>
    );
};

const DashboardView = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalWithdrawals: 0, totalDeposits: 0 });
    useEffect(() => {
        const fetchStats = async () => {
            const users = await api.getAllUsers();
            const withdrawals = await api.getWithdrawalRequests();
            const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved');
            const totalWithdrawn = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
            const activeUsers = users.filter(u => u.status === 'active');
            setStats({
                totalUsers: users.length,
                totalWithdrawals: totalWithdrawn,
                totalDeposits: activeUsers.length * 20, // Simplified calculation
            });
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl"><p className="text-slate-400">Total Users</p><p className="text-4xl font-bold text-brand-primary">{stats.totalUsers}</p></div>
                <div className="bg-slate-800 p-6 rounded-xl"><p className="text-slate-400">Total Approved Withdrawals</p><p className="text-4xl font-bold text-brand-primary">${stats.totalWithdrawals.toFixed(2)}</p></div>
                <div className="bg-slate-800 p-6 rounded-xl"><p className="text-slate-400">Total Deposits</p><p className="text-4xl font-bold text-brand-primary">${stats.totalDeposits.toFixed(2)}</p></div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => { api.getAllUsers().then(setUsers); }, []);
    
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Users List</h2>
            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full max-w-md bg-slate-700 p-2 rounded-lg mb-4" />
            <div className="bg-slate-800 rounded-xl overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-900"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Balance</th><th className="p-4">Status</th></tr></thead><tbody>
                {filteredUsers.map(user => (<tr key={user.id} className="border-b border-slate-700">
                    <td className="p-4">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4">${user.balance.toFixed(2)}</td><td className="p-4 capitalize">{user.status.replace('_', ' ')}</td>
                </tr>))}
            </tbody></table></div>
        </div>
    );
};

const PaymentsView = () => {
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const fetchPayments = useCallback(() => { api.getPendingPayments().then(setPayments); }, []);
    useEffect(() => { fetchPayments(); }, [fetchPayments]);
    
    const handleApprove = async (paymentId: string, userId: string) => {
        await api.approvePayment(paymentId, userId);
        fetchPayments();
    };

    const handleReject = async (paymentId: string, userId: string) => {
        await api.rejectPayment(paymentId, userId);
        fetchPayments();
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Pending Account Approvals</h2>
            <div className="space-y-4">
                {payments.length > 0 ? payments.map(p => (
                    <div key={p.id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-bold">{p.userName} <span className="text-sm text-slate-400">({p.email})</span></p>
                            <p className="text-sm text-brand-primary break-all">TxID: {p.transactionId}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleApprove(p.id, p.userId)} className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500">Approve</button>
                            <button onClick={() => handleReject(p.id, p.userId)} className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500">Reject</button>
                        </div>
                    </div>
                )) : <p className="text-slate-400">No pending payments.</p>}
            </div>
        </div>
    );
};

const WithdrawalsView = () => {
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const fetchWithdrawals = useCallback(() => { api.getWithdrawalRequests().then(setWithdrawals); }, []);
    useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

    const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
        await api.updateWithdrawalStatus(id, status);
        fetchWithdrawals();
    };

    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Withdrawal Requests</h2>
             <div className="space-y-4">
                {pendingWithdrawals.length > 0 ? pendingWithdrawals.map(w => (
                    <div key={w.id} className="bg-slate-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg">{w.userName} - <span className="text-brand-primary">${w.amount.toFixed(2)}</span></p>
                                <p className="text-sm text-slate-400 break-all">Wallet: {w.walletAddress}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleUpdate(w.id, 'approved')} className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500">Approve</button>
                                <button onClick={() => handleUpdate(w.id, 'rejected')} className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500">Reject</button>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-slate-400">No pending withdrawal requests.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;