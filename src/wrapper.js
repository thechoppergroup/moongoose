// [Vue 3 Migration — Phase 5.5] Updated to Vue 3 plugin pattern.
// Vue 3 plugins receive the `app` instance (from createApp), not the Vue constructor.
// Consumers install via: app.use(Moongoose)
import moongoose from './moongoose.vue';

const Moongoose = {
    install(app, options) {
        // Register the <moongoose> component globally on the app instance.
        // In Vue 2 this was Vue.component(); in Vue 3 it's app.component().
        app.component(moongoose.name, moongoose);
    }
};

export default Moongoose;
