import moongoose from './components/icon.vue'

const Moongoose = {
    install(Vue, options) {
        Vue.mixin({
            component: {moongoose},
        });
    }
};

export default Moongoose;