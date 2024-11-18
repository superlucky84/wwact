import { state } from 'lithent/helper';
import { h, mount } from 'lithent';
import Layout from '@/layout';
import { render } from '@/route';

const Index = mount(r => {
  const num = state(1, r);
  const handleClick = () => {
    num.value += 1;
  };
  return () => (
    <Layout>
      <div>09991</div>
      <div>999</div>
      <div>
        <span>{num.value}</span>
        INDEX <button onClick={handleClick}>increase =-{num.value} </button>
        ava
      </div>
      <div>77790</div>
    </Layout>
  );
});

export default render(Index);
