import { h, render } from 'lithent';
import type { WDom, TagFunction } from 'lithent';

/**
 * hydration
 */
export function hydration(wDom: WDom, wrapElement: HTMLElement) {
  /**
   * Attach the el property to wDom.
   */
  addElement(wDom, wrapElement);

  /**
   * Attach events to wDom.
   */
  render(wDom, wrapElement, null, true);
}

export function hydrateOnClient(tagFunction: TagFunction) {
  if (typeof window !== 'undefined') {
    hydration(h(tagFunction, {}), document.documentElement);
    return;
  }
  return tagFunction;
}

/**
 * Attach the el property to wDom.
 */
function addElement(wDomOrig: WDom, wrapElement: HTMLElement) {
  const wDomList = flatFlagmentFromList(
    wDomOrig.type && ['fragment', 'loop'].includes(wDomOrig.type)
      ? [...(wDomOrig.children || [])]
      : [wDomOrig]
  );
  const realDomList =
    wrapElement.tagName === 'HTML'
      ? [wrapElement]
      : Array.from(wrapElement.childNodes);

  if (wDomList) {
    addElementProcessChildren(wDomList, realDomList);
  }
}

/**
 * Attach the el property to wDom recursively.
 */
function addElementProcessChildren(wDomList: WDom[], realDomList: ChildNode[]) {
  let index = 0;
  realDomList
    .filter((item: any) => filteredEmptyTextNode(item))
    .forEach(realDomItem => {
      let wDomItem = wDomList[index];
      const nodeType = realDomItem.nodeType;

      if (
        realDomItem &&
        wDomItem &&
        wDomItem.type &&
        ['text', 'element'].includes(wDomItem.type)
      ) {
        if (wDomItem.type === 'text' && nodeType === 3) {
          const { tFragment, nIndex } = processConsecutiveTextNodes(
            wDomList,
            index
          );
          index = nIndex;
          realDomItem!.parentElement!.replaceChild(tFragment, realDomItem);
        } else if (
          wDomItem.type === 'element' &&
          realDomItem instanceof HTMLElement
        ) {
          if ((realDomItem.tagName || '').toLowerCase() !== wDomItem.tag) {
            throw new Error('Hydration Error - not matched tagname');
          }

          wDomItem.el = realDomItem as HTMLElement;
        }

        addElementProcessChildren(
          flatFlagmentFromList(wDomItem.children || []),
          Array.from(realDomItem.childNodes)
        );
      }
      index += 1;
    });
}

/**
 * Whitespace or text nodes are ignored.
 */
function filteredEmptyTextNode(item: HTMLElement | Text) {
  if (item.nodeType === 3 && !(item as Text).data.replace(/\s*/g, '')) {
    return false;
  }

  if (
    item.parentNode?.nodeName === 'HTML' &&
    item.nodeType === 1 &&
    !['HEAD', 'BODY'].includes((item as HTMLElement).tagName)
  ) {
    return false;
  }

  return true;
}

/**
 * Flattens nested fragment types.
 */
function flatFlagmentFromList(wDomlist: WDom[]) {
  return wDomlist.reduce((acc: WDom[], item: WDom) => {
    if (item.type && ['fragment', 'loop'].includes(item.type)) {
      acc.push(...flatFlagmentFromList(item?.children || []));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

/**
 * Hydration is applied to consecutively rendered text node objects.
 */
function processConsecutiveTextNodes(wDomList: WDom[], cIndex: number) {
  const textWDomList: WDom[] = collectAdjacentTextNode(wDomList, cIndex, []);
  const tFragment = new DocumentFragment();
  textWDomList.forEach(item => {
    const textNode = document.createTextNode(String(item.text));
    item.el = textNode;
    tFragment.appendChild(textNode);
  });

  return {
    tFragment,
    nIndex: cIndex + (textWDomList.length - 1),
  };
}

/**
 * Collect consecutive text nodes.
 */
function collectAdjacentTextNode(
  wDomList: WDom[],
  cIndex: number,
  acc: WDom[]
): WDom[] {
  if (wDomList[cIndex] && wDomList[cIndex].type === 'text') {
    acc.push(wDomList[cIndex]);

    return collectAdjacentTextNode(wDomList, cIndex + 1, [...acc]);
  }
  return acc;
}
