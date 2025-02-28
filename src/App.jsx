import { MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './error-page';
import { HomePage } from './pages/Home.page';

import '@mantine/core/styles.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
		errorElement: <ErrorPage />,
  }
]);

export default function App() {
  return (
    <MantineProvider>
       <RouterProvider router={router} />
    </MantineProvider>
  );
}