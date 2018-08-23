<style lang="scss" scoped>
@import '../scss/color.scss';

$identity-width: 3rem;
$bottombar-height: 10rem;

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
    top: 123px;
    left: calc(2rem + #{$identity-width});
    right: 2rem;
    bottom: $bottombar-height;
    padding-top: 1.5rem;
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

.header {
    position: fixed;
    width: calc(100% - #{$identity-width});
    left: $identity-width;
    padding: 2rem;
    padding-bottom: 0;
    &-headers {
        align-items: center;
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
        &-slider {
            padding: 0 2rem;
        }
        &-sizedisplay {

        }
    }
}

.bottombar {
    position: fixed;
    height: $bottombar-height;
    width: calc(100% - #{$identity-width});
    left: $identity-width;
    right: 0;
    bottom: 0;
    padding: 0 2rem;
}

</style>

<template>
    <main>
        <div class="identity">
            <identity></identity>
        </div>
        <div class="header">
            <h1>Moongoose Icons</h1>
            <div class="flx header-headers">
                <input class="header-headers-search" v-model="filter" placeholder="Search icons..."/>
                <slider class="header-headers-slider" v-model="iconSize"></slider>
                <p class="header-headers-sizedisplay">{{iconSize}}px</p>
            </div>
        </div>
        <div class="icons">
            <ul class="icons-list unstyle">
                <li v-bind:key="icon" class="icons-list-icon" v-for="icon in filteredIcons">
                    <icon @click="setCurrentIcon" :name="icon" :size="iconSize" :current-icon="currentIcon"/>
                </li>
            </ul>
        </div>
        <bottombar @setCurrentIcon="setCurrentIcon" :current-icon="currentIcon" :similar="similar" iconSize="24"></bottombar>
    </main>
</template>

<script>
import _ from 'lodash';
import Icons from 'Moongoose/icons_all.js';
import Icon from './icon.vue';
import Btn from './btn.vue';
import Bottombar from './bottombar.vue';
import Identity from './identity.vue';
import Meta from './meta.json';
import Slider from './slider.vue';

export default {
    name: 'preview',
    el: '#app',

    components: {
        Icon,
        Btn,
        Bottombar,
        Identity,
        Slider
    },

    data: function() {
        return {
            icons: [],
            btn: [],
            filter: '',
            iconSize: '24',
            currentIcon: '',
            similar: [],
        }
    },

    created: function() {
        this.icons = _.keys(Icons);
    },

    computed: {
        filteredIcons: function() {
            var self = this;

            function search(icons, searchString) {
                searchString = searchString.toLowerCase();
                if (searchString === '') {
                    return Object.keys(icons);
                }

                var foundIcons = _.filter(_.keys(icons), function(key) {
                  var search = icons[key].searchTerms;
                  var results = _.filter(search, function(term) {
                      return _.includes(term, searchString);
                  })
                  return (results.length > 0);
                });

                return foundIcons;
            }

            return search(Meta, self.filter);
        }
    },

    methods: {
        setCurrentIcon: function (iconName) {
            this.similar = Meta[iconName].similar;
            this.currentIcon = iconName;
        }
    }


}
</script>
