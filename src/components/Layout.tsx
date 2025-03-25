import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { BookOpen, Plus, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-bold">Recipe Notebook</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/create-recipe">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Recipe
              </Button>
            </Link>
            <Link to="/my-recipes">
              <Button>My Recipes</Button>
            </Link>
            <Link to="/profile">
              <Button>
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto">{children}</main>

      <footer className="mt-auto border-t">
        <div className="container px-4 py-6 mx-auto text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} Recipe Notebook. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
