import { mount } from 'lithent';
import { state, computed } from 'lithent/helper';

import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';

const code = `import { h, Fragment, render, mount } from 'lithent';
import { state, computed } from 'lithent/helper';

const Component = mount(r => {
  const count = state<number>(1, r);
  const increase = () => {
    count.v += 1;
  };
  const result = computed<number>(() => [1, 3, 5, 7, 9].reduce( (accumulator, current) => accumulator + current * count.v, 0));

  return () => (
    <>
      <button type="text" onClick={increase}>
        increase
      </button>
      <span>computed: {result.v}</span>
    </>
  );
});

render(<Component />, document.getElementById('root'));
`;

const exCode1 = hljs.highlight(code, {
  language: 'javascript',
}).value;

const Component = mount(r => {
  const count = state<number>(1, r);
  const increase = () => {
    count.v += 1;
  };
  const result = computed<number>(() =>
    [1, 3, 5, 7, 9].reduce(
      (accumulator, current) => accumulator + current * count.v,
      0
    )
  );

  return () => (
    <>
      <button
        type="text"
        onClick={increase}
        class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800"
      >
        increase
      </button>
      <span>computed: {result.v}</span>
    </>
  );
});

export const Example1 = mount(() => {
  return () => (
    <div class="flex flex-col p-4 mb-2 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1 border-gray-700 sm:p-6 bg-gray-800">
      <h3 class="text-slate-50 text-lg md:text-2xl mb-2">
        Example 1 - helper (computed)
      </h3>
      <p class="text-sm md:text-base text-gray-400 mb-2">
        <a
          class="text-orange-200 hover:underline"
          href="https://github.com/superlucky84/lithent/blob/master/helper/src/hook/computed.ts"
          target="_blank"
        >
          view helper code
        </a>
      </p>
      <p class="text-sm md:text-base text-gray-400">
        Computed helps you use precomputed values directly in the updater.&nbsp;
      </p>
      <div class="mt-4 px-2 py-2 overflow-x-auto text-sm text-gray-50 border border-gray-200 border-dashed rounded border-gray-600 bg-slate-950">
        <div
          class="font-normal"
          innerHTML={exCode1}
          style={{ whiteSpace: 'pre' }}
        />
      </div>
      <div class="flex-auto px-2 py-2 text-gray-400 border border-gray-200 border-dashed rounded border-gray-600 bg-slate-950">
        <Component />
      </div>
    </div>
  );
});
