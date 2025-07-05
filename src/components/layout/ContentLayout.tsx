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
          "container py-8 pt-2 pb-0 md:py-8 px-4 sm:px-8",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
