import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  title,
  children,
  className,
}: ContentLayoutProps) {
  return (
    <>
      <Header title={title} />
      <div
        className={cn(
          "flex justify-center flex-1 py-2 md:py-4 px-4 sm:px-6",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
