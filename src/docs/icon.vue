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
<<<<<<< HEAD
        <div v-show="name === currentIcon" class="icon-menu abs--top-center origin">
            <button class="abs--top-center icon-menu-copy" @click="copyToClipboard">Copy</button>
            <span class="abs--top-center icon-menu-copied" v-show="success">Copied!</span>
        </div>
        <button class="icon-icons" @click="$emit('click', name)" :class="{'is-current': name === currentIcon}">
            <moongoose :name="name" :style="{fontSize: iconSize}"></moongoose>
            <span class="icon-icons-name">{{name}}</span>
=======
        <ul v-show="name === currentIcon" class="icon-menu unstyle flx abs--top-right">
            <li><button type="button" name="button" @click="copyToClipboard"><moongoose name="ios-copy" :style="{fontSize: '20px'}"></moongoose></button></li>
        </ul>

        <button @click="$emit('click', name)" :class="{'is-current': name === currentIcon}">
            <img :src="svgData" :title="name" :style="{width: iconSize}">
            <span>{{name}}</span>
>>>>>>> 2006c13d404c89719fb02f357c963b1729ffadf3
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
    mounted: function () {
        var context = this;
        this.$refs.copyImage.addEventListener('click', function () {
            SelectText(context.$refs.svgData);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        })
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
