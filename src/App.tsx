import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import ReloadPrompt from "./components/ReloadPrompt";
import { useEffect } from "react";
import { ensureLatestDbSchema } from "./data/db";
import { logDebug, logError } from "./lib/utils/logger.ts";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import lazyLoad from "./utils/loader/loader.tsx";

const HomePage = lazyLoad(() => import('@/pages/Home/index'));
const CreateRecipePage = lazyLoad(() => import('@/pages/CreateRecipePage'));
const RecipePage = lazyLoad(() => import('@/pages/RecipePage'));
const EditRecipePage = lazyLoad(() => import('@/pages/EditRecipePage'));
const SettingsPage = lazyLoad(() => import('@/pages/SettingsPage'));
const CookingModePage = lazyLoad(() => import('@/pages/CookingModePage'));
const NotFoundPage = lazyLoad(() => import('@/pages/NotFoundPage'));


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
    <SidebarProvider>
      <Router basename={basename}>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary componentName="HomePage">
                  <HomePage />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />
        <ReloadPrompt />
      </Router>
    </SidebarProvider>
  );
}
