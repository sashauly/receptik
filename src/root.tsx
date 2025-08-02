import { ComponentType, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import i18n from "./i18n/config.ts";
import { Spinner } from "./components/ui/spinner.tsx";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <Suspense fallback={<Spinner>Loading...</Spinner>}>
        <ErrorBoundary componentName="App">
          <SettingsProvider>
            <ThemeProvider>
              <I18nextProvider i18n={i18n}>
                <App />
              </I18nextProvider>
            </ThemeProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </Suspense>
    </StrictMode>
  );
}

export default render;
