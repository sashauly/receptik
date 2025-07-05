import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function Footer() {
  const { t } = useTranslation("translation", { keyPrefix: "common" });

  const currentYear = new Date().getFullYear();

  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          The source code is available on{" "}
          <Link
            to="https://github.com/sashauly/receptik"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          . {`${currentYear} ${t("appName")}.`}
        </p>
      </div>
    </div>
  );
}
