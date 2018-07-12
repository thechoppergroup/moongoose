<template lang="html">
    <div class="select">
        <select v-model="selected">
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
    data: function() {
        return {
            selected: 'A',
            options: [
                { text: '18 dp', value: 'A' },
                { text: '24 dp', value: 'B' },
                { text: '36 dp', value: 'C' },
                { text: '48 dp', value: 'D' },
                { text: 'iOS', value: 'E' },
                { text: 'Android', value: 'F' }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.select {
    display: flex;
    align-items: center;
    box-shadow: 0 0 0 .5px black;
    select {
        -moz-appearance: none;
        -webkit-appearance: none;
        background-color: transparent;
        border-radius: 0px;
        border: none;
        padding: .5rem;
        outline: none;
        padding-right: 2rem;
    }
    &-arrow {
        margin-right: .25rem;
    }
}
</style>
