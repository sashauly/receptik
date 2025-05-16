import { cn } from "@/lib/utils";
import { logDebug, logInfo, logWarn } from "@/lib/utils/logger";
import { useCallback, useEffect, useRef, useState } from "react";

const layouts = {
  lowercase: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", "⌫"],
    ["?123", "Space", "Enter"],
  ],
  uppercase: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ["?123", "Space", "Enter"],
  ],
  numbersSymbols: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
    ["Shift", ".", ",", "?", "!", "'", "⌫"],
    ["Letters", "Space", "Enter"],
  ],
};

const VirtualKeyboardSimulator = ({
  enableAutoScroll = true,
  keyboardHeight = 300,
}) => {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isKeyboardDismissing, setIsKeyboardDismissing] = useState(false);
  const [currentLayout, setCurrentLayout] =
    useState<keyof typeof layouts>("lowercase");
  const [isShifted, setIsShifted] = useState(false);
  const keyboardOverlayRef = useRef(null);
  const originalScrollPositionRef = useRef<null | number>(null);
  const blurTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  logDebug("MobileKeyboardSimulator component rendered");

  const insertText = useCallback(
    (text: string) => {
      if (!activeElement) {
        logWarn("insertText called but no active element found");
        return;
      }

      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        const start = activeElement.selectionStart || 0;
        const end = activeElement.selectionEnd || 0;
        const value = activeElement.value;

        const newValue =
          value.substring(0, start) + text + value.substring(end);
        activeElement.value = newValue;

        activeElement.selectionStart = activeElement.selectionEnd =
          start + text.length;

        const inputEvent = new Event("input", { bubbles: true });
        activeElement.dispatchEvent(inputEvent);
      } else if (activeElement.isContentEditable) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          const textNode = document.createTextNode(text);
          range.insertNode(textNode);

          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);

          const inputEvent = new Event("input", { bubbles: true });
          activeElement.dispatchEvent(inputEvent);
        }
      }

      if (isShifted && currentLayout === "uppercase") {
        setIsShifted(false);
        setCurrentLayout("lowercase");
      }
    },
    [activeElement, isShifted, currentLayout]
  );

  const handleBackspace = useCallback(() => {
    if (!activeElement) {
      logWarn("handleBackspace called but no active element found");
      return;
    }

    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement
    ) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;

      if (start === end) {
        if (start > 0) {
          activeElement.value =
            value.substring(0, start - 1) + value.substring(end);
          activeElement.selectionStart = activeElement.selectionEnd = start - 1;
        }
      } else {
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start;
      }

      const inputEvent = new Event("input", { bubbles: true });
      activeElement.dispatchEvent(inputEvent);
    } else if (activeElement.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          range.deleteContents();
        } else {
          range.setStart(range.startContainer, range.startOffset - 1);
          range.deleteContents();
        }
      }
    }
  }, [activeElement]);

  const dismissKeyboard = useCallback(() => {
    logInfo("Dismissing keyboard");

    setIsKeyboardDismissing(true);

    setTimeout(() => {
      logDebug("Keyboard dismissal timeout completed");
      if (activeElement) {
        logDebug("Blurring active element:", activeElement);
        activeElement.blur();
      }
      setIsKeyboardVisible(false);
      setIsKeyboardDismissing(false);
      setActiveElement(null);
      setCurrentLayout("lowercase");
      setIsShifted(false);

      if (originalScrollPositionRef.current !== null) {
        logDebug(
          "Restoring original scroll position:",
          originalScrollPositionRef.current
        );
        window.scrollTo(0, originalScrollPositionRef.current);
        originalScrollPositionRef.current = null;
      }
    }, 300);
  }, [activeElement]);

  const createFocusHandler = useCallback(() => {
    logDebug("Creating focus handler");
    return (e: Event) => {
      logDebug("Focus handler triggered", e.target);

      if (blurTimeoutRef.current) {
        logDebug("Clearing pending blur timeout");
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      const targetElement = e.target as HTMLElement;
      setActiveElement(targetElement);
      setIsKeyboardVisible(true);
      setIsKeyboardDismissing(false);

      logInfo("Keyboard becoming visible on focus of", targetElement);

      if (enableAutoScroll) {
        logDebug("Auto-scroll enabled");

        originalScrollPositionRef.current = window.scrollY;
        logDebug(
          "Original scroll position stored:",
          originalScrollPositionRef.current
        );

        const targetElement = e.target as HTMLElement;
        const rect = targetElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        logDebug("Input element rect:", rect);
        logDebug("Viewport height:", viewportHeight);

        let scrollAmount = window.scrollY;

        const idealBottom = viewportHeight - keyboardHeight - 20;

        if (rect.bottom > idealBottom) {
          scrollAmount = window.scrollY + (rect.bottom - idealBottom);
          logDebug(
            `Scrolling up to make element visible above keyboard. Current bottom: ${rect.bottom}, Ideal bottom: ${idealBottom}`
          );
        } else if (rect.top < 20) {
          scrollAmount = window.scrollY + (rect.top - 20);
          logDebug(
            `Scrolling down to bring element into view with padding. Current top: ${rect.top}`
          );
        }

        logDebug("Calculated scroll amount:", scrollAmount);

        window.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    };
  }, [enableAutoScroll, keyboardHeight]);

  const createBlurHandler = useCallback(() => {
    logDebug("Creating blur handler");
    return () => {
      logDebug("Blur handler triggered");

      blurTimeoutRef.current = setTimeout(() => {
        logDebug("Blur timeout started");
        const newActiveElement = document.activeElement as HTMLElement | null;

        const isNewElementInsideKeyboard =
          keyboardOverlayRef.current &&
          newActiveElement &&
          (keyboardOverlayRef.current as Node).contains(newActiveElement);

        const isNewElementInteractive = newActiveElement?.matches(
          'input, textarea, [contenteditable="true"]'
        );

        logDebug("New active element:", newActiveElement);
        logDebug("Is new element inside keyboard?", isNewElementInsideKeyboard);
        logDebug("Is new element interactive?", isNewElementInteractive);

        if (
          !isNewElementInteractive &&
          !isNewElementInsideKeyboard &&
          newActiveElement !== document.body
        ) {
          logInfo(
            "New active element is not interactive, not in keyboard, and not body; dismissing keyboard"
          );
          dismissKeyboard();
        } else if (isNewElementInsideKeyboard) {
          logDebug(
            "Focus moved to an element inside the keyboard, keeping keyboard open"
          );
        } else if (isNewElementInteractive) {
          logDebug(
            "New active element is interactive, not dismissing keyboard"
          );

          setActiveElement(newActiveElement);
        } else if (newActiveElement === document.body) {
          logDebug(
            "Focus moved to body, not dismissing keyboard (adjust if needed)"
          );
        }

        blurTimeoutRef.current = null;
      }, 100);
    };
  }, [dismissKeyboard, keyboardOverlayRef]);

  const attachListeners = useCallback(() => {
    logDebug("Attaching event listeners");
    const selectableElements = document.querySelectorAll(
      'input, textarea, [contenteditable], [contenteditable="true"]'
    );

    if (selectableElements.length === 0) {
      logWarn("No selectable input/textarea/contenteditable elements found.");
    } else {
      logDebug(`Found ${selectableElements.length} selectable elements.`);
    }

    const focusHandler = createFocusHandler();
    const blurHandler = createBlurHandler();

    const cleanup: (() => void)[] = [];

    selectableElements.forEach((element) => {
      logDebug("Attaching listeners to element:", element);
      element.addEventListener("focus", focusHandler);
      element.addEventListener("blur", blurHandler);

      cleanup.push(() => {
        logDebug("Removing listeners from element:", element);
        element.removeEventListener("focus", focusHandler);
        element.removeEventListener("blur", blurHandler);
      });
    });

    return () => {
      logDebug("Running listeners cleanup");
      cleanup.forEach((fn) => {
        fn();
      });
    };
  }, [createBlurHandler, createFocusHandler]);

  useEffect(() => {
    logInfo("Setting up MutationObserver for element changes");
    let cleanup: null | (() => void) = null;
    const observer = new MutationObserver(() => {
      logDebug("DOM mutated, re-attaching listeners");

      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      cleanup = attachListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    cleanup = attachListeners();

    return () => {
      logInfo("Disconnecting MutationObserver and cleaning up listeners");
      observer.disconnect();
      if (cleanup) {
        cleanup();
      }

      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
  }, [attachListeners]);

  useEffect(() => {
    if (isKeyboardVisible) {
      logInfo("Keyboard is now visible");
    } else {
      logInfo("Keyboard is now hidden");
    }
  }, [isKeyboardVisible]);

  const handleKeyPress = useCallback(
    (key: string) => {
      logDebug("Key pressed:", key);

      switch (key) {
        case "⌫":
          handleBackspace();
          break;
        case "Space":
          insertText(" ");
          break;
        case "Enter":
          if (activeElement instanceof HTMLTextAreaElement) {
            insertText("\n");
          } else {
            logInfo(
              "Enter key pressed on non-textarea, action not implemented."
            );
          }
          break;
        case "Shift":
          setIsShifted((prev) => !prev);

          setCurrentLayout((prevLayout) =>
            prevLayout === "lowercase" ? "uppercase" : "lowercase"
          );
          break;
        case "?123":
          setCurrentLayout("numbersSymbols");
          setIsShifted(false);
          break;
        case "Letters":
          setCurrentLayout("lowercase");
          setIsShifted(false);
          break;
        default:
          insertText(key);
          break;
      }
    },
    [activeElement, insertText, handleBackspace]
  );

  if (!isKeyboardVisible) {
    logDebug("Keyboard is not visible, returning null");
    return null;
  }

  logDebug(
    `Keyboard is visible, rendering component JSX with layout: ${currentLayout}`
  );

  return (
    <div
      ref={keyboardOverlayRef}
      className={cn(
        "touch-none pointer-events-none",
        "fixed bottom-0 left-0 w-full",
        "flex flex-col",
        "p-1.5 pb-2.5",
        "bg-background",
        "border-t border-border",
        "z-[1000]",
        "shadow-[0_-2px_10px_rgba(0,0,0,0.1)]",
        `${
          isKeyboardDismissing
            ? "animate-[slideDown_0.3s_ease-out]"
            : "animate-[slideUp_0.3s_ease-out]"
        }`,
        "animate-fill-forward"
      )}
    >
      <div className="w-full flex justify-end items-center mb-1 pointer-events-auto">
        <button
          className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 rounded-md"
          onClick={dismissKeyboard}
        >
          Dismiss
        </button>
      </div>
      <div className="flex flex-col">
        {layouts[currentLayout].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1 last:mb-0">
            {row.map((key) => (
              <button
                key={key}
                className={cn(
                  "flex items-center justify-center text-base font-medium bg-white text-gray-800 rounded-md mr-1 last:mr-0 pointer-events-auto active:bg-gray-300 active:translate-y-px focus:outline-none outline",
                  `${key === "Space" ? "flex-grow mx-1" : ""}`,
                  `${key === "Shift" || key === "Enter" || key === "Backspace" || key === "Numbers" || key === "Letters" ? "bg-gray-300 text-gray-800 font-semibold" : ""}`,
                  `${key === "Shift" && isShifted ? "bg-blue-500 text-white font-semibold" : ""}`
                )}
                style={{
                  minWidth: key.length > 1 ? "50px" : "35px",
                  height: "45px",
                  lineHeight: "45px",
                }}
                onClick={() => handleKeyPress(key)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  logDebug(
                    `onMouseDown prevented default and propagation for key: ${key}`
                  );
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  logDebug(
                    `onTouchStart prevented default and propagation for key: ${key}`
                  );
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Global style for animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
         @keyframes animate-fill-forward {
             from { transform: translateY(100%); }
             to { transform: translateY(0); }
         }
           .animate-fill-forward {
              animation-fill-mode: forwards;
         }
      `}</style>
    </div>
  );
};

export default VirtualKeyboardSimulator;
