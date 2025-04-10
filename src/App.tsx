import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import RecipeNotebook from "@/pages/RecipeNotebook";
import RecipeDetailsPage from "@/pages/RecipeDetailsPage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router basename="/receptik/">
      <Layout>
        <Routes>
          <Route path="/" element={<RecipeNotebook />} />
          <Route path="/recipes/:slug" element={<RecipeDetailsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
