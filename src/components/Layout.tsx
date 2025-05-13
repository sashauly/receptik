import { useMediaQuery } from "@/hooks/useMediaQuery";
import DesktopHeader from "./layout/DesktopHeader";
import Footer from "./layout/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  return (
    <div className="flex flex-col min-h-screen">
      {!isSmallDevice && <DesktopHeader />}

      <main className="flex-grow">{children}</main>

      {!isSmallDevice && <Footer />}
    </div>
  );
}
