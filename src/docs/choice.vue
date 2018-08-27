<template lang="html">
    <div class="select">
        <select v-model="model" @change="changeHandler">
            <option v-for="option in options" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
        <moongoose class="select-arrow" name="arrow-down-b"></moongoose>
    </div>
</template>

<script>
import Moongoose from '../moongoose.vue';

export default {
    name: 'choice',
    components: {
        Moongoose
    },
    data: function () {
            return {
                model: ''
            }
    },
    props: {
        options: [],
        selected: ''
    },
    methods: {
        changeHandler: function () {
            this.$emit('input', this.model);
        }
    }
}
</script>

<style lang="scss" scoped>
.select {
    box-shadow: 0 0 0 .5px black;
    position: relative;
    height: 2.25em;

    select {
        -moz-appearance: none;
        -webkit-appearance: none;
        background-color: transparent;
        border-radius: 0px;
        border: none;
        padding: .5rem;
        outline: none;
        width: 100%;
    }

    &-arrow {
        margin-right: .25rem;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        pointer-events: none;
    }
}
</style>
