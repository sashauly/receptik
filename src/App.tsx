import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import RecipePage from "@/pages/RecipePage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import RecipeNotebook from "./pages/RecipeNotebook/index";

function App() {
  return (
    <Router basename="/receptik/">
      <Layout>
        <Routes>
          <Route path="/" element={<RecipeNotebook />} />
          <Route path="/recipes/:slug" element={<RecipePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
