<style lang="scss">
    .moongoose {
        display: inline-block;
        height: 1em;
        width: 1em;

        svg {
            display: inline-block;
            width: 1em;
            height: 1em;
            stroke-width: 0;
            stroke: currentColor;
            fill: currentColor;
            /*
            height: 1.4em;
            width: 1em;
            fill: currentColor;
            display: block;
            vertical-align: middle;
            */
        }
    }
</style>

<template>
  <i class="moongoose" v-html="rawHtml"></i>
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
