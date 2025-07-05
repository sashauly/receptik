import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import RecipePage from "@/pages/RecipePage";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import Home from "./pages/Home/index";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import ReloadPrompt from "./components/ReloadPrompt";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config.ts";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import CookingModePage from "./pages/CookingModePage";
import { useEffect } from "react";
import { ensureLatestDbSchema } from "./data/db";
import { logDebug, logError } from "./lib/utils/logger.ts";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

const basename = (import.meta.env.VITE_BASE_URL || "/") as string;

export default function App() {
  useEffect(() => {
    ensureLatestDbSchema().catch((err) => {
      logError("Error upgrading database schema:", err);
    });

    if (localStorage.getItem("db_upgrade_pending") === "true") {
      localStorage.removeItem("db_upgrade_pending");
      logDebug("Database schema upgrade completed");
    }
  }, []);

  return (
    <ErrorBoundary componentName="App">
      <SettingsProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <SidebarProvider>
              <Router basename={basename}>
                <Layout>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ErrorBoundary componentName="HomePage">
                          <Home />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/recipes/create"
                      element={
                        <ErrorBoundary componentName="CreateRecipePage">
                          <CreateRecipePage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/recipes/:slug"
                      element={
                        <ErrorBoundary componentName="RecipePage">
                          <RecipePage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/recipes/:slug/edit"
                      element={
                        <ErrorBoundary componentName="EditRecipePage">
                          <EditRecipePage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ErrorBoundary componentName="SettingsPage">
                          <SettingsPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/cook/:slug"
                      element={
                        <ErrorBoundary componentName="CookingModePage">
                          <CookingModePage />
                        </ErrorBoundary>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <Toaster position="top-center" />
                <ReloadPrompt />
              </Router>
            </SidebarProvider>
          </I18nextProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
