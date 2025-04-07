import Footer from "./layout/Footer";
import Header from "./layout/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
