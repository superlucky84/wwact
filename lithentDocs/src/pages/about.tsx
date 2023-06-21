import { h, mount } from 'lithent';
import { ContentHeader } from '@/components/contentHeader';

// grid grid-cols-1 xl:grid-cols-2
export const About = mount(() => {
  return () => (
    <div class="max-w-xl mb-8 px-4 pt-6 xl:gap-4 bg-gray-900">
      <ContentHeader title="Why use Lithent?" />
      <h3 class="text-slate-50 text-lg mt-4">
        Lithent have the bare minimum of necessary functionality, with no
        unnecessary features.
      </h3>
      <p class="text-gray-400 mt-4">
        Since 'react' and 'vue', there have been a lot of UI libraries coming
        out that boast full-stack functionality.
      </p>
      <p class="text-gray-400 mt-4">
        However, in the real world of development, there are times when you need
        to build something using only the bare minimum of key features, rather
        than a full-stack, full-featured library.
      </p>
      <p class="text-gray-400 mt-4">
        Lithent has implemented the bare minimum functionality needed to create
        and update virtual DOM in general (we only need to know 'render',
        'mounter', 'updater', 'renewer', 'mountCallback', and 'updateCallback').
      </p>
      <p class="text-gray-400 mt-4">
        We provide code to extend the basic functionality in the form of
        'helpers', but using them is only optional and we want to encourage
        talented users to extend and develop custom helpers for their own
        projects.
      </p>
      <h3 class="text-slate-50 text-lg mt-4">
        Approach with the developer-friendly concept of closures between
        "component mounter" and "renderer"
      </h3>
      <p class="text-gray-400 mt-4">
        Many existing UI libraries have their advantages, but they also create
        rules that are too strong and rigid for fear of users making mistakes.
      </p>
      <p class="text-gray-400 mt-4">
        JavaScript users are used to using closures and love to develop with
        them.
      </p>
      <p class="text-gray-400 mt-4">
        "Lithent" provide a familiar approach to real-world JavaScript
        development because they leverage the properties of higher-order
        functions and closures in the component mounter to define the properties
        of the component and get the mounted information from the renderer.
      </p>
    </div>
  );
});
