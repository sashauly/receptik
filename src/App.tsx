import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import MyRecipes from "@/pages/MyRecipes";
import CreateRecipe from "@/pages/CreateRecipe";
import RecipeDetails from "@/pages/RecipeDetails";
import Profile from "@/pages/Profile";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import EditRecipe from "./pages/EditRecipe";

function App() {
  return (
    <MantineProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </MantineProvider>
  );
}

export default App;
