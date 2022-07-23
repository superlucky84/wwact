import { GlobalData } from '@/store';
import { h } from '@/wDom';
import { mounted, unmount, updated, useDataStore, makeData } from '@/hook';

export default function Custom2(
  props: { k: string; data: any; handle3: () => void },
  children: any
) {
  const globalData = useDataStore('globalData') as GlobalData;
  const data7 = makeData({ m: 1 });
  const data = makeData({ v: 1 });
  const gdataUpdate = () => {
    console.log('gdataUpdate');
    globalData.increase();
  };
  const handleMounted = () => {
    console.log('CUSTOM2 MOUNTED');
  };
  const handleUnmount = () => {
    console.log('CUSTOM2 UNMOUNT');
  };
  const handleUpdated = async () => {
    console.log('CUSTOM2 UPDATED --');
  };
  const handleInputChane = (event: InputEvent) => {
    data.v = (event.target as HTMLInputElement).value;
  };

  const componentMaker = () => {
    mounted(handleMounted);
    unmount(handleUnmount);
    updated(handleUpdated, [globalData.value]);

    return (
      <div class="custom2">
        {props.k}-{data7.m}--------------{globalData.item}-{globalData.value}
        <input type="text" value={data.v} onInput={handleInputChane} />
        <button onClick={() => props.handle3()}>handle3</button>
        <button onClick={gdataUpdate}>gdataupdate</button>
        <button onClick={globalData.toggleItem}>handle4</button>
        <article>0{children}0</article>
      </div>
    );
  };

  return componentMaker;
}
