import { Book, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-orange-600" />
            <h1 className="font-bold text-xl tracking-tight">
              Recipe Notebook
            </h1>
          </Link>

          {isHomePage ? (
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/?create=true">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Recipe
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/">Back to Recipes</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
