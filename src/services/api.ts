import axios from 'axios';
import type { User } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Demo accounts for testing both roles */
export const demoAccounts: Record<string, { password: string; user: User }> = {
  'requester@bloodsos.ai': {
    password: 'demo123',
    user: {
      id: 'u-requester',
      name: 'Dr. Ramesh Kumar',
      email: 'requester@bloodsos.ai',
      phone: '+91 98765 43210',
      bloodGroup: 'O+',
      role: 'recipient',
      location: 'Chennai',
    },
  },
  'donor@bloodsos.ai': {
    password: 'demo123',
    user: {
      id: 'd1',
      name: 'Arjun Sharma',
      email: 'donor@bloodsos.ai',
      phone: '+91 98765 43210',
      bloodGroup: 'O+',
      role: 'donor',
      location: 'Anna Nagar, Chennai',
    },
  },
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(600);
    if (!email || !password) throw new Error('Email and password are required');

    const account = demoAccounts[email.toLowerCase()];
    if (account && account.password === password) {
      return account.user;
    }

    // Allow any email/password combo as a fallback requester for flexibility
    if (email && password.length >= 6) {
      return {
        id: 'u1',
        name: 'Demo User',
        email,
        phone: '+91 98765 43210',
        bloodGroup: 'O+',
        role: 'recipient',
        location: 'Chennai',
      };
    }

    throw new Error('Invalid credentials. Use requester@bloodsos.ai or donor@bloodsos.ai with password demo123');
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    bloodGroup: string;
    role: string;
    location: string;
  }): Promise<User> {
    await delay(800);
    const user: User = {
      id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      bloodGroup: data.bloodGroup as User['bloodGroup'],
      role: data.role as User['role'],
      location: data.location,
    };
    return user;
  },
};

export default api;
