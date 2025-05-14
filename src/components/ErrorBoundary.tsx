import { idbStorage } from "@/lib/storage";
import { logError } from "@/lib/utils/logger";
import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
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
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render(): ReactNode {
    const onResetAllData = async () => {
      try {
        await idbStorage.deleteDatabase();
        window.location.reload();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logError(err);
      }
    };
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="container mx-auto py-6 px-4 pt-18 md:px-6 space-y-2">
            <div className="py-12 px-8 border rounded-lg bg-muted/30">
              <h2 className="text-2xl font-medium">Something went wrong.</h2>
              <p>
                Please try refreshing the page or contact the administrator.
              </p>
              <details className="text-muted-foreground whitespace-pre-wrap">
                {this.state.error?.toString()}
              </details>
              <div className="flex justify-end gap-2">
                <Button onClick={() => window.location.assign("/")}>
                  Go to Home
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button variant="destructive" onClick={onResetAllData}>
                  Reset All Data
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
