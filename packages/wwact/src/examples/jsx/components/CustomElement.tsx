import { h, ref, update, wwx, Renew } from 'wwact';
import { store } from 'wwact/helper';
import Custom2 from './Custom2';

const useJw = (renew: Renew) => {
  const data = store<{ k: number; j: number }>({ k: 7, j: 1 }, renew);
  const data2 = store<{ k: number }>({ k: 1 }, renew);

  const handle = () => {
    data.k += 1;
    // data.j += 1;
  };
  const handle2 = () => {
    data2.k += 1;
  };

  return { data, data2, handle, handle2 };
};

export default wwx(function (renew) {
  const { data, data2, handle, handle2 } = useJw(renew);
  const data3 = store<{ k: number }>({ k: 1 }, renew);
  const hadleRef = ref<string>('3');
  const handle3 = () => {
    hadleRef.value = '7';
    data3.k += 1;
  };
  const domRef = ref(null);

  const handleUpdatedDataK = () => () => {
    console.log('domRef', domRef);
    console.log('updated k', data, hadleRef);
    data3.k += 10;
  };
  const handleUpdatedData2K = () => () => {
    console.log('updated 2k', data2);
  };

  update(handleUpdatedDataK, () => [data.k]);
  update(handleUpdatedData2K, () => [data2.k]);

  const componentMaker = () => {
    return (
      <div class={`aaaaaaaaa${data.k}`}>
        <button onClick={handle}>!vava{data.k}aa</button>
        <button onClick={handle2}>{data2.k}-vava</button>
        <button onClick={handle3}>{data3.k}-vava</button>
        {data.k % 2 === 0 ? <span>m</span> : 'jinwoo'}
        {data.k % 2 === 1 && (
          <Custom2 k={data.k} data={data} handle3={handle3}>
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </Custom2>
        )}
        <div ref={domRef}>
          <div>data.k: {data.k}</div>
          <div>data.j: {data.j}</div>
          <div>data2.k: {data2.k}</div>
          <div>data3.k: {data3.k}</div>
        </div>
        <br />
        <br />
      </div>
    );
  };

  return componentMaker;
});
