import { h, mount, Fragment } from 'lithent';

import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';

const code = `import { h, Fragment, render, mount } from 'lithent';
const Loop = mount(function (renew) {
  let list: { key: number; value: string }[] = [
    { key: 1, value: 'one' },
    { key: 2, value: 'two' },
    { key: 3, value: 'three' },
    { key: 4, value: 'four' },
  ];
  const handle = () => {
    list = [
      { key: 3, value: 'three three' },
      { key: 2, value: 'two two' },
    ];
    renew();
  };

  return () => (
    <Fragment>
      <button
        class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        onClick={handle}
      >
        change list
      </button>
      {list.map(item => (
        <div key={item.key}>{item.value}</div>
      ))}
    </Fragment>
  );
});

render(<Loop />, document.getElementById('root'));
`;

const exCode1 = hljs.highlight(code, {
  language: 'javascript',
}).value;

const Loop = mount(function (renew) {
  let list: { key: number; value: string }[] = [
    { key: 1, value: 'one' },
    { key: 2, value: 'two' },
    { key: 3, value: 'three' },
    { key: 4, value: 'four' },
  ];
  const handle = () => {
    list = [
      { key: 3, value: 'three three' },
      { key: 2, value: 'two two' },
    ];
    renew();
  };

  return () => (
    <Fragment>
      <button
        class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800"
        onClick={handle}
      >
        change list
      </button>
      {list.map(item => (
        <div key={item.key}>{item.value}</div>
      ))}
    </Fragment>
  );
});

export const Example6 = mount(() => {
  return () => (
    <div class="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1 border-gray-700 sm:p-6 bg-gray-800">
      <h3 class="text-slate-50 text-lg md:text-2xl mb-2">Example 6 - Loop</h3>
      <p class="text-sm md:text-base text-gray-400">
        In the case of a virtual dome generated by a traversal function, this
        code tests whether it works properly according to the key value when the
        data changes, regardless of the length of the data.
      </p>
      <div class="mt-4 px-2 py-2 overflow-x-auto text-sm text-gray-50 border border-gray-200 border-dashed rounded border-gray-600 bg-slate-950">
        <div
          class="font-normal"
          innerHTML={exCode1}
          style={{ whiteSpace: 'pre' }}
        />
      </div>
      <div class="px-2 py-2 text-gray-400 border border-gray-200 border-dashed rounded border-gray-600 bg-slate-950">
        <Loop />
      </div>
    </div>
  );
});
