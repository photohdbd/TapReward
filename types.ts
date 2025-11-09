import type { Dispatch, SetStateAction } from 'react';

export enum Page {
    LANDING = 'LANDING',
    LOGIN = 'LOGIN',
    SIGNUP = 'SIGNUP',
    PAYMENT = 'PAYMENT',
    DASHBOARD = 'DASHBOARD',
    ADMIN_LOGIN = 'ADMIN_LOGIN',
    ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export enum UserStatus {
    PENDING_PAYMENT = 'pending_payment',
    PENDING_APPROVAL = 'pending_approval',
    ACTIVE = 'active',
    REJECTED = 'rejected',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    status: UserStatus;
    balance: number;
    tapsToday: number;
    lastTapDate: string;
    referrals: number;
    referralLevel: number;
    lastCheckIn: string;
    lastDailyTask: string;
    spinsToday: number;
    lastSpinDate: string;
}

export interface WithdrawalRequest {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    walletAddress: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
}

export interface PaymentRequest {
    id: string;
    userId: string;
    userName: string;
    email: string;
    transactionId: string;
    date: string;
}

// FIX: To resolve 'Cannot find namespace React' error, Dispatch and SetStateAction types are now imported from 'react' and used directly.
export type SetPage = Dispatch<SetStateAction<Page>>;