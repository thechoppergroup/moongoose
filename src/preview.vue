<style lang="scss">
.icons {
    width: 85%;
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;

    &-icon {
        display: inline-block;
        margin: 0.5em;
        width: 22%;
        background-color: rgb(248, 249, 250);
        color: rgb(57, 63, 73);
        padding: 1em;
        border-radius: 5px;
    }

    &-search {
        display: block;
        width: 100%;
        font-size: 1em;
        padding: .25em;
        outline: none;
        border-radius: 5px;
        border: solid 3px #d2d2d2;
    }
}
</style>

<template>
    <div class="icons">
        <h1>Moongoose Icons</h1>
        <input class="icons-search" v-model="filter" placeholder="Search icons..."/>
        <span class="icons-icon" v-for="icon in filteredIcons">
            <moongoose :name="icon"/>
            {{ icon }}
        </span>
    </div>
</template>

<script>
import Icons from './icons_all.js';
import Moongoose from './moongoose.vue';
import _ from 'lodash';

export default {
    name: 'preview',
    el: '#app',

    components: {
        Moongoose
    },

    data: function() {
        var out = {
            icons: [],
            filter: ''
        };
        return out;
    },

    created: function() {
        this.icons = _.keys(Icons);
    },

    computed: {
        filteredIcons: function() {
            var self = this;
            return _.filter(_.keys(Icons), function(icon) {
                return icon.indexOf(self.filter) !== -1;
            });
        }
    },

    methods: {
    }
}
</script>
