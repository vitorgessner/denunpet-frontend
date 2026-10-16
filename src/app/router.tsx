import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserType } from '@/features/auth/types';
import { MyReportsPage } from '@/features/reports/pages/MyReportsPage';
import { PendingReportsPage } from '@/features/reports/pages/PendingReportsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/my-reports" replace />
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: "/my-reports", element: <MyReportsPage /> },
        ],
      },
    ]
  },
  {
    element: <ProtectedRoute userType={UserType.ONG} />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: "/pending-reports", element: <PendingReportsPage /> },
        ],
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/animals" replace />
  }
]);

export function AppRouter() {
  return (
    <RouterProvider router={router} />
  )
}
