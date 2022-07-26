import {
  WDom,
  TagFunction,
  TagFunctionResolver,
  FragmentFunction,
} from '@/types';
type WDomType =
  | 'component'
  | 'fragment'
  | 'element'
  | 'loop'
  | 'text'
  | 'empty';
type DiffParam = {
  originalVdom?: WDom;
  newVdom: WDom | TagFunction | TagFunctionResolver;
};

type WDomParam =
  | string
  | WDom
  | (() => WDom)
  | TagFunction
  | TagFunctionResolver;

export function getVdomType(
  vDom: WDom | (() => WDom) | TagFunction | TagFunctionResolver
): WDomType | undefined {
  const isComponent = checkCustemComponentFunction(vDom);
  const isFragment = checkFragment(vDom);
  const isTagElement = checkTagElement(vDom);
  const isLoopElement = checkLoopElement(vDom);
  const isTextElement = checkTextElement(vDom);
  const isEmptyElement = checkEmptyElement(vDom);

  if (isComponent) {
    return 'component';
  } else if (isFragment) {
    return 'fragment';
  } else if (isTagElement) {
    return 'element';
  } else if (isLoopElement) {
    return 'loop';
  } else if (isTextElement) {
    return 'text';
  } else if (isEmptyElement) {
    return 'empty';
  }

  return undefined;
}

export const checkSameVdomWithOriginal = {
  component: checkSameCustomComponent,
  loop: checkSameLoopElement,
  text: checkSameTextElement,
  element: checkSameTagElement,
  fragment: checkSameFragment,
  empty: checkSameEmptyElement,
};

/**
 * Predicator
 */
export function checkCustemComponentFunction(
  target: WDomParam
): target is TagFunction | TagFunctionResolver {
  const isTagTagFunction =
    typeof target === 'function' && target.name !== 'Fragment';
  const TagFunctionResolver = typeof target === 'object' && 'resolve' in target;

  return isTagTagFunction || TagFunctionResolver;
}

export function checkFragmentFunction(
  target: unknown
): target is FragmentFunction {
  return typeof target === 'function' && target.name === 'Fragment';
}

export function checkFragment(vDom: WDomParam) {
  return (
    typeof vDom === 'object' && !('resolve' in vDom) && vDom.type === 'fragment'
  );
}

export function checkTagElement(vDom: WDomParam) {
  return (
    typeof vDom === 'object' && !('resolve' in vDom) && vDom.type === 'element'
  );
}

export function checkLoopElement(vDom: WDomParam) {
  return (
    typeof vDom === 'object' && !('resolve' in vDom) && vDom.type === 'loop'
  );
}

export function checkTextElement(vDom: WDomParam) {
  return (
    typeof vDom === 'object' && !('resolve' in vDom) && vDom.type === 'text'
  );
}

export function checkEmptyElement(vDom: WDomParam) {
  return typeof vDom === 'object' && !('resolve' in vDom) && !vDom.type;
}

export function checkSameCustomComponent({ originalVdom, newVdom }: DiffParam) {
  // Todo need Fix Function type check
  // @ts-ignore
  return newVdom.tagName === originalVdom?.tagName;
}

export function checkSameFragment({ originalVdom, newVdom }: DiffParam) {
  return (
    typeof newVdom !== 'function' &&
    !('resolve' in newVdom) &&
    originalVdom?.type === 'fragment' &&
    originalVdom?.children?.length === newVdom?.children?.length
  );
}

export function checkSameTagElement({ originalVdom, newVdom }: DiffParam) {
  return (
    typeof newVdom !== 'function' &&
    !('resolve' in newVdom) &&
    originalVdom?.type === 'element' &&
    originalVdom?.tag === newVdom.tag
  );
}

export function checkSameLoopElement({ originalVdom, newVdom }: DiffParam) {
  return (
    typeof newVdom !== 'function' &&
    !('resolve' in newVdom) &&
    originalVdom?.type === newVdom.type
  );
}

export function checkSameTextElement({ originalVdom, newVdom }: DiffParam) {
  return (
    typeof newVdom !== 'function' &&
    !('resolve' in newVdom) &&
    originalVdom?.type === newVdom.type
  );
}

export function checkSameEmptyElement({ originalVdom, newVdom }: DiffParam) {
  return (
    typeof newVdom !== 'function' &&
    !('resolve' in newVdom) &&
    originalVdom?.type === newVdom.type
  );
}

export function isExisty(value: unknown) {
  return value !== null && value !== undefined;
}

export function checkFunction(target: unknown): target is Function {
  return typeof target === 'function';
}

export function checkEventFunction(
  target: unknown
): target is (e: Event) => void {
  return typeof target === 'function';
}

export function checkStyleData(
  dataKey: string,
  dataValue: unknown
): dataValue is Record<string, string> {
  return dataKey === 'style' && typeof dataValue === 'object';
}

export function checkRefData(
  dataKey: string,
  dataValue: unknown
): dataValue is { value: HTMLElement | DocumentFragment | Text | undefined } {
  return dataKey === 'ref' && typeof dataValue === 'object';
}
