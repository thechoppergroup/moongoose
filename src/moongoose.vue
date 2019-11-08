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
    <i ref="icon" class="moongoose"></i>
</template>

<script>
import Icons from './icons_all'

export default {
    name: 'moongoose',
    props: {
        name: {
            type: String,
            default: '',
        },
    },

    mounted() {
        this.updateInnerHtml();
    },

    watch: {
        name() {
            this.updateInnerHtml();
        }
    },

    methods: {
        updateInnerHtml() {
            this.$refs.icon.innerHTML = Icons[this.name];
        }
    }
}
</script>
