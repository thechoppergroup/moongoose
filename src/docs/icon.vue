<style lang="scss" scoped>
@import '../scss/color.scss';

.icon {
    &-icons {
        padding: .5rem;
        margin: .5rem;
        display: inline-block;
        position: relative;

        &-name {
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

        &.is-current {
            outline: 3px solid $primary-color;
        }
    }

    &-menu {

        &-copy {
            transform: translate(-50%, -85%);
            padding: .25rem .5rem;
            background: $primary-color;
            color: white;
            font-size: 10px;
            border-radius: 9999px;
            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }

        &-copied {
            transform: translate(-50%, -85%);
            padding: .25rem .5rem;
            background: $primary-color;
            color: white;
            font-size: 10px;
            border-radius: 9999px;
            pointer-events: none;
        }
    }
}

</style>

<template>
    <div class="icon origin">
        <div v-show="name === currentIcon" class="icon-menu abs--top-center origin">
            <button class="abs--top-center icon-menu-copy" @click="copyToClipboard">Copy</button>
            <span class="abs--top-center icon-menu-copied" v-show="success">Copied!</span>
        </div>
        <button class="icon-icons" @click="$emit('click', name)" :class="{'is-current': name === currentIcon}">
            <moongoose :name="name" :style="{fontSize: iconSize}"></moongoose>
            <span class="icon-icons-name">{{name}}</span>
        </button>
    </div>
</template>

<script>
import Moongoose from 'Moongoose/moongoose.vue';
import Copy from 'copy-to-clipboard';

export default {
    name: 'icon-preview',
    props: {
        name: '',
        size: '',
        currentIcon: ''
    },
    computed: {
        iconSize: function () {
            return this.size + 'px';
        }
    },
    data: function() {
        return {
            success: false
        }
    },
    components: {
        Moongoose
    },
    methods: {
        copyToClipboard: function () {
            Copy(`<moongoose :name="${this.name}"></moongoose>`);
            this.success = true;
            setTimeout(() => {
                this.success = false;
            }, 800)
        }
    }
}
</script>
