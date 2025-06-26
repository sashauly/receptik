import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileNavigation from "./layout/MobileNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row flex-grow pb-20 md:pb-0 transition-all duration-300 ease-in-out">
        {children}
      </div>

      {isMobile && <MobileNavigation />}
    </div>
  );
}
