<style lang="scss">
    .svg-icon svg {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }
</style>

<template>
  <span class="svg-icon" v-html="rawHtml"></span>
</template>

<script>
import Icons from './icons_all'

export default {
    name: 'moongoose',
    props: ['name'],

    data: function() {
        var out = { rawHtml: '' };
        return out;
    },

    watch: {
        name: function(newVal, oldVal) {
            this.updateHtml();
        }
    },

    mounted: function() {
        this.updateHtml();
    },

    methods: {
        updateHtml: function() {
            this.rawHtml = Icons[this.name];
        }
    }
}
</script>
