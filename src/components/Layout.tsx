import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileNavigation from "./layout/MobileNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "./layout/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMediaQuery("screen and (max-width: 768px)");

  if (isMobile) {
    return (
      <>
        <div className="w-full flex flex-col items-center pb-20 md:pb-0 transition-all duration-300 ease-in-out">
          {children}
        </div>

        <MobileNavigation />
      </>
    );
  }
  return (
    <>
      <Sidebar
        currentSearchTerm=""
        setCurrentSearchTerm={() => {}}
        recipes={[]}
      />
      <div className="relative flex flex-col min-h-full w-full">
        <main className="flex-1">{children}</main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
