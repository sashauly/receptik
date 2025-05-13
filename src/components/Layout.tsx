import { useMediaQuery } from "@/hooks/useMediaQuery";
import Footer from "./layout/Footer";
import DesktopHeader from "./layout/DesktopHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  return (
    <div className="flex flex-col min-h-screen">
      {!isSmallDevice && <DesktopHeader />}

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
