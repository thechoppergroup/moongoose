<style lang="scss" scoped>
@import '../scss/color.scss';
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

        &.is-current {
            outline: 3px solid $primary-color;
        }
    }

    .icon-menu {
        transform: translate(0, -100%);
    }
</style>

<template>
    <div class="icon origin">
        <ul v-show="name === currentIcon" class="icon-menu unstyle flx abs--top-right">
            <li><button type="button" name="button" @click="copyToClipboard"><moongoose name="ios-copy" :style="{fontSize: '20px'}"></moongoose></button></li>
        </ul>

        <button @click="$emit('click', name)" :class="{'is-current': name === currentIcon}">
            <moongoose :name="name" :style="{fontSize: iconSize}"></moongoose>
            <span>{{name}}</span>
        </button>
        <span v-show="success">Copied!</span>
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
            }, 3000)
        }
    }
}
</script>
