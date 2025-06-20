import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimerDisplayProps {
  initialTimeInSeconds: number;
  onTimerEnd: () => void;
  onTimerStart?: () => void;
}

function TimerDisplay({
  initialTimeInSeconds,
  onTimerEnd,
  onTimerStart,
}: TimerDisplayProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const [progressValue, setProgressValue] = useState(
    Math.floor((timeLeft / initialTimeInSeconds) * 100)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = useCallback((time: number) => {
    return time < 10 ? `0${time}` : `${time}`;
  }, []);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          setIsPaused(false);
          onTimerEnd();
          return 0;
        }
        return prevTimeLeft - 1;
      });

      setProgressValue(Math.floor((timeLeft / initialTimeInSeconds) * 100));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    isRunning,
    isPaused,
    onTimerEnd,
    progressValue,
    timeLeft,
    initialTimeInSeconds,
  ]);

  useEffect(() => {
    setTimeLeft(initialTimeInSeconds);
  }, [initialTimeInSeconds]);

  const handleStartPause = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
    } else if (isRunning) {
      setIsPaused(true);
    } else {
      setIsRunning(true);
      setIsPaused(false);
      if (onTimerStart) {
        onTimerStart();
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialTimeInSeconds);
  };

  const displayHours = formatTime(hours);
  const displayMinutes = formatTime(minutes);
  const displaySeconds = formatTime(seconds);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-bold tabular-nums">
        <span>{displayHours}</span>:<span>{displayMinutes}</span>:
        <span>{displaySeconds}</span>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleStartPause}>
          {isPaused
            ? t("timer.resume")
            : isRunning
              ? t("timer.pause")
              : t("timer.start")}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isRunning && !isPaused}
        >
          {t("timer.reset")}
        </Button>
      </div>

      <Progress value={progressValue} />
    </div>
  );
}

export default TimerDisplay;
