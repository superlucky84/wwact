// example.jsx
import { h, Fragment, render, mount, ref, nextTick } from '@/index';
const testChangeRef = ref<null | (() => void)>(null);

const computed = <T,>(
  value: () => T
): {
  value: T;
  v: T;
} => {
  let result = value;

  return {
    get value() {
      return result();
    },
    get v() {
      return result();
    },
    set value(_newValue: T) {
      throw new Error(`You can't change 'computed'`);
    },
    set v(_newValue: T) {
      throw new Error(`You can't change 'computed'`);
    },
  };
};

const Component = mount(renew => {
  let count = 1;
  const increase = () => {
    count += 1;
    renew();
  };
  testChangeRef.value = increase;
  const result = computed<number>(() =>
    [1, 3, 5, 7, 9].reduce(
      (accumulator, current) => accumulator + current * count,
      0
    )
  );

  return () => (
    <>
      <button type="text" onClick={increase}>
        increase
      </button>
      <span>computed: {result.v}</span>
    </>
  );
});

const testWrap =
  document.getElementById('root') || document.createElement('div');

render(<Component />, testWrap);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('Is renew working properly?', () => {
    expect(testWrap.outerHTML).toBe(
      '<div><button type="text">increase</button><span>computed: 25</span></div>'
    );
    if (testChangeRef.value) {
      testChangeRef.value();
      testChangeRef.value();
      testChangeRef.value();
    }
    nextTick().then(() => {
      expect(testWrap.outerHTML).toBe(
        '<div><button type="text">increase</button><span>computed: 100</span></div>'
      );
    });
  });
}
