import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import { HomePage } from "./pages/Home.page";
import { CreateTournamentPage } from "./pages/CreateTournament.page";
import { MatchPage } from "./pages/Match.page";
import { PlayTournamentPage } from "./pages/PlayTournament.page";
import { Tournaments } from "./pages/Tournaments.page";

import "@mantine/core/styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/match",
    element: <MatchPage />,
  },
  {
    path: "/create-tournament",
    element: <CreateTournamentPage />,
  },
  {
    path: "/tournament",
    element: <Tournaments />,
  },
	,
  {
    path: "/tournament/:tournamentId",
    element: <PlayTournamentPage />,
  },
]);

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
