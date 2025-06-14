import { deleteDatabase } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  className?: string;
  t: TFunction;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  timestamp?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    logError("ErrorBoundary caught an error:", error, errorInfo);
  }

  private renderStackContent(content: string) {
    return (
      <div className="w-full overflow-x-auto">
        <pre className="text-xs font-mono bg-muted/50 p-2 rounded whitespace-pre">
          {content}
        </pre>
      </div>
    );
  }

  private formatError(error: Error): string {
    return `${error.name}: ${error.message}\n${error.stack || ""}`;
  }

  private formatComponentStack(componentStack: string): string {
    return componentStack
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .join("\n");
  }

  public render(): ReactNode {
    const { t } = this.props;
    const onResetAllData = async () => {
      try {
        await deleteDatabase();
        window.location.reload();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logError(err);
      }
    };

    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "An error occurred";

      return (
        this.props.fallback || (
          <div
            className={cn(
              "rounded-lg border bg-destructive/10 p-4 max-w-full",
              this.props.className
            )}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-medium text-destructive break-words">
                    {t("errorBoundary.errorInComponent", {
                      componentName: this.props.componentName || "component",
                    })}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      {t("errorBoundary.refresh")}
                    </Button>
                    <ResetDataButton onReset={onResetAllData} t={t} />
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    {t("errorBoundary.showErrorDetails")}
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <p>
                      <strong>{t("errorBoundary.time")}:</strong>{" "}
                      {this.state.timestamp}
                    </p>
                    <p className="break-words">
                      <strong>{t("errorBoundary.message")}:</strong>{" "}
                      {errorMessage}
                    </p>
                    {this.state.error?.stack && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">
                          {t("errorBoundary.stackTrace")}:
                        </p>
                        {this.renderStackContent(
                          this.formatError(this.state.error)
                        )}
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">
                          {t("errorBoundary.componentStack")}:
                        </p>
                        {this.renderStackContent(
                          this.formatComponentStack(
                            this.state.errorInfo.componentStack
                          )
                        )}
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

interface ResetDataButtonProps {
  onReset: () => void;
  t: TFunction;
}

const ResetDataButton = ({ onReset, t }: ResetDataButtonProps) => {
  return (
    <>
      <ResponsiveDialog>
        <ResponsiveDialogTrigger>
          <Button variant="destructive" size="sm">
            {t("errorBoundary.resetData")}
          </Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {t("settings.resetAllData")}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {t("errorBoundary.resetDataConfirm")}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <Button variant="outline">{t("common.cancel")}</Button>
            <Button variant="destructive" onClick={onReset}>
              {t("errorBoundary.resetData")}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};

// Wrap the ErrorBoundary with a function component to use hooks
const ErrorBoundaryWithTranslation = (props: Omit<Props, "t">) => {
  const { t } = useTranslation();
  return <ErrorBoundary {...props} t={t} />;
};

export default ErrorBoundaryWithTranslation;
