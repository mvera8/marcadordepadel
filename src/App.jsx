import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './error-page';
import { HomePage } from './pages/Home.page';

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