import { calculateTotalTime, formatDuration } from "@/lib/utils/time";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DurationInput } from "./DurationInput";

const TimeFields = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const [totalTime, setTotalTime] = useState<string>("PT0S");

  const prepTime = watch("prepTime");
  const cookTime = watch("cookTime");

  useEffect(() => {
    setTotalTime(calculateTotalTime(prepTime, cookTime));
  }, [prepTime, cookTime]);

  const totalTimeString = formatDuration(totalTime, t);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DurationInput name="prepTime" label={t("forms.prepTime")} />

        <DurationInput name="cookTime" label={t("forms.cookTime")} />
      </div>

      <div className="flex items-center p-4 bg-muted rounded-md">
        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{t("forms.totalTime")}</p>
          <p className="text-sm text-muted-foreground">{totalTimeString}</p>
        </div>
      </div>
    </>
  );
};

export default TimeFields;
