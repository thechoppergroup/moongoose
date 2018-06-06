<template>
    <div>
        <h1>This is the template</h1>
        <ul class="iconList">
            <li class="iconList-item" v-bind:key="icon" v-for="icon in icons">
                <moongoose :name="icon"></moongoose> {{icon}}
            </li>
        </ul>
        
    </div>
</template>

<script>
import moongoose from '../../src/moongoose.vue';
import list from '../../src/icons_list';

export default {
    name: 'app',
    data: function () {
        return {
            icons: list
        }
    },
    components: {
        moongoose
    }
}
</script>

<style lang="scss">
    .iconList {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;

        &-item {
            padding: 1rem;
            line-height: 3rem;
        }
    }
</style>
