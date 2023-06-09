// example.jsx
import {
  h,
  Fragment,
  render,
  state,
  ref,
  mounted,
  update,
  effect,
  WDom,
} from 'wwact';

// This is the "mount" function.
// This function is only executed on mount, and on update, only updates `props` and then executes the internal return function.
// childen is passed as the second argument.
const ChildComponent = (props: { parentValue: number }, children: WDom[]) => {
  // The value is used as a "getter" to make it easy to get and write to in the higher-order functions it returns
  const count = state<number>(1);
  const text = state<string>('text');
  const getParentValue = () => props.parentValue;
  const parentValue = props.parentValue;

  // Even if you don't use a ref, the private value is always maintained as a regular variable.
  let notRefValue = props.parentValue;

  // Ref is only used to reference the DOM.
  const domRef = ref(null);

  const increase = () => {
    count.s(count.v + 1);
    notRefValue += 1;
  };

  const handleInputChane = (event: InputEvent) => {
    text.s((event.target as HTMLInputElement).value);
  };

  const handleMounted = () => {
    console.log('MOUNTED', domRef);

    return () => console.log('UNMOUNT');
  };
  const handleUpdated = () => {
    console.log('UPDATE - parentValue');

    return () => console.log('UPDATED');
  };

  mounted(handleMounted); // Only Mounted
  update(handleUpdated, () => [props.parentValue]); // Only Defs Updated (using a closure to update a value)

  // Behaves like `react`'s `useEffect`
  effect(
    () => console.log('INJECT'),
    () => console.log('CLEAN_UP'),
    () => [count.v]
  );

  // Wrap in a function and return (using a closure to hold the value)
  // This is the "update" function.
  return () => (
    <Fragment>
      {/* Note that the event is onInput (we use the native event name to avoid confusion). */}
      <input type="text" value={text.v} onInput={handleInputChane} />
      <div ref={domRef}>count: {count.v}</div>
      {/* When the value is updated from the parent component, the function declared inside is executed, so you need to use the `props.` call by reference to output the latest value of the updated property. */}
      <div>parentValue: {props.parentValue} (working)</div>
      <div>parentValue: {getParentValue()} (working)</div>
      <div>parentValue: {parentValue} (not working)</div>
      <div>sum: {count.v + notRefValue + props.parentValue}</div>
      {/* It doesn't pull it out from under the reference, it uses the value directly, so you can just use it. */}
      <div>notRefValue: {notRefValue}</div>
      {children}
      <button onClick={increase}>Increase</button>
    </Fragment>
  );
};

const Root = () => {
  const parentNumber = state<number>(7);

  const increaseParent = () => {
    parentNumber.s(parentNumber.v + 1);
  };

  const decreaseParent = () => {
    parentNumber.s(parentNumber.v - 1);
  };

  return () => (
    <Fragment>
      <button onClick={decreaseParent}>Decrease - Parent</button>
      <div>
        <ChildComponent parentValue={parentNumber.v}>
          <button onClick={increaseParent}>Increase - Parent</button>
        </ChildComponent>
      </div>
    </Fragment>
  );
};
const root = <Root />;

render(root, document.getElementById('root'));
