import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Theme, useTheme } from "@/context/ThemeContext";

export default function ThemeSelect() {
  const { theme, setTheme, activeTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-options">Theme</Label>
      <Select
        defaultValue={theme}
        onValueChange={(value) => setTheme(value as Theme)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent id="theme-options">
          <SelectItem value="system">{`System (${activeTheme})`}</SelectItem>{" "}
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
