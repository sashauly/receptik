import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TimeInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ name, value, onChange, onBlur, disabled }, ref) => {
    const { t } = useTranslation();

    const [hourInput, setHourInput] = useState<string>("");
    const [minuteInput, setMinuteInput] = useState<string>("");

    useEffect(() => {
      const totalMinutes = typeof value === "number" ? value : 0;
      setHourInput(Math.floor(totalMinutes / 60).toString());
      setMinuteInput((totalMinutes % 60).toString());
    }, [value]);

    const handleHourInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputString = e.target.value;
        setHourInput(inputString);

        const currentHours = parseInt(inputString, 10) || 0;
        const currentMinutes = parseInt(minuteInput, 10) || 0;

        onChange(currentHours * 60 + currentMinutes);
      },
      [minuteInput, onChange]
    );

    const handleMinuteInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputString = e.target.value;
        setMinuteInput(inputString);

        const currentHours = parseInt(hourInput, 10) || 0;
        const currentMinutes = parseInt(inputString, 10) || 0;

        if (currentMinutes > 59) {
          const additionalHours = Math.floor(currentMinutes / 60);
          const remainingMinutes = currentMinutes % 60;

          setHourInput(
            (parseInt(hourInput, 10) || 0 + additionalHours).toString()
          );
          setMinuteInput(remainingMinutes.toString());

          onChange((currentHours + additionalHours) * 60 + remainingMinutes);
        } else {
          onChange(currentHours * 60 + currentMinutes);
        }
      },
      [hourInput, onChange]
    );

    const handleBlur = useCallback(() => {
      if (onBlur) {
        onBlur();
      }
    }, [onBlur]);

    return (
      <div ref={ref} className="space-y-2" onBlur={handleBlur}>
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
              value={hourInput}
              min="0"
              onChange={handleHourInputChange}
              placeholder={t("forms.hours")}
              disabled={disabled}
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
              value={minuteInput}
              min="0"
              max="59"
              onChange={handleMinuteInputChange}
              placeholder={t("forms.minutes")}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";

export default TimeInput;
