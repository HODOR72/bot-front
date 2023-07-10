import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const isLogged = Cookies.get('logged');
  console.log(isLogged);
  Cookies.set('logged', 'True');
  // if (!isLogged) {
  // return <Login />;
  // return <Navigate to="/dashboard/index" />;
  // }

  // if (isLogged) {
  //   return <Navigate to="/dashboard/index" />;
  // }

  return <>{children}</>;
}

// export default function AuthGuard({ children }: AuthGuardProps) {
//   const { isAuthenticated, isInitialized } = useAuth();

//   const { pathname } = useLocation();

//   const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

//   if (!isInitialized) {
//     return <LoadingScreen />;
//   }

//   if (!isAuthenticated) {
//     if (pathname !== requestedLocation) {
//       setRequestedLocation(pathname);
//     }
//     return <Login />;
//   }

//   if (requestedLocation && pathname !== requestedLocation) {
//     setRequestedLocation(null);
//     return <Navigate to={requestedLocation} />;
//   }

//   return <>{children}</>;
// }
