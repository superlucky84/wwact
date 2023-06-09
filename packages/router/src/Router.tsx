import { h, Fragment, WDom, Props } from 'wwact';
import { state, mounted } from 'wwact';
import { addParams } from '@/hook/params';

export function Router(_props: Props, children: WDom[]) {
  const targetPathString = state<string>('');
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
      targetPathString.s(String(targetPath?.componentProps?.path || ''));
    }
  };

  const removeEvent = () => {
    console.log('unmount');
    window.removeEventListener('hashchange', handleHashChange);
  };

  window.addEventListener('hashchange', handleHashChange);

  mounted(() => {
    handleHashChange();

    return removeEvent;
  });

  return () => (
    <Fragment>
      {children.map(item => {
        const path = String(item?.componentProps?.path || '');
        const element = item?.componentProps?.element;

        return targetPathString.v === path ? element : null;
      })}
    </Fragment>
  );
}

export function RouterItem() {
  return () => <div />;
}
