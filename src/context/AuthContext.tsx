import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  registerUser: (data: Partial<User>) => Promise<{ success: boolean; user?: User }>;
  canAccessRoute: (route: string) => { allowed: boolean; requiresAuth: boolean; requiresManager: boolean };
  activeRole: UserRole | 'anonymous';
}

const STORAGE_KEY = 'support_portal_session_v1';

export interface DummyAccount {
  email: string;
  alternateId: string;
  passwordHint: string;
  user: User;
  description: string;
}

export const DEMO_MANAGER: User = {
  id: 'usr-mgr-001',
  name: 'Sarah Jenkins',
  email: 'manager@sbs.nhs.uk',
  role: 'manager',
  department: 'Finance & Operations Management',
  staffId: 'SBS-MGR-8849',
  trustName: 'NHS Shared Business Services',
  avatarInitials: 'SJ',
};

export const DEMO_EMPLOYEE: User = {
  id: 'usr-emp-002',
  name: 'David Clarke',
  email: 'employee@sbs.nhs.uk',
  role: 'employee',
  department: 'Clinical Ward Staffing Support',
  staffId: 'SBS-EMP-4102',
  trustName: 'Leeds Teaching Hospitals NHS Trust',
  avatarInitials: 'DC',
};

export const DEMO_EMPLOYEE_2: User = {
  id: 'usr-emp-003',
  name: 'Rachel Adams',
  email: 'rachel@sbs.nhs.uk',
  role: 'employee',
  department: 'Community Health & Nursing',
  staffId: 'SBS-EMP-5510',
  trustName: 'Leeds Teaching Hospitals NHS Trust',
  avatarInitials: 'RA',
};

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  {
    email: 'manager@sbs.nhs.uk',
    alternateId: 'sbs-mgr-8849',
    passwordHint: 'Password123!',
    user: DEMO_MANAGER,
    description: 'Manager role: Knowledge Base, My Support, Dashboard, Faster Payments, Client Portal, Parental Leave, and all staff cases.',
  },
  {
    email: 'employee@sbs.nhs.uk',
    alternateId: 'sbs-emp-4102',
    passwordHint: 'Password123!',
    user: DEMO_EMPLOYEE,
    description: 'Employee role: My Support only, displaying only David Clarke’s own submitted cases.',
  },
  {
    email: 'rachel@sbs.nhs.uk',
    alternateId: 'sbs-emp-5510',
    passwordHint: 'Password123!',
    user: DEMO_EMPLOYEE_2,
    description: 'Secondary employee: My Support only, displaying only Rachel Adams’s own submitted cases.',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        if (parsed && (parsed.role === 'manager' || parsed.role === 'employee')) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemo = useCallback((role: UserRole) => {
    const account = role === 'manager' ? DEMO_MANAGER : DEMO_EMPLOYEE;
    setUser(account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = useCallback(
    async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 250));

      const cleanInput = email.trim().toLowerCase();

      // Check Manager matches
      if (
        cleanInput === 'manager@sbs.nhs.uk' ||
        cleanInput === 'sarah.jenkins@sbs-portal.org' ||
        cleanInput === 'sbs-mgr-8849' ||
        cleanInput === 'mgr-88492' ||
        cleanInput === 'manager'
      ) {
        setUser(DEMO_MANAGER);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_MANAGER));
        setIsLoading(false);
        return { success: true };
      }

      // Check Primary Employee (David Clarke) matches
      if (
        cleanInput === 'employee@sbs.nhs.uk' ||
        cleanInput === 'david.clarke@sbs-portal.org' ||
        cleanInput === 'sbs-emp-4102' ||
        cleanInput === 'employee' ||
        cleanInput === 'david'
      ) {
        setUser(DEMO_EMPLOYEE);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_EMPLOYEE));
        setIsLoading(false);
        return { success: true };
      }

      // Check Secondary Employee (Rachel Adams) matches
      if (
        cleanInput === 'rachel@sbs.nhs.uk' ||
        cleanInput === 'rachel.adams@sbs.nhs.uk' ||
        cleanInput === 'rachel.adams@sbs-portal.org' ||
        cleanInput === 'sbs-emp-5510' ||
        cleanInput === 'rachel'
      ) {
        setUser(DEMO_EMPLOYEE_2);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_EMPLOYEE_2));
        setIsLoading(false);
        return { success: true };
      }

      // Custom email sign-in fallback
      if (cleanInput.includes('@')) {
        const isManager = cleanInput.includes('manager') || cleanInput.includes('lead') || cleanInput.includes('admin');
        const customUser: User = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: cleanInput.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: cleanInput,
          role: isManager ? 'manager' : 'employee',
          department: isManager ? 'Operations Management' : 'NHS Clinical Support Staff',
          staffId: `SBS-${Math.floor(1000 + Math.random() * 9000)}`,
          trustName: 'NHS Trust Member Services',
          avatarInitials: cleanInput.slice(0, 2).toUpperCase(),
        };
        setUser(customUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid staff credentials. Use manager@sbs.nhs.uk or employee@sbs.nhs.uk with Password123!',
      };
    },
    []
  );

  const registerUser = useCallback(async (data: Partial<User>): Promise<{ success: boolean; user?: User }> => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: data.name || 'New Staff Member',
      email: data.email || 'staff@nhs.net',
      role: data.role || 'employee',
      department: data.department || 'Clinical Support',
      staffId: data.staffId || `SBS-${Math.floor(1000 + Math.random() * 9000)}`,
      trustName: data.trustName || 'NHS Foundation Trust',
      avatarInitials: (data.name || 'NS').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const canAccessRoute = useCallback(
    (route: string): { allowed: boolean; requiresAuth: boolean; requiresManager: boolean } => {
      const path = route.split('?')[0];

      // Public routes
      const publicRoutes = ['/', '/support/', '/registrationrequest/', '/SignIn'];
      if (publicRoutes.includes(path)) {
        return { allowed: true, requiresAuth: false, requiresManager: false };
      }

      // Manager-only routes: Knowledge Base, Dashboard, Faster Payments, Client Portal, Parental Leave
      const managerOnlyRoutes = [
        '/dashboard/',
        '/knowledgebase/',
        '/FasterPayment-support/',
        '/client-portal/',
        '/maternity-support/',
      ];
      if (managerOnlyRoutes.includes(path)) {
        if (!user) {
          return { allowed: false, requiresAuth: true, requiresManager: true };
        }
        if (user.role !== 'manager') {
          return { allowed: false, requiresAuth: false, requiresManager: true };
        }
        return { allowed: true, requiresAuth: true, requiresManager: true };
      }

      // Default allow public or 404
      return { allowed: true, requiresAuth: false, requiresManager: false };
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        registerUser,
        canAccessRoute,
        activeRole: user ? user.role : 'anonymous',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
