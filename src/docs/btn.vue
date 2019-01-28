<style lang="scss" scoped>
@import '../scss/color.scss';

    button {
        padding: .5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.fill {
            width: 100%;
        }

        &.solid-black {
            background-color: black;
            .text-color, .icon-color {
                color: white;
            }
        }

        &.solid-white {
            background-color: white;
            .text-color, .icon-color {
                color: black;
            }
        }

        &.outline-black {
            box-shadow: 0 0 0 .5px black;
            .text-color, .icon-color {
                color: black;
            }
        }

        &.outline-white {
            box-shadow: 0 0 0 .5px white;
            .text-color, .icon-color {
                color: white;
            }
        }
    }
</style>

<template lang="html">
    <button class="rst--button" :class="classList">
        <span class="text-color">{{pretext}}</span>
        <moongoose :name="icon" class="icon-color c0"></moongoose>
        <span class="text-color">{{sutext}}</span>
    </button>
</template>

<script>
import Moongoose from 'Moongoose/moongoose.vue'

export default {
    name: 'icon-preview',
    props: {
        icon: '',
        variation: '',
        textcolor: '',
        pretext: '',
        sutext: '',
        fill: false
    },
    computed: {
        classList: function () {
            return this.variation + (this.fill ? ' fill': '' );
        }
    },
    components: {
        Moongoose
    }
}
</script>
