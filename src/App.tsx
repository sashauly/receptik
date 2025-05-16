import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import RecipePage from "@/pages/RecipePage";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import { ensureLatestDbSchema } from "./data/db";
import { logDebug, logError } from "./lib/utils/logger";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import Home from "./pages/Home/index";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";

function App() {
  // const isDevelopment = import.meta.env.DEV;
  // const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");
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
    <ErrorBoundary>
      <Router basename="/receptik/">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes/create" element={<CreateRecipePage />} />
            <Route path="/recipes/:slug" element={<RecipePage />} />
            <Route path="/recipes/:slug/edit" element={<EditRecipePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />

        {/* {isDevelopment && isSmallDevice && <VirtualKeyboardSimulator />} */}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
