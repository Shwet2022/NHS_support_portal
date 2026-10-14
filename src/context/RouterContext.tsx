import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | '/'
  | '/support/'
  | '/registrationrequest/'
  | '/SignIn'
  | '/knowledgebase/'
  | '/dashboard/'
  | '/FasterPayment-support/'
  | '/client-portal/'
  | '/maternity-support/';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string, replace?: boolean) => void;
  queryParams: Record<string, string>;
  setQueryParam: (key: string, value: string | null) => void;
  normalizedRoute: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Normalize incoming paths to our canonical route paths
export function normalizePath(path: string): string {
  // Strip origin if present
  let clean = path.replace(/^https?:\/\/[^/]+/, '');
  // Strip query string and hash
  clean = clean.split('?')[0].split('#')[0];

  if (!clean || clean === '' || clean === '/') return '/';

  const lower = clean.toLowerCase();

  if (lower === '/signin' || lower === '/signin/' || clean === '/SignIn' || clean === '/SignIn/') {
    return '/SignIn';
  }
  if (lower === '/support' || lower === '/support/') {
    return '/support/';
  }
  if (lower === '/registrationrequest' || lower === '/registrationrequest/') {
    return '/registrationrequest/';
  }
  if (lower === '/knowledgebase' || lower === '/knowledgebase/') {
    return '/knowledgebase/';
  }
  if (lower === '/dashboard' || lower === '/dashboard/') {
    return '/dashboard/';
  }
  if (lower === '/fasterpayment-support' || lower === '/fasterpayment-support/' || lower.includes('fasterpayment')) {
    return '/FasterPayment-support/';
  }
  if (lower === '/client-portal' || lower === '/client-portal/') {
    return '/client-portal/';
  }
  if (lower === '/maternity-support' || lower === '/maternity-support/') {
    return '/maternity-support/';
  }

  // Preserve trailing slash standard if unknown
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function parseQueryParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params: Record<string, string> = {};
  const search = window.location.search;
  if (!search) return params;
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((val, key) => {
    params[key] = val;
  });
  return params;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => parseQueryParams());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setQueryParams(parseQueryParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    // If the link is an external link (starts with http)
    if (to.startsWith('http://') || to.startsWith('https://')) {
      window.location.href = to;
      return;
    }

    const [targetPath, searchPart] = to.split('?');
    const canonicalPath = normalizePath(targetPath);
    const fullTarget = searchPart ? `${canonicalPath}?${searchPart}` : canonicalPath;

    if (replace) {
      window.history.replaceState({}, '', fullTarget);
    } else {
      window.history.pushState({}, '', fullTarget);
    }

    setCurrentPath(canonicalPath);
    setQueryParams(parseQueryParams());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setQueryParam = useCallback((key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.history.replaceState({}, '', url.toString());
    setQueryParams(parseQueryParams());
  }, []);

  const normalizedRoute = normalizePath(currentPath);

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        queryParams,
        setQueryParam,
        normalizedRoute,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
