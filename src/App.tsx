import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import BiographyPage from "./pages/BiographyPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* ---------------- PROTECTED ROUTE WRAPPER ---------------- */

const ProtectedRoutes = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

/* ---------------- APP ---------------- */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root redirects */}
          <Route path="/" element={<Navigate to="/search" replace />} />

          {/* Protected */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/biography/:id" element={<BiographyPage />} />
            <Route path="/recommendations/:id" element={<RecommendationsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
