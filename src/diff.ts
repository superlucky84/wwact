import { WDom, TagFunctionResolver, RenderType } from '@/types';
import { checkCustemComponentFunction } from '@/utils/predicator';
import { getParent, reRender } from '@/utils';
import { recursiveRemoveEvent } from '@/render';
import {
  checkEmptyElement,
  checkSameWDomWithOriginal,
  getWDomType,
  checkExisty,
} from '@/utils/predicator';

import { runUnmountQueueFromWDom } from '@/hook/unmount';

export const makeNewWDomTree = (
  newWDom: WDom | TagFunctionResolver,
  originalWDom?: WDom
) => {
  const type = getWDomType(newWDom);

  if (!type) {
    throw new Error('Unknown type wdom');
  }

  const isSameType = checkSameWDomWithOriginal[type](newWDom, originalWDom);

  const result = remakeNewWDom(newWDom, isSameType, originalWDom);

  return result;
};

const remakeNewWDom = (
  newWDom: WDom | TagFunctionResolver,
  isSameType: boolean,
  originalWDom?: WDom
) => {
  const remakeWDom = generalize(newWDom, isSameType, originalWDom);

  remakeWDom.children = remakeChildrenForDiff(
    remakeWDom,
    isSameType,
    originalWDom
  );

  const needRerender = addReRenderTypeProperty(
    remakeWDom,
    isSameType,
    originalWDom
  );

  remakeWDom.needRerender = needRerender;

  if (needRerender !== 'A' && originalWDom) {
    remakeWDom.el = originalWDom.el;
  }

  if (
    needRerender &&
    ['D', 'R', 'SR'].includes(needRerender) &&
    originalWDom?.componentKey
  ) {
    runUnmountQueueFromWDom(originalWDom);
    recursiveRemoveEvent(originalWDom);
    remakeWDom.oldChildren = originalWDom.children;
  }

  remakeWDom.oldProps = originalWDom?.props;

  return remakeWDom;
};

const addReRenderTypeProperty = (
  newWDom: WDom,
  isSameType: boolean,
  originalWDom?: WDom
): RenderType | undefined => {
  const existOriginalWDom = originalWDom && originalWDom.type;
  const isEmptyElement = checkEmptyElement(newWDom);
  const isRoot = !newWDom.getParent;
  const parentType = !isRoot && getParent(newWDom).type;
  const key = getKey(newWDom);
  const isKeyCheckedWDom = parentType === 'loop' && checkExisty(key);
  const isSameText =
    newWDom.type === 'text' &&
    isSameType &&
    newWDom.text === originalWDom?.text;

  let result: RenderType | undefined;
  if (isEmptyElement) {
    result = 'D';
  } else if (isSameText) {
    result = 'N';
  } else if (!existOriginalWDom) {
    result = 'A';
  } else if (isSameType) {
    result = isKeyCheckedWDom ? 'SU' : 'U';
  } else {
    result = isKeyCheckedWDom ? 'SR' : 'R';
  }

  return result;
};

const generalize = (
  newWDom: WDom | TagFunctionResolver,
  isSameType: boolean,
  originalWDom?: WDom
): WDom => {
  if (checkCustemComponentFunction(newWDom)) {
    return isSameType && originalWDom
      ? reRender(originalWDom, newWDom)
      : newWDom.resolve();
  }

  return newWDom;
};

const remakeChildrenForDiff = (
  newWDom: WDom,
  isSameType: boolean,
  originalWDom?: WDom
) =>
  isSameType && originalWDom
    ? remakeChildrenForUpdate(newWDom, originalWDom)
    : remakeChildrenForAdd(newWDom);

const remakeChildrenForAdd = (newWDom: WDom) =>
  (newWDom.children || []).map((item: WDom) => {
    const childItem = makeNewWDomTree(item);

    childItem.getParent = () => newWDom;

    return childItem;
  });

const remakeChildrenForUpdate = (newWDom: WDom, originalWDom: WDom) => {
  if (
    newWDom.type === 'loop' &&
    checkExisty(getKey((newWDom.children || [])[0]))
  ) {
    return remakeChildrenForLoopUpdate(newWDom, originalWDom);
  }

  return (newWDom.children || []).map((item: WDom, index: number) => {
    const childItem = makeNewWDomTree(
      item,
      (originalWDom.children || [])[index]
    );

    childItem.getParent = () => newWDom;

    return childItem;
  });
};

const remakeChildrenForLoopUpdate = (newWDom: WDom, originalWDom: WDom) => {
  const { remakedChildren, unUsedChildren } = diffLoopChildren(
    newWDom,
    originalWDom
  );

  unUsedChildren.map(unusedItem => {
    const el = unusedItem.el;

    if (el?.parentNode) {
      el.parentNode.removeChild(el);
    }
  });

  return remakedChildren;
};

const diffLoopChildren = (newWDom: WDom, originalWDom: WDom) => {
  const newChildren = [...(newWDom.children || [])];
  const originalChildren = [...(originalWDom.children || [])];

  const remakedChildren = newChildren.map(item => {
    const originalItem = findSameKeyOriginalItem(item, originalChildren);
    const childItem = makeNewWDomTree(item, originalItem);

    if (originalItem) {
      originalChildren.splice(originalChildren.indexOf(originalItem), 1);
    }

    childItem.getParent = () => newWDom;

    return childItem;
  });

  return {
    remakedChildren,
    unUsedChildren: originalChildren,
  };
};

const findSameKeyOriginalItem = (item: WDom, originalChildren: WDom[]) => {
  const key = getKey(item);

  return originalChildren.find(
    orignalChildItem => getKey(orignalChildItem) === key
  );
};

const getKey = (target: WDom) =>
  target?.componentProps?.key ?? target?.props?.key;
