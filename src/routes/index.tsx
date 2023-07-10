import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import GuestGuard from '../guards/GuestGuard';
import Login from '../pages/auth/Login';
import useAuth from '../hooks/useAuth';
import PermissionGuard from '../guards/PermissionGuard';
import PageErrors from '../pages/PageErrors';
import AuthGuard from 'src/guards/AuthGuard';
// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard/index" replace />,
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/index" replace />, index: true },
        { path: 'index', element: <PageIndex /> },
        { path: 'errors', element: <PageErrors /> },
        {
          path: 'users',
          children: [
            {
              element: (
                <PermissionGuard action="edit" model="users">
                  <UserList />
                </PermissionGuard>
              ),
              index: true,
            },
            { path: 'account', element: <UserAccount /> },
            {
              path: 'new',
              element: (
                <PermissionGuard action="edit" model="users">
                  <UserCreate />
                </PermissionGuard>
              ),
            },
            {
              path: ':id/edit',
              element: (
                <PermissionGuard action="edit" model="users">
                  <UserCreate />
                </PermissionGuard>
              ),
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '403', element: <NoAccess /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Dashboard
const PageIndex = Loadable(lazy(() => import('../pages/PageIndex')));
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/user/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/user/UserCreate')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const NoAccess = Loadable(lazy(() => import('../pages/Page403')));
