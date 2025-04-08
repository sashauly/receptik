import Footer from "./layout/Footer";
import Header from "./layout/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}
