// src\App.tsx
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import LogonPage from "./pages/LogonPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Machine from "./pages/Machine";

const App = () => {
  // const theme = createMuiTheme(mode);

  // Create a router that uses the native browser history under the hood.
  const router = createBrowserRouter(
    // Create a route for each top-level route.
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={<LogonPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:storeId/:machineId"
          element={
            <ProtectedRoute>
              <Machine />
            </ProtectedRoute>
          }
        />
      </Route>,
    ),
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
