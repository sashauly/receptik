import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatHumanReadable, parseDuration } from "@/utils/time";
import { Clock, Minus, Plus } from "lucide-react";
import type * as React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Temporal } from "temporal-polyfill";

const MINUTES_STEP = 5;

interface DurationInputProps {
  name: string;
  label?: string;
}

export function DurationInput({ name, label }: DurationInputProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const effectiveLabel = label || t("forms.presetDuration");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const duration = parseDuration(field.value);
        const { hours, minutes } = duration;

        const updateDuration = (newHours: number, newMinutes: number) => {
          const finalHours = Math.max(newHours, 0);
          const finalMinutes = Math.max(newMinutes, 0);

          const newDuration = Temporal.Duration.from({
            hours: finalHours,
            minutes: finalMinutes,
          });
          field.onChange(newDuration.toString());
        };

        const handleIncrement = (unit: "hours" | "minutes") => {
          let newHours = hours;
          let newMinutes = minutes;

          if (unit === "hours") {
            newHours += 1;
          } else if (unit === "minutes") {
            if (newMinutes === 59) {
              newMinutes = 0;
              newHours += 1;
            } else {
              newMinutes += MINUTES_STEP;
            }
          }

          updateDuration(newHours, newMinutes);
        };

        const handleDecrement = (unit: "hours" | "minutes") => {
          let newHours = hours;
          let newMinutes = minutes;

          if (unit === "hours") {
            newHours = Math.max(newHours - 1, 0);
          } else if (unit === "minutes") {
            if (newMinutes === 0) {
              if (newHours > 0) {
                newMinutes = 59;
                newHours -= 1;
              } else {
                newMinutes = 0;
              }
            } else {
              newMinutes -= MINUTES_STEP;
            }
          }

          updateDuration(newHours, newMinutes);
        };

        const handleInputChange = (
          e: React.ChangeEvent<HTMLInputElement>,
          unit: "hours" | "minutes"
        ) => {
          const value = Number.parseInt(e.target.value, 10);
          const numericValue = isNaN(value) ? 0 : value;

          let newHours = hours;
          let newMinutes = minutes;

          if (unit === "hours") {
            newHours = numericValue;
          } else if (unit === "minutes") {
            newMinutes = numericValue;

            if (newMinutes > 59) {
              const additionalHours = Math.floor(newMinutes / 60);
              const remainingMinutes = newMinutes % 60;
              newHours += additionalHours;
              newMinutes = remainingMinutes;
            }
          }

          updateDuration(newHours, newMinutes);
        };

        return (
          <FormItem className="space-y-2">
            <div className="flex items-center justify-between space-x-2">
              <FormLabel htmlFor={`${name}-hours`}>{effectiveLabel}</FormLabel>

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {hours > 0 || minutes > 0 ? (
                    <span className="font-medium">
                      {formatHumanReadable(duration, t)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {t("forms.noDuration")}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {/* <PresetDurationSelect onChange={field.onChange} /> */}

              <div className="grid grid-cols-2 gap-2">
                {/* Hours Input */}
                <div className="space-y-1">
                  <Label htmlFor={`${name}-hours`} className="text-xs">
                    {t("time.hours")}
                  </Label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-r-none"
                      onClick={() => handleDecrement("hours")}
                      disabled={hours === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        id={`${name}-hours`}
                        type="number"
                        min="0"
                        className="h-10 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={hours}
                        onChange={(e) => handleInputChange(e, "hours")}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-l-none"
                      onClick={() => handleIncrement("hours")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Minutes Input */}
                <div className="space-y-1">
                  <Label htmlFor={`${name}-minutes`} className="text-xs">
                    {t("time.minutes")}
                  </Label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-r-none"
                      onClick={() => handleDecrement("minutes")}
                      disabled={minutes === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        id={`${name}-minutes`}
                        type="number"
                        min="0"
                        className="h-10 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={minutes}
                        onChange={(e) => handleInputChange(e, "minutes")}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-l-none"
                      onClick={() => handleIncrement("minutes")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
