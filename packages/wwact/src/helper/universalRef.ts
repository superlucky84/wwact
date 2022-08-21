import {
  UseDataStoreValue,
  ComponentSubKey,
  ComponentRef,
  Props,
} from '@/types';

/**
 * Common
 */
export const componentKeyRef: { value: Props } = { value: {} };
export const needDiffRef: { value: boolean } = { value: false };
export const componentRef: ComponentRef = new WeakMap();

/**
 * DataStore
 */
export const dataStoreStore: { [key: string]: UseDataStoreValue } = {};
export const dataStoreRenderQueue: {
  [key: string]: (() => (() => void) | undefined)[];
} = {};

/**
 * Router
 */
export const routerParams: { value: { [key: string]: string } } = { value: {} };

/**
 * Ref helpers
 */
export function makeQueueRef(
  componentKey: Props,
  name: ComponentSubKey
): (() => void)[] {
  if (!componentRef.get(componentKey)) {
    componentRef.set(componentKey, {});
  }

  if (
    name === 'updateSubscribeList' ||
    name === 'mountSubscribeList' ||
    name === 'unmountSubscribeList'
  ) {
    componentRef.get(componentKey)![name] ??= [];
  }

  return componentRef.get(componentKey)![name] as (() => void)[];
}

export function makeUpdatedStore(
  componentKey: Props
): WeakMap<() => void, unknown[]> {
  if (!componentRef.get(componentKey)) {
    componentRef.set(componentKey, {});
  }

  componentRef.get(componentKey)!.updateSubscribeDefList ??= new WeakMap<
    () => void,
    unknown[]
  >();

  return componentRef.get(componentKey)!.updateSubscribeDefList as WeakMap<
    () => void,
    unknown[]
  >;
}

export function setRedrawAction(componentKey: Props, action: () => void) {
  if (!componentRef.get(componentKey)) {
    componentRef.set(componentKey, {});
  }

  componentRef.get(componentKey)!.redrawAction = action;
}

export function initUpdateHookState(componentKey: Props) {
  componentKeyRef.value = componentKey;
}

export function initMountHookState(componentKey: Props) {
  componentKeyRef.value = componentKey;
}
