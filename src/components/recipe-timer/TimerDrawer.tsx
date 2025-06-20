import TimerDisplay from "@/components/recipe-timer/TimerDisplay";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  requestNotificationPermission,
  sendNotification,
} from "@/lib/notificationService";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimerDrawerProps {
  children: React.ReactNode;
}

function TimerDrawer({ children }: TimerDrawerProps) {
  const { t } = useTranslation();

  const [setHours, setSetHours] = useState<string>("0");
  const [setMinutes, setSetMinutes] = useState<string>("0");
  const [setSeconds, setSetSeconds] = useState<string>("0");

  const [initialTimerSeconds, setInitialTimerSeconds] = useState(0);
  const [isTimerSet, setIsTimerSet] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalSetSeconds =
    (parseInt(setHours, 10) || 0) * 3600 +
    (parseInt(setMinutes, 10) || 0) * 60 +
    (parseInt(setSeconds, 10) || 0);

  const handleSetTimer = () => {
    if (totalSetSeconds > 0) {
      setInitialTimerSeconds(totalSetSeconds);
      setIsTimerSet(true);
    } else {
      setIsTimerSet(false);
    }
  };

  const handleClearTimer = () => {
    setIsTimerSet(false);
    setInitialTimerSeconds(0);
    setSetHours("0");
    setSetMinutes("0");
    setSetSeconds("0");
  };

  useEffect(() => {
    if (isDrawerOpen) {
      requestNotificationPermission();
    }
  }, [isDrawerOpen]);

  const handleTimerStart = () => {
    sendNotification(t("timer.notification.startTitle"), {
      body: t("timer.notification.startBody"),
      tag: "timer-running",
      // renotify: true,
      silent: true,
    });
  };

  const handleTimerEnd = useCallback(() => {
    sendNotification(t("timer.notification.endTitle"), {
      body: t("timer.notification.endBody"),
      // vibrate: [200, 100, 200],
      tag: "timer-complete",
      // renotify: true,
    });

    setIsTimerSet(false);
    setInitialTimerSeconds(0);
    setSetHours("0");
    setSetMinutes("0");
    setSetSeconds("0");
  }, [t]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t("timer.setTimerTitle")}</DrawerTitle>
            <DrawerDescription>
              {t("timer.setTimerDescription")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            {isTimerSet ? (
              <TimerDisplay
                initialTimeInSeconds={initialTimerSeconds}
                onTimerEnd={handleTimerEnd}
                onTimerStart={handleTimerStart}
              />
            ) : (
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="hours">{t("time.hours")}</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    value={setHours}
                    onChange={(e) => setSetHours(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="minutes">{t("time.minutes")}</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={setMinutes}
                    onChange={(e) => setSetMinutes(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="seconds">{t("time.seconds")}</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={setSeconds}
                    onChange={(e) => setSetSeconds(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>
          <DrawerFooter>
            {isTimerSet ? (
              <Button onClick={handleClearTimer} variant="outline">
                {t("timer.clearTimer")}
              </Button>
            ) : (
              <Button onClick={handleSetTimer}>{t("timer.setTimer")}</Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">{t("common.cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default TimerDrawer;
