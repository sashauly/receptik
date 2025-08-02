/**
 * This component is partially based on the react-overflow-indicator package
 * (https://www.npmjs.com/package/react-overflow-indicator).
 */

import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

// =============================================================================
// Type Definitions
// =============================================================================

export interface CanScroll {
  up: boolean;
  left: boolean;
  right: boolean;
  down: boolean;
}

export interface OverflowState {
  canScroll: CanScroll;
}

type OverflowAction = {
  type: "CHANGE";
  direction: keyof CanScroll;
  canScroll: boolean;
};

export interface OverflowRefs {
  /** Ref to the scrollable viewport element. */
  viewport: RefObject<HTMLDivElement>;
}

interface OverflowContextValue {
  state: OverflowState;
  dispatch: React.Dispatch<OverflowAction>;
  tolerance: number | string;
  refs: OverflowRefs;
}

// =============================================================================
// Context
// =============================================================================

const Context = React.createContext<OverflowContextValue | undefined>(
  undefined,
);

export function useOverflow(): OverflowContextValue {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useOverflow must be used within an <OverflowProvider>");
  }
  return context;
}

// =============================================================================
// Styles (Consider making these more flexible)
// =============================================================================

// These are base styles. For packaging, you might expose options to
// override some of these or provide them via CSS classes.
const containerBaseStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const viewportBaseStyle: CSSProperties = {
  position: "relative",
  flexBasis: "100%",
  flexShrink: 1,
  flexGrow: 0,
  overflow: "auto",
  WebkitOverflowScrolling: "touch", // Improves scrolling performance on iOS
};

const contentBaseStyle: CSSProperties = {
  display: "inline-block", // Allows content to exceed viewport width
  position: "relative",
  minWidth: "100%", // Ensure content takes at least 100% width
  boxSizing: "border-box",
};

// =============================================================================
// Reducer
// =============================================================================

function reducer(state: OverflowState, action: OverflowAction): OverflowState {
  switch (action.type) {
    case "CHANGE": {
      const currentValue = state.canScroll[action.direction];
      if (currentValue === action.canScroll) {
        return state;
      }
      return {
        ...state,
        canScroll: {
          ...state.canScroll,
          [action.direction]: action.canScroll,
        },
      };
    }
    default:
      // It's good practice for reducers to return the current state
      // for unknown actions.
      return state;
  }
}

function getInitialState(): OverflowState {
  return {
    canScroll: {
      up: false,
      left: false,
      right: false,
      down: false,
    },
  };
}

// =============================================================================
// Main Overflow Component
// =============================================================================

interface OverflowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Elements to render inside the outer container. This should include an
   * `<Overflow.Content>` element at a minimum, but should also include your
   * scroll indicators if you’d like to overlay them on the scrollable viewport.
   */
  children?: ReactNode;
  /**
   * Callback that receives the latest overflow state and an object of refs, if
   * you’d like to react to overflow in a custom way.
   */
  onStateChange?: (state: OverflowState, refs: OverflowRefs) => void;
  /**
   * Distance (number of pixels or CSS length unit like `1em`) to the edge of
   * the content at which to consider the viewport fully scrolled. For example,
   * if set to 10, then it will consider scrolling to have reached the end as
   * long as it’s within 10 pixels of the border. You can use this when your
   * content has padding and scrolling close to the edge should be good enough.
   */
  tolerance?: number | string;
  /**
   * Optional CSS class name for the main container element.
   */
  className?: string;
  /**
   * Optional inline style for the main container element.
   */
  style?: CSSProperties;
}

/**
 * The overflow state provider. At a minimum it must contain an
 * `<Overflow.Content>` element, otherwise it will do nothing.
 * It provides a scrollable viewport and state to track overflow in
 * different directions.
 *
 * ```jsx
 * <Overflow style={{ maxHeight: 500 }}>
 *   <Overflow.Content>
 *     Your scrollable content here!
 *   </Overflow.Content>
 *   // Add indicators here using Overflow.Indicator
 * </Overflow>
 * ```
 */
function Overflow({
  children,
  onStateChange,
  style: styleProp,
  className,
  tolerance = 0,
  ...rest
}: OverflowProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const hidden = rest.hidden; // Keep handling the hidden attribute
  const viewportRef = useRef<HTMLDivElement>(null);

  // Combine base styles with provided style prop and handle 'hidden'
  const containerStyle: CSSProperties = useMemo(
    () => ({
      ...containerBaseStyle,
      ...styleProp,
      display:
        hidden || (styleProp && styleProp.display === "none")
          ? "none"
          : containerBaseStyle.display,
    }),
    [hidden, styleProp],
  );

  const refs: OverflowRefs = useMemo(() => ({ viewport: viewportRef }), []);

  const context: OverflowContextValue = useMemo(
    () => ({
      state,
      dispatch,
      tolerance,
      refs,
    }),
    [refs, state, tolerance, dispatch],
  );

  // Call the onStateChange callback when the state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state, refs);
    }
  }, [onStateChange, refs, state]);

  return (
    <div
      data-overflow-wrapper=""
      style={containerStyle}
      className={className}
      {...rest}
    >
      <Context.Provider value={context}>{children}</Context.Provider>
    </div>
  );
}

// =============================================================================
// Overflow Content Component
// =============================================================================

// For Firefox, update on a threshold of 0 in addition to any intersection at
// all (represented by a tiny tiny threshold).
const threshold = [0, 1e-12];

interface OverflowContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to render inside the scrollable viewport.
   */
  children?: ReactNode;
  /**
   * Optional CSS class name for the content element.
   */
  className?: string;
  /**
   * Optional inline style for the content element.
   */
  style?: CSSProperties;
}

/**
 * Wrapper for content to render inside the scrollable viewport. This element
 * will grow to whatever size it needs to hold its content, and will cause the
 * parent viewport element to overflow. It must be rendered inside an
 * `<Overflow>` ancestor.
 *
 * Although you can style this element directly by passing additional props
 * like `className` and `style`, it’s preferable to include styling on your
 * own element inside `<Overflow.Content>` instead – otherwise you risk
 * interfering with the styles this component needs to function.
 */

function OverflowContent({
  children,
  style: styleProp,
  className,
  ...rest
}: OverflowContentProps): JSX.Element {
  const { dispatch, tolerance, refs } = useOverflow();
  const { viewport: viewportRef } = refs;
  const contentRef = useRef<HTMLDivElement>(null);
  const toleranceRef = useRef<HTMLDivElement>(null);
  // Use the tolerance ref if tolerance is greater than 0, otherwise use contentRef
  // This allows the IntersectionObserver to track a slightly smaller area
  // when tolerance is applied, triggering the 'canScroll' state change
  // slightly before reaching the absolute edge of the content.
  const watchRef =
    typeof tolerance === "number" && tolerance > 0 ? toleranceRef : contentRef;

  // Store observers in a ref to avoid re-creating them on every render
  const observersRef = useRef<{
    up: IntersectionObserver;
    left: IntersectionObserver;
    right: IntersectionObserver;
    down: IntersectionObserver;
  }>();

  // Effect to create and manage Intersection Observers
  useEffect(() => {
    let ignore = false; // Flag to prevent updates after cleanup

    const root = viewportRef.current;
    if (!root) return; // Don't create observers if the root element is not yet available

    const createObserver = (
      direction: keyof CanScroll,
      rootMargin: string,
    ): IntersectionObserver => {
      return new IntersectionObserver(
        ([entry]) => {
          if (ignore) {
            return;
          }

          const hasSize = Boolean(
            entry.boundingClientRect.width || entry.boundingClientRect.height,
          );
          // Determine if the edge is intersecting (meaning scrolling is possible)
          // Check intersectionRatio and isIntersecting for robustness, especially in Firefox.
          const canScroll =
            hasSize && entry.intersectionRatio !== 0 && entry.isIntersecting;

          dispatch({ type: "CHANGE", direction, canScroll });
        },
        {
          root, // The scrollable ancestor
          rootMargin, // Defines the margin box of the root element
          threshold, // Intersection ratio thresholds
        },
      );
    };

    // Define root margins for each direction
    // These margins are calculated to make the observer's target shrink
    // inwards from the edges of the root (viewport), effectively tracking
    // when the *content* becomes visible/invisible at the edges.
    const observers = {
      up: createObserver("up", "100% 0px -100% 0px"), // Top edge: Observe when content enters from the top
      left: createObserver("left", "0px -100% 0px 100%"), // Left edge: Observe when content enters from the left
      right: createObserver("right", "0px 100% 0px -100%"), // Right edge: Observe when content enters from the right
      down: createObserver("down", "-100% 0px 100% 0px"), // Bottom edge: Observe when content enters from the bottom
    };

    observersRef.current = observers;

    // Cleanup function: Disconnect observers when the component unmounts
    return () => {
      ignore = true; // Set ignore flag before disconnecting
      observers.up.disconnect();
      observers.left.disconnect();
      observers.right.disconnect();
      observers.down.disconnect();
    };
  }, [dispatch, viewportRef]); // Depend on dispatch and viewportRef

  // Effect to start observing the watchNode when it changes or observers are ready
  useEffect(() => {
    const observers = observersRef.current;
    const watchNode = watchRef.current;

    if (!observers || !watchNode) return; // Ensure observers and node are available

    // Start observing the target node for intersection changes
    observers.up.observe(watchNode);
    observers.left.observe(watchNode);
    observers.right.observe(watchNode);
    observers.down.observe(watchNode);

    // Cleanup function: Unobserve the target node
    return () => {
      if (observers && watchNode) {
        observers.up.unobserve(watchNode);
        observers.left.unobserve(watchNode);
        observers.right.unobserve(watchNode);
        observers.down.unobserve(watchNode);
      }
    };
  }, [watchRef]); // Depend on watchRef

  // Combine base content styles with provided style prop
  const contentStyle: CSSProperties = useMemo(() => {
    return {
      ...contentBaseStyle,
      ...styleProp,
    };
  }, [styleProp]);

  // Create the optional tolerance element
  const toleranceElement: JSX.Element | null = useMemo(
    () =>
      tolerance ? (
        <div
          data-overflow-tolerance
          ref={toleranceRef}
          style={{
            position: "absolute",
            top: tolerance,
            left: tolerance,
            right: tolerance,
            bottom: tolerance,
            background: "transparent",
            pointerEvents: "none", // Don't interfere with interactions
            zIndex: -1, // Ensure it's behind the content
          }}
        />
      ) : null,
    [tolerance],
  );

  return (
    // The viewport element with overflow: auto
    <div ref={viewportRef} data-overflow-viewport="" style={viewportBaseStyle}>
      {/* The content element that can cause overflow */}
      <div
        ref={contentRef}
        data-overflow-content=""
        style={contentStyle}
        className={className}
        {...rest}
      >
        {toleranceElement}
        {children}
      </div>
    </div>
  );
}

OverflowContent.displayName = "Overflow.Content";

// =============================================================================
// Overflow Indicator Component
// =============================================================================

type OverflowIndicatorChildren =
  | ReactNode
  | ((canScroll: boolean | CanScroll, refs: OverflowRefs) => ReactNode);

interface OverflowIndicatorProps {
  /**
   * Indicator to render when scrolling is allowed in the requested direction.
   * If given a function, it will be passed the overflow state (boolean for a specific
   * direction, or the full `CanScroll` object for all directions) and an object
   * containing the `viewport` ref. You can use this `refs` parameter to render
   * an indicator that is also a button that scrolls the viewport (for example).
   */
  children?: OverflowIndicatorChildren;
  /**
   * The scrollable direction to watch for. If not supplied, the indicator will
   * be active when scrolling is allowed in any horizontal or vertical direction.
   */
  direction?: keyof CanScroll;
}

/**
 * A helper component for rendering your custom indicator when the viewport is
 * scrollable in a particular direction (or any direction). Must be rendered
 * inside an `<Overflow>` ancestor.
 *
 * You can provide a `direction` prop to indicate when scrolling is allowed in
 * a particular direction:
 *
 * ```jsx
 * <Overflow>
 *   <Overflow.Content>…</Overflow.Content>
 *   <Overflow.Indicator direction="right">
 *     👉
 *   </Overflow.Indicator>
 * </Overflow>
 * ```
 *
 * …or exclude it to indicate when scrolling is allowed in any direction:
 * ```jsx
 * <Overflow>
 *   <Overflow.Content>…</Overflow.Content>
 *   <Overflow.Indicator>
 *     ←↕→
 *   </Overflow.Indicator>
 * </Overflow>
 * ```
 *
 * This component will mount its children when scrolling is allowed in the
 * requested direction, and unmount them otherwise. If you’d rather remain
 * mounted (to allow transitions, for example), then render a function. It will
 * be supplied with a Boolean (if `direction` is supplied) or an object with
 * `up`, `left`, `right`, and `down` properties:
 *
 * ```jsx
 * <Overflow>
 *   <Overflow.Indicator direction="down">
 *     {canScroll => canScroll ? '🔽' : '✅'}
 *   </Overflow.Indicator>
 * </Overflow>
 * ```
 */
function OverflowIndicator({
  children,
  direction,
}: OverflowIndicatorProps): JSX.Element | null {
  const { state, refs } = useOverflow();
  const { canScroll } = state;

  // Determine if the indicator should be active
  const isActive = direction
    ? canScroll[direction]
    : canScroll.up || canScroll.left || canScroll.right || canScroll.down;

  let shouldRender = isActive;
  let renderedChildren = children;

  // If children is a function, call it with the state and refs
  if (typeof renderedChildren === "function") {
    shouldRender = true; // Always render the function's output
    const stateArg = direction ? isActive : canScroll; // Pass boolean or CanScroll object
    renderedChildren = renderedChildren(stateArg, refs);
  }

  // Render the children only if shouldRender is true
  return shouldRender ? <>{renderedChildren}</> : null;
}

OverflowIndicator.displayName = "Overflow.Indicator";

// =============================================================================
// Exported Component
// =============================================================================

// Export the main component with its sub-components attached
const OverflowComponent = Object.assign(Overflow, {
  Content: OverflowContent,
  Indicator: OverflowIndicator,
});

export default OverflowComponent;
