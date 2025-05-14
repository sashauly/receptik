interface Navigator {
  readonly virtualKeyboard: VirtualKeyboard;
}
interface VirtualKeyboard extends EventTarget {
  show(): undefined;
  hide(): undefined;
  readonly boundingRect: DOMRect;
  overlaysContent: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ongeometrychange: ((this: VirtualKeyboard, ev: Event) => any) | null;
}
declare const VirtualKeyboard: VirtualKeyboard;
interface ElementContentEditable {
  virtualKeyboardPolicy: string;
}
