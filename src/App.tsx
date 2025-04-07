import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import RecipeNotebook from "@/pages/RecipeNotebook";
import RecipeDetailsPage from "@/pages/RecipeDetailsPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <Router basename="/recipe-management-pwa/">
        <Layout>
          <Routes>
            <Route path="/" element={<RecipeNotebook />} />
            <Route path="/recipes/:slug" element={<RecipeDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
