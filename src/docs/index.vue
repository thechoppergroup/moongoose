<style lang="scss" scoped>
@import '../scss/color.scss';

$sidebar-width: 20rem;
$identity-width: 3rem;

main {
    background-color: $smokewhite;
    position: absolute;
    height: 100%;
    width: 100%;
}

.icons {
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
    top: 2rem;
    right: calc(2rem + #{$sidebar-width});
    left: calc(2rem + #{$identity-width});
    bottom: 2rem;
    font-size: 18px;

    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &-icon {
            z-index: 1;

            &:hover {
                z-index: 2;
            }
        }
    }

    &-search {
        position: sticky;
        display: block;
        top: 0;
        width: 100%;
        font-size: 1em;
        margin: 1em 0;
        padding: .75em;
        outline: none;
        background-color: white;
        border: none;
        z-index: 3;
    }
}

.identity {
    position: fixed;
    display: flex;
    justify-content: space-around;
    background-color: white;
    width: $identity-width;
    top: 0;
    bottom: 0;
}

.sidebar {
    position: fixed;
    width: $sidebar-width;
    top: 0;
    bottom: 0;
    left: calc(100% - #{$sidebar-width});
    padding: 0 2rem;
}

</style>

<template>
    <main>
        <div class="identity">
            <identity></identity>
        </div>
        <div class="icons">
            <h1>Moongoose Icons</h1>
            <input class="icons-search" v-model="filter" placeholder="Search icons..."/>
            <ul class="icons-list unstyle">
                <li class="icons-list-icon " v-for="icon in filteredIcons">
                    <icon :name="icon"/>
                </li>
            </ul>
        </div>
        <div class="sidebar">
            <sidebar></sidebar>
        </div>
    </main>
</template>

<script>
import _ from 'lodash';
import Icons from 'Moongoose/icons_all.js';
import Icon from './icon.vue';
import Btn from './btn.vue';
import Sidebar from './sidebar.vue';
import Identity from './identity.vue';

export default {
    name: 'preview',
    el: '#app',

    components: {
        Icon,
        Btn,
        Sidebar,
        Identity
    },

    data: function() {
        var out = {
            icons: [],
            btn: [],
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
