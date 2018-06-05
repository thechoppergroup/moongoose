import moongoose from './moongoose.vue';

const Moongoose = {
    install(Vue, options) {
        Vue.component(moongoose.name, {moongoose});
    }
};

export default Moongoose;
