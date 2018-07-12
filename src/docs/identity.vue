<template lang="html">
  <aside class="identity">
      <div class="identity-logo a1"><moongoose name="workstorm"></moongoose></div>
      <div class="identity-copyright">Workstorm LLC All Rights Resversed</div>
  </aside>
</template>

<script>
import Moongoose from 'Moongoose/moongoose.vue'

export default {
    name: 'identity',
    components: {
        Moongoose
    }
}
</script>

<style lang="scss" scoped>
    .identity {

        &-logo {
            position: fixed;
            transform: rotate(90deg);
            top: 2.25rem; 
        }

        &-copyright {
            position: fixed;
            transform: rotate(90deg);
            bottom: 9rem;
        }
    }
</style>
