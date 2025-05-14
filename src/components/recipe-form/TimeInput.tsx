import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TimeInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ name, value, onChange }, ref) => {
    const { t } = useTranslation();

    const totalMinutes = typeof value === "number" ? value : 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHours = parseInt(e.target.value, 10) || 0;
      onChange(newHours * 60 + minutes);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinutes = parseInt(e.target.value, 10) || 0;
      onChange(hours * 60 + newMinutes);
    };

    return (
      <div ref={ref} className="space-y-2">
        <div className="flex gap-2 items-center">
          <div className="w-1/2">
            <Label
              htmlFor={`${name}-hours`}
              className="text-sm text-muted-foreground"
            >
              {t("forms.hours")}
            </Label>
            <Input
              id={`${name}-hours`}
              type="number"
              value={hours}
              min="0"
              onChange={handleHoursChange}
              placeholder={t("forms.hours")}
            />
          </div>
          <div className="w-1/2">
            <Label
              htmlFor={`${name}-minutes`}
              className="text-sm text-muted-foreground"
            >
              {t("forms.minutes")}
            </Label>
            <Input
              id={`${name}-minutes`}
              type="number"
              value={minutes}
              min="0"
              max="59"
              onChange={handleMinutesChange}
              placeholder={t("forms.minutes")}
            />
          </div>
        </div>
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";

export default TimeInput;
