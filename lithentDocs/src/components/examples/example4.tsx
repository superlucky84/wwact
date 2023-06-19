import { h, mount, Fragment, ref } from 'lithent';
import { effect, state } from 'lithent/helper';

import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';

const code = `import { h, Fragment, render, mount, updateCallback, mountCallback } from 'lithent';
import { state, effect } from 'lithent/helper';

/* effect
const effect = (
  forward: () => (() => void) | void,
  backward: () => (() => void) | void = () => {},
  dependencies: () => any[] = () => []
) => {
  mountCallback(() => {
    forward();

    return backward;
  });

  updateCallback(() => {
    if (backward) {
      backward();
    }

    return forward;
  }, dependencies);
};

const Children = mount(r => {
  let count = 0;
  const change = () => {
    count += 1;
    r();
  };

  effect(
    () => {
      console.log('INJECT');
    },
    () => {
      console.log('CLEAN_UP');
    },
    () => [count]
  );

  return () => (
    <>
      <button onClick={change} type="button">increase</button>
      <span>count: {count}</span>
    </>
  );
});
*/

const Parent = mount(renew => {
  let mountState = true;
  const toggleMount = () => {
    mountState = !mountState;
    renew();
  };

  return () => (
    <>
      <div class="text-sm overflow-y-scroll h-12"></div>
      <button
        onClick={toggleMount}
        type="button"
        class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        toggleMount
      </button>
      {mountState ? <Children /> : null}
    </>
  );
});

render(<Parent />, document.getElementById('root'));
`;

const exCode1 = hljs.highlight(code, {
  language: 'javascript',
}).value;

const Children = mount<{ logEl: { value: HTMLElement | null } }>((r, props) => {
  const count = state<number>(0, r);
  const change = () => {
    count.v += 1;
  };

  effect(
    () => {
      const ele = props.logEl.value as HTMLElement;
      ele.innerHTML += 'INJECT<br>';
      ele.scrollTo(0, ele.scrollHeight);
    },
    () => {
      const ele = props.logEl.value as HTMLElement;
      ele.innerHTML += 'CLEAN_UP<br>';
      ele.scrollTo(0, ele.scrollHeight);
    },
    () => [count.v]
  );

  return () => (
    <>
      <button
        onClick={change}
        type="button"
        class="ml-2 text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        increase
      </button>
      <span>count: {count.v}</span>
    </>
  );
});

const Parent = mount(renew => {
  let logEl = ref(null);
  let mountState = true;
  const toggleMount = () => {
    mountState = !mountState;
    renew();
  };

  return () => (
    <>
      <div ref={logEl} class="text-sm overflow-y-scroll h-12"></div>
      <button
        onClick={toggleMount}
        type="button"
        class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        toggleMount
      </button>
      {mountState ? <Children logEl={logEl} /> : null}
    </>
  );
});

export const Example4 = mount(() => {
  return () => (
    <div class="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="text-slate-50 text-lg md:text-2xl mb-2">
        Example 4 - helper (effect)
      </h3>
      <p class="text-sm md:text-base text-gray-400 mb-2">
        The first argument is an action that should happen after the monted or
        updated.
      </p>
      <p class="text-sm md:text-base text-gray-400 mb-2">
        The second argument is a function to clean up before unmounting or
        updating the dome.
      </p>
      <p class="text-sm md:text-base text-gray-400 mb-2">
        The third argument puts in a dependency to detect updates only when a
        specific value changes.
      </p>
      <p class="text-sm md:text-base text-gray-400 mb-2">
        The third argument must be a "function" that returns an array
      </p>
      <div class="mt-4 px-2 py-2 overflow-x-auto text-sm text-gray-50 border border-gray-200 border-dashed rounded dark:border-gray-600 bg-slate-950">
        <div
          class="font-normal"
          innerHTML={exCode1}
          style={{ whiteSpace: 'pre' }}
        />
      </div>
      <div class="px-2 py-2 text-gray-400 border border-gray-200 border-dashed rounded dark:border-gray-600 bg-slate-950">
        <Parent />
      </div>
    </div>
  );
});
