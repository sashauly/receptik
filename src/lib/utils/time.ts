import { TFunction } from "i18next";
import { Temporal } from "temporal-polyfill";
import { logError } from "./logger";

export function parseDuration(isoString: string): Temporal.Duration {
  try {
    return Temporal.Duration.from(isoString || "PT0S");
  } catch (error) {
    logError("Error parsing duration:", error);
    return Temporal.Duration.from("PT0S");
  }
}

export function calculateTotalTime(prepTime: string, cookTime: string): string {
  try {
    const prepDuration = Temporal.Duration.from(prepTime || "PT0S");
    const cookDuration = Temporal.Duration.from(cookTime || "PT0S");

    const totalDuration = prepDuration.add(cookDuration);

    return totalDuration.toString();
  } catch (error) {
    logError("Error calculating total time:", error);
    return "PT0S";
  }
}

export function formatDuration(isoString: string, t: TFunction): string {
  try {
    const duration = Temporal.Duration.from(isoString || "PT0S");
    const parts: string[] = [];

    if (duration.hours > 0) {
      parts.push(`${duration.hours}${t("time.hourShort")}`);
    }

    if (duration.minutes > 0 || (duration.hours > 0 && duration.seconds > 0)) {
      parts.push(`${duration.minutes}${t("time.minuteShort")}`);
    }

    if (
      duration.seconds > 0 ||
      (duration.hours === 0 && duration.minutes === 0)
    ) {
      parts.push(`${duration.seconds}${t("time.secondShort")}`);
    }

    return parts.join(" ") || `0${t("time.minuteShort")}`;
  } catch (error) {
    logError("Error formatting duration:", error);
    return "Invalid duration";
  }
}

export function formatHumanReadable(duration: Temporal.Duration): string {
  const parts: string[] = [];

  if (duration.hours > 0) {
    parts.push(`${duration.hours}h`);
  }

  if (duration.minutes > 0 || (duration.hours > 0 && duration.seconds > 0)) {
    parts.push(`${duration.minutes}m`);
  }

  if (
    duration.seconds > 0 ||
    (duration.hours === 0 && duration.minutes === 0)
  ) {
    parts.push(`${duration.seconds}s`);
  }

  return parts.join(" ") || "0m";
}
