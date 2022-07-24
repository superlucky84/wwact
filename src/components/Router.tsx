import { WDom } from '@/types';
import { h, Fragment } from '../wDom';
import { makeData, mounted, unmount } from '@/hook';
import { addParams } from '@/hook/params';

export function Router(_props: {}, children: WDom[]) {
  const data = makeData<{ targetPath: string }>({ targetPath: '' });
  const findPath = (injectPath: string) =>
    children.find(item => item.componentProps?.path === injectPath);

  const findDynamicPath = () =>
    children.find(item => /^:/.test(String(item?.componentProps?.path || '')));

  const handleHashChange = () => {
    const injectPath =
      window.location.hash.replace(/^[#\/]*/, '') ||
      String(children[0]?.componentProps?.path || '');
    let targetPath = findPath(injectPath);

    if (!targetPath) {
      targetPath = findDynamicPath();

      if (targetPath) {
        addParams(
          String(targetPath?.componentProps?.path || '').replace(/^:/, ''),
          injectPath
        );
      }
    }

    if (targetPath) {
      data.targetPath = String(targetPath?.componentProps?.path || '');
    }
  };

  const removeEvent = () => {
    window.removeEventListener('hashchange', handleHashChange);
  };

  window.addEventListener('hashchange', handleHashChange);

  const makeComponent = () => {
    mounted(handleHashChange);
    unmount(removeEvent);

    return (
      <Fragment>
        {children.map(item => {
          const path = String(item?.componentProps?.path || '');
          const element = item?.componentProps?.element;

          return data.targetPath === path ? element : null;
        })}
      </Fragment>
    );
  };

  return makeComponent;
}

export function RouterItem() {
  return () => <div />;
}
