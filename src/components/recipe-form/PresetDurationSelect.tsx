import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export default function PresetDurationSelect({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();

  const presets = [
    { label: t("forms.durationPresets.quick"), value: "PT5M" },
    { label: t("forms.durationPresets.short"), value: "PT15M" },
    { label: t("forms.durationPresets.medium"), value: "PT30M" },
    { label: t("forms.durationPresets.long"), value: "PT1H" },
    { label: t("forms.durationPresets.veryLong"), value: "PT2H" },
  ];

  const handlePresetChange = (presetValue: string) => {
    if (!presetValue) return;
    onChange(presetValue);
  };

  return (
    <div className="w-full">
      <Select onValueChange={handlePresetChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={t("forms.presetDurationPlaceholder")} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
