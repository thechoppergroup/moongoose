// [Vue 3 Migration — Phase 5.5] Updated to Vue 3 createApp pattern.
// Replaces `new Vue(Preview)` which is not supported in Vue 3.
// The `el` option has been removed from the Preview component;
// mounting is now handled explicitly via .mount('#app').
import { createApp } from 'vue';
import Preview from 'Docs/index.vue';

window.App = createApp(Preview).mount('#app');
