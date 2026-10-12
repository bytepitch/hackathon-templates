import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/items',
        // Feature pages load on demand, so each one only adds to its own download
        lazy: async () => ({
          Component: (await import('@/features/items/ItemsPage')).ItemsPage,
        }),
      },
      // `npm run gen` adds new feature pages above this line
      { path: '*', element: <NotFound /> },
    ],
  },
]);
