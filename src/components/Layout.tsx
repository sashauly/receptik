// import { useAuth0 } from '@auth0/auth0-react';
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { BookOpen, Plus, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Recipe Notebook</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {/* {isAuthenticated ? ( */}
            {/* <> */}
            <Link to="/create-recipe">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Recipe
              </Button>
            </Link>
            <Link to="/my-recipes">
              <Button>My Recipes</Button>
            </Link>
            <Link to="/profile">
              <Button>
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Button

            // onClick={() => logout()}
            >
              Logout
            </Button>
            {/* </> */}
            {/*  ) : (
              <Button
                 variant="default"
                 
                 onClick={() => loginWithRedirect()}
               >
                 Login
               </Button>
             )} */}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Recipe Notebook. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
