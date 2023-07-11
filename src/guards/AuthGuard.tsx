import { ReactNode } from 'react';
// pages
import Login from '../pages/auth/Login';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const isLogged = Cookies.get('logged');

  if (!isLogged) {
    return <Login />;
  }

  return <>{children}</>;
}
