import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import RecipePage from "@/pages/RecipePage";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import NotFound from "./pages/NotFound";
import RecipeNotebook from "./pages/RecipeNotebook/index";
import Settings from "./pages/Settings";

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/receptik/">
        <Layout>
          <Routes>
            <Route path="/" element={<RecipeNotebook />} />
            <Route path="/recipes/create" element={<CreateRecipePage />} />
            <Route path="/recipes/:slug" element={<RecipePage />} />
            <Route path="/recipes/:slug/edit" element={<EditRecipePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
