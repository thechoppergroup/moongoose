<style lang="scss">
.moongoose {
    display: inline-block;
    height: 1em;
    width: 1em;

    svg {
        display: inline-block;
        stroke-width: 0;
        stroke: currentColor;
        fill: currentColor;
        vertical-align: middle;
        height: 100%;
        width: 100%;
    }
}
</style>

<template>
    <!-- <i v-once ref="icon" class="moongoose"></i> -->
    <img class="moongoose" :src="svg" />
</template>

<script>
import Icons from './icons_all'

export default {
    name: 'moongoose',

    props: {
        icon: {
            type: String,
            default: '',
        },
    },

    computed: {
        svg() {
            return `data:image/svg+xml;utf8,${Icons[this.icon]}`;
        }
    }
}
</script>
