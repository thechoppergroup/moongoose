<template lang="html">
  <fieldset>
      <input ref="slider" @input="input" type="range" min="8" max="72" :value="value" />
  </fieldset>
</template>

<script>
export default {
    name: 'slider',
    props: {
            value: {
                type: String,
                default: '24'
            }
    },
    methods: {
        input: function () {
            this.$emit('input', this.$refs.slider.value);
        }
    }
}
</script>

<style lang="scss">
    fieldset {
        border: 0;
        padding: 0;
        margin: 0;
        display: block;
    }
</style>
