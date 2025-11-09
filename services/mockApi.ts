import { User, UserStatus, WithdrawalRequest, PaymentRequest } from '../types';

const USERS_KEY = 'tapreward_users';
const PAYMENTS_KEY = 'tapreward_payments';
const WITHDRAWALS_KEY = 'tapreward_withdrawals';
const CURRENT_USER_ID_KEY = 'tapreward_current_user_id';
const IS_ADMIN_KEY = 'tapreward_is_admin';

const getFromStorage = <T,>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

const saveToStorage = <T,>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Initialize with some data if it's the first time
const initialize = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        saveToStorage<User[]>(USERS_KEY, []);
    }
    if (!localStorage.getItem(PAYMENTS_KEY)) {
        saveToStorage<PaymentRequest[]>(PAYMENTS_KEY, []);
    }
    if (!localStorage.getItem(WITHDRAWALS_KEY)) {
        saveToStorage<WithdrawalRequest[]>(WITHDRAWALS_KEY, []);
    }
};
initialize();

// --- Auth ---

export const signup = async (name: string, email: string, password: string): Promise<User | null> => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    if (users.some(u => u.email === email)) {
        return null; // User exists
    }
    const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        status: UserStatus.PENDING_PAYMENT,
        balance: 0,
        tapsToday: 0,
        lastTapDate: new Date().toISOString().split('T')[0],
        referrals: 0,
        referralLevel: 1,
        lastCheckIn: '',
        lastDailyTask: '',
        spinsToday: 0,
        lastSpinDate: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    saveToStorage(USERS_KEY, users);
    saveToStorage(CURRENT_USER_ID_KEY, newUser.id);
    return newUser;
};

export const login = async (email: string, password: string): Promise<User | null> => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        saveToStorage(CURRENT_USER_ID_KEY, user.id);
        saveToStorage(IS_ADMIN_KEY, false);
        return user;
    }
    return null;
};

export const adminLogin = async (password: string): Promise<boolean> => {
    if (password === 'password') {
        saveToStorage(IS_ADMIN_KEY, true);
        localStorage.removeItem(CURRENT_USER_ID_KEY);
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
};

export const getCurrentUser = (): User | null => {
    const userId = getFromStorage<string>(CURRENT_USER_ID_KEY);
    if (!userId) return null;
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    return users.find(u => u.id === userId) || null;
};

export const getIsAdmin = (): boolean => {
    return getFromStorage<boolean>(IS_ADMIN_KEY) || false;
};

// --- User Data ---

export const submitPayment = async (userId: string, transactionId: string): Promise<User | null> => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = UserStatus.PENDING_APPROVAL;
        saveToStorage(USERS_KEY, users);
        
        const payments = getFromStorage<PaymentRequest[]>(PAYMENTS_KEY) || [];
        const newPayment: PaymentRequest = {
            id: `payment_${Date.now()}`,
            userId,
            userName: user.name,
            email: user.email,
            transactionId,
            date: new Date().toISOString(),
        };
        payments.push(newPayment);
        saveToStorage(PAYMENTS_KEY, payments);

        return user;
    }
    return null;
};

export const updateUserInDb = (user: User) => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        saveToStorage(USERS_KEY, users);
    }
};

export const submitWithdrawalRequest = async (userId: string, amount: number, walletAddress: string): Promise<boolean> => {
    const user = getCurrentUser();
    if (!user || user.balance < amount) return false;

    const withdrawals = getFromStorage<WithdrawalRequest[]>(WITHDRAWALS_KEY) || [];
    const newRequest: WithdrawalRequest = {
        id: `wd_${Date.now()}`,
        userId,
        userName: user.name,
        amount,
        walletAddress,
        status: 'pending',
        date: new Date().toISOString(),
    };
    withdrawals.push(newRequest);
    saveToStorage(WITHDRAWALS_KEY, withdrawals);
    
    user.balance -= amount;
    updateUserInDb(user);

    return true;
};

export const getUserWithdrawalHistory = async (userId: string): Promise<WithdrawalRequest[]> => {
    const allWithdrawals = getFromStorage<WithdrawalRequest[]>(WITHDRAWALS_KEY) || [];
    return allWithdrawals.filter(w => w.userId === userId);
};

// --- Admin Data ---

export const getAllUsers = async (): Promise<User[]> => {
    return getFromStorage<User[]>(USERS_KEY) || [];
};

export const getPendingPayments = async (): Promise<PaymentRequest[]> => {
    return getFromStorage<PaymentRequest[]>(PAYMENTS_KEY) || [];
};

export const getWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
    return getFromStorage<WithdrawalRequest[]>(WITHDRAWALS_KEY) || [];
};

export const approvePayment = async (paymentId: string, userId: string): Promise<boolean> => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = UserStatus.ACTIVE;
        saveToStorage(USERS_KEY, users);
        
        const payments = (getFromStorage<PaymentRequest[]>(PAYMENTS_KEY) || []).filter(p => p.id !== paymentId);
        saveToStorage(PAYMENTS_KEY, payments);
        return true;
    }
    return false;
};

export const rejectPayment = async (paymentId: string, userId: string): Promise<boolean> => {
    const users = getFromStorage<User[]>(USERS_KEY) || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = UserStatus.REJECTED;
        saveToStorage(USERS_KEY, users);
        
        const payments = (getFromStorage<PaymentRequest[]>(PAYMENTS_KEY) || []).filter(p => p.id !== paymentId);
        saveToStorage(PAYMENTS_KEY, payments);
        return true;
    }
    return false;
};

export const updateWithdrawalStatus = async (withdrawalId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    const withdrawals = getFromStorage<WithdrawalRequest[]>(WITHDRAWALS_KEY) || [];
    const request = withdrawals.find(w => w.id === withdrawalId);
    if (request) {
        request.status = status;

        if (status === 'rejected') {
            const users = getFromStorage<User[]>(USERS_KEY) || [];
            const user = users.find(u => u.id === request.userId);
            if (user) {
                user.balance += request.amount;
                saveToStorage(USERS_KEY, users);
            }
        }

        saveToStorage(WITHDRAWALS_KEY, withdrawals);
        return true;
    }
    return false;
};