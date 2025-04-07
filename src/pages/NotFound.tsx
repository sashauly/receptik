export default function NotFound() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    </div>
  );
}
