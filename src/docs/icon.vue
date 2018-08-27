<style lang="scss" scoped>
    @import '../scss/color.scss';

    .icon {
        padding: .75rem;

        &-button {
            padding: .75rem;
            display: block;
            position: relative;

            img {
                transform: translate(0, 14%);
            }

            &-label {
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
                background-color: #D8D8D8;
                
                span {
                    opacity: 1;
                }
            }

            .is-current {
                outline: 3px solid $primary-color;
                background-color:#D8D8D8;

                &:hover {
                    + .icon-menu {
                        display: block;
                    }
                }
                
            }
        }

        &-menu {
            transform: translate(60%, -60%);
            transition: opacity .1s ease;
            transition-delay: .5s;
            opacity: 0;

            &-copy {
                padding: .25rem;
                border-radius: .25rem;
                color: $primary-color;
                

                &:hover {
                    background-color: scale-color($primary-color, $lightness: 90%);
                }

                &.is-successful {
                    background: $primary-color;
                    color: #F8F8F8;
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
        
        &.is-current {
            .icon-button {
                outline: 3px solid $primary-color;
                background-color:#D8D8D8;
            }

            &:hover {
                .icon-menu {
                    transition-delay: 0;
                    opacity: 1;
                }
            }
        }
    }
</style>

<template>
    <div class="icon origin" :class="{'is-current': name === currentIcon}">
        <button @click="$emit('click', name)" class="icon-button origin">
            <img :src="svgData" :title="name" :style="{width: iconSize}">
            <span class="icon-button-label">{{name}}</span>
        </button>

        <div v-show="name === currentIcon" class="icon-menu abs--top-right unstyle flx">
            <button class="icon-menu-copy" @click="copyToClipboard" :class="{'is-successful': success}"><moongoose name="code" class="c0" /></button>
        </div>
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
    methods: {
        copyToClipboard: function () {
            Copy(`<moongoose :name="${this.name}"></moongoose>`);
            this.success = true;
            this.$emit('copiedToClipboard');
            
            setTimeout(() => {
                this.success = false;
            }, 2000)
        }
    }
}
</script>
