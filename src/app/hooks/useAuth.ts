// Custom hook for authentication

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  const hasRole = (role: string | string[]) => {
    if (!auth.user) return false;
    if (Array.isArray(role)) {
      return role.includes(auth.user.role);
    }
    return auth.user.role === role;
  };
  
  const isAdmin = () => hasRole('admin');
  const isHRManager = () => hasRole(['admin', 'hr_manager']);
  const isEmployee = () => hasRole('employee');
  
  return {
    ...auth,
    hasRole,
    isAdmin,
    isHRManager,
    isEmployee,
  };
};
