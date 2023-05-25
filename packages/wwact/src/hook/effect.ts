import { WDom } from '@/types';
import {
  componentKeyRef,
  componentRef,
  makeQueueRef,
} from '@/helper/universalRef';
import useUpdate from '@/hook/useUpdate';

export default function mounted(
  effectAction: () => void,
  dependencies: unknown[] = []
) {
  if (!dependencies.length) {
    const componentKey = componentKeyRef.value;
    let mountSubscribeList = componentRef.get(componentKey)?.mountSubscribeList;

    if (!mountSubscribeList) {
      mountSubscribeList = makeQueueRef(componentKey, 'mountSubscribeList');
    }

    mountSubscribeList.push(effectAction);
  } else {
    useUpdate(effectAction, dependencies);
  }
}

export function runMountedQueueFromWDom(newWDom: WDom) {
  const { componentKey } = newWDom;
  if (!componentKey) {
    return;
  }
  const queue = componentRef.get(componentKey)!.mountSubscribeList;
  componentKeyRef.value = componentKey;

  if (queue) {
    componentRef.get(componentKey)!.mountSubscribeList = [];

    queue.forEach((effect: Function) => {
      effect();
    });
  }
}
