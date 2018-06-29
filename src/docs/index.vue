<style lang="scss">
.icons {
    width: 85%;
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;

    &-list {
        display: flex;
        flex-wrap: wrap;
        

        &-icon {
            z-index: 1;

            &:hover {
                z-index: 2;
            }
        }
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
        <ul class="icons-list unstyle">
            <li class="icons-list-icon " v-for="icon in filteredIcons">
                <icon :name="icon"/>
            </li >
        </ul>
    </div>
</template>

<script>
import Icons from 'Moongoose/icons_all.js';
import Icon from 'Docs/icon.vue';
import _ from 'lodash';

export default {
    name: 'preview',
    el: '#app',

    components: {
        Icon
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
