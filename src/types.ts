export interface VNode {
  children: VNode[];
  actualNode: Node | null;
  props: {
    nodeName: string;
    type?: string;
  };
  attr(attrName: string): string | null;
}

interface Axe {
  teardown(): void;
  setup(domNode: Node): VNode;

  commons: {
    aria: {
      getRole(vNode: VNode): string | null;
      lookupTable: {
        role: {
          [name: string]: {
            attributes: {
              allowed: string[];
            };
          };
        };
      };
    };
    forms: {
      isDisabled(vNode: VNode): boolean;
      isNativeSelect(vNode: VNode): boolean;
    };
    text: {
      accessibleText(node: Node): string;
      accessibleTextVirtual(vNode: VNode): string;
      formControlValue(vNode: VNode): string;
      nativeTextMethods: {
        placeholderText(vNode: VNode): string;
      };
    };
  };
}

declare global {
  interface Window {
    axe: Axe;
  }
}
