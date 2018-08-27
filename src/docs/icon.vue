<style lang="scss" scoped>
@import '../scss/color.scss';

.icon {
    &-icons {
        padding: .5rem;
        margin: .5rem;
        display: inline-block;
        position: relative;

        img {
            transform: translate(0, 14%);
        }

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
            white-space: nowrap;
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
            color: #F8F8F8;
            font-size: 10px;
            border-radius: 9999px;
            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }

        &-copied {
            transform: translate(-50%, -85%);
            padding: .35rem .5rem;
            background: #f8f8f8;
            color: $primary-color;
            font-size: 10px;
            border-radius: 9999px;
            pointer-events: none;
        }
    }
}

</style>

<template>
    <div class="icon origin">
        <div v-show="name === currentIcon" class="icon-menu unstyle flx">
            <button class="icon-menu-copy abs--top-center" @click="copyToClipboard">Copy</button>
            <span v-show="success" class="icon-menu-copied abs--top-center">Copied</span>
        </div>
        <button @click="$emit('click', name)" :class="{'is-current': name === currentIcon}" class="icon-icons origin">
            <img :src="svgData" :title="name" :style="{width: iconSize}">
            <span class="icon-icons-name">{{name}}</span>
        </button>
    </div>
</template>

<script>
import Moongoose from 'Moongoose/moongoose.vue';
import Copy from 'copy-to-clipboard';
import svgToDataURL from 'svg-to-dataurl';
import Icons from '../icons_all';

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
        },
        svg: function () {
            return Icons[this.name];
        },
        svgData: function () {
            return `data:image/svg+xml;utf8,${this.svg}`
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
    // mounted: function () {
    //     var context = this;
    //     this.$refs.copyImage.addEventListener('click', function () {
    //         SelectText(context.$refs.svgData);
    //         document.execCommand('copy');
    //         window.getSelection().removeAllRanges();
    //     })
    // },
    methods: {
        copyToClipboard: function () {
            Copy(`<moongoose :name="${this.name}"></moongoose>`);
            this.success = true;
            setTimeout(() => {
                this.success = false;
            }, 2000)
        }
    }
}
</script>
