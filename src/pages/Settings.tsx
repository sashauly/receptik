import ThemeSelect from "@/components/ThemeSelect";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      <div className="space-y-4">
        <ThemeSelect />

        <Separator />

        <p className="text-muted-foreground">
          Coming soon! Stay tuned for updates.
        </p>
      </div>
    </div>
  );
}
