import { h, Fragment, mount, TagFunction } from 'lithent';

const Main: TagFunction = mount(function () {
  return () => (
    <div>
      <Fragment>
        <div>3</div>
        <div>3</div>
      </Fragment>
    </div>
  );
});

export default Main;
