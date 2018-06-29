<style lang="scss" scoped>
    button {
        padding: .5rem;
        margin: .5rem;
        display: inline-block;
        position: relative;

        span {
            position: absolute;
            top: calc(100% + .25rem);
            left: 50%;
            transform: translate(-50%);
            opacity: 0;
            pointer-events: none;
            padding: .5rem;
            background: #E7E7E7;
            box-shadow: 0 2px 2px rgba(black, 0.6);
        }

        &:hover {
            background-color:#D8D8D8;

            span {
                opacity: 1;
            }
        }
    }
</style>

<template>
    <button @mouseover="showNow()">
        <moongoose :name="name" class="a1" v-if="show"></moongoose>
        <span>{{name}}</span>
    </button>
</template>

<script>
import Moongoose from 'Moongoose/moongoose.vue'

export default {
    name: 'icon-preview',
    data: () => {
        return {
            show: false
        }
    },
    props: {
        name: ''
    },
    components: {
        Moongoose
    },
    methods: {
        showNow: function () {
            this.show = true
        }
    }
}
</script>
