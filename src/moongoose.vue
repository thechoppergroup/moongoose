<style lang="scss">
    /*
    span.svg-icon svg {
        color: #8c8c8c;
        cursor: pointer;

        &:hover {
            color: #ffffff;
        }
    }
    */
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
    created: function() {
        this.rawHtml = Icons[this.name];
    }
}
</script>