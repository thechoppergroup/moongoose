<style lang="scss">
.moongoose {
    display: inline-block;
    height: 1em;
    width: 1em;
}
</style>

<template>
    <img class="moongoose"
        :src="svg"
        :title="name"
        :style="{ 'width': width, 'height': height }"
        />
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
        width: {
            type: String,
            default: '1em'
        },
        height: {
            type: String,
            default: '1em'
        }
    },

    computed: {
        svg() {
            let svgData = Icons[this.name];
            return `data:image/svg+xml;utf8,${svgData}`;
        }
    }
}
</script>
