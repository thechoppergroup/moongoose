import moongoose from './moongoose.vue';

const Moongoose = {
    install(Vue, options) {
        Vue.component('moonGoose', {moongoose});
    }
};

export default Moongoose;
