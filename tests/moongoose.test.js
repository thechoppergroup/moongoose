import { createApp, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Icons from 'Moongoose/icons_all.js';
import Moongoose from 'Moongoose/moongoose.vue';
import LibEntry from 'Moongoose/index.js';
import Plugin from 'Moongoose/wrapper.js';

// The DOM re-serializes markup (e.g. <path/> becomes <path></path>), so compare against the
// same normalization rather than the raw source string.
const asHtml = (svg) => {
    const t = document.createElement('template');
    t.innerHTML = svg;
    return t.innerHTML;
};

describe('<moongoose>', () => {
    // The SVG is set in mounted(), so it appears one render tick after mount.
    test('renders the named icon inside <i class="moongoose">', async () => {
        const wrapper = mount(Moongoose, { props: { name: '1x1' } });
        await nextTick();
        expect(wrapper.element.tagName).toBe('I');
        expect(wrapper.classes()).toEqual(['moongoose']);
        expect(wrapper.element.innerHTML).toBe(asHtml(Icons['1x1']));
    });

    test('swaps the icon when the name prop changes', async () => {
        const wrapper = mount(Moongoose, { props: { name: '1x1' } });
        await wrapper.setProps({ name: '2x2' });
        expect(wrapper.element.innerHTML).toBe(asHtml(Icons['2x2']));
    });

    test('renders nothing for an unknown name, without throwing', () => {
        const wrapper = mount(Moongoose, { props: { name: 'no-such-icon' } });
        expect(wrapper.element.innerHTML).toBe('');
    });

    // Pins today's markup: no aria-hidden / role. Update when the a11y fix lands.
    test('renders no accessibility attributes', () => {
        const wrapper = mount(Moongoose, { props: { name: '1x1' } });
        expect(wrapper.attributes()).toEqual({ class: 'moongoose' });
    });
});

describe('package entry points', () => {
    test('the lib entry default-exports the component', () => {
        expect(LibEntry).toBe(Moongoose);
    });

    test('the plugin registers <moongoose> globally', () => {
        const app = createApp({});
        app.use(Plugin);
        expect(app.component('moongoose')).toBe(Moongoose);
    });
});
