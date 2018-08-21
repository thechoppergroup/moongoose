<template lang="html">
    <aside class="bottombar" v-show="currentIcon !== ''">
        <div class="bottombar-snippet">
            <snippet :current-icon="currentIcon"></snippet>
        </div>
        <div class="bottombar-similar">
            <p>Similar {{iconSize}}</p>
            <ul class="flx unstyle" v-if="similar.length > 0">
                <li v-for="icon in similar">
                    <icon @click="clickHandler" :name="icon" :size="iconSize" :current-icon="currentIcon"/>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script>
import Btn from './btn.vue';
import Icon from './icon.vue';
import Moongoose from '../moongoose.vue';
import Snippet from './snippet.vue';
import Choice from './choice.vue';
import Meta from './meta.json';

export default {
    name: 'bottombar',
    components: {
        Btn,
        Icon,
        Moongoose,
        Snippet,
        Choice
    },
    props: {
        currentIcon: String,
        similar: Array,
        iconSize: String
    },
    methods: {
        clickHandler: function (iconName) {
            this.$emit('setCurrentIcon', iconName)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
.flx-fill {
    flex: 1 0 auto;
}

.bottombar {
    width: 100%;
    height: 100%;
    background-color: $lightgray;
    position: relative;
    display: flex;
    align-items: center;

    &-snippet {
        width: 66.6666%;
    }

    &-similar {
        width: 33.3333%;
        margin-left: 2rem;
    }


}
</style>
