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

export function formatTime(minutes: number, t: TFunction) {
  const timeObj = convertMinutesToObject(minutes);
  const timeString = `${timeObj.hours}${t("common.hourShort")} ${timeObj.minutes}${t("common.minuteShort")}`;
  const isoString = convertObjToIso(timeObj);
  return { timeString, isoString };
}
