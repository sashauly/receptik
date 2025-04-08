import { Book, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2"
          title="Go to homepage"
        >
          <Book className="h-6 w-6 text-orange-600" />
          <h1 className="font-bold text-xl tracking-tight">Recipe Notebook</h1>
        </Link>

        {isHomePage ? (
          <div className="flex items-center space-x-2">
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/?create=true" title="Add a new recipe">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Recipe
              </Link>
            </Button>
            <Button asChild>
              <Link to="/settings" title="Settings">
                <Settings />
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild variant="outline">
            <Link to="/" title="Back to recipes">
              Back to Recipes
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
