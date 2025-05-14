import { TFunction } from "i18next";
import { Temporal } from "temporal-polyfill";

export function convertObjToIso(obj: {
  hours: number;
  minutes: number;
}): string {
  return Temporal.Duration.from({
    hours: obj.hours,
    minutes: obj.minutes,
  }).toString();
}

export function convertMinutesToObject(minutes: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return { hours, minutes: remainingMinutes };
}

export function formatTime(
  minutes: number,
  t: TFunction
): { timeString: string; isoString: string } {
  let timeString = "";
  let isoString = "";
  const timeObj = convertMinutesToObject(minutes);
  if (timeObj.hours === 0 && timeObj.minutes === 0) {
    timeString = t("common.lessThanMinute");
    isoString = "PT0S";
    return { timeString, isoString };
  } else if (timeObj.hours === 0 && timeObj.minutes > 0) {
    timeString = `${timeObj.minutes}${t("common.minuteShort")}`;
  } else if (timeObj.hours > 0 && timeObj.minutes === 0) {
    timeString = `${timeObj.hours}${t("common.hourShort")}`;
  } else {
    timeString = `${timeObj.hours}${t("common.hourShort")} ${timeObj.minutes}${t(
      "common.minuteShort"
    )}`;
  }
  isoString = convertObjToIso(timeObj);
  return { timeString, isoString };
}
