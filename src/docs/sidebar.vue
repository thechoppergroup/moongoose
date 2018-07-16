<template lang="html">
    <aside class="sidebar" v-show="currentIcon !== ''">
        <div class="sidebar-preview">
            <i class="sidebar-preview-icon c1"><moongoose :name="currentIcon"></moongoose></i>
            <span class="sidebar-preview-label">{{currentIcon}}</span>
        </div>
        <div class="sidebar-props">
            <div class="flx gtr--md">
                <div class="flx-fill">
                    <choice :options="sizeOptions" v-model="size"></choice>
                </div>
                <div class="">
                    <btn variation="solid-black" icon="checkmark"></btn>
                </div>
                <div class="">
                    <btn variation="solid-white"></btn>
                </div>
            </div>
        </div>
        <div class="sidebar-assets">
            <span>Assets:</span>
            <div class="flx gtr--md">
                <div class="flx-fill">
                    <btn variation="outline-black" fill="true" icon="android-download" sutext="SVG"></btn>
                </div>
                <div class="flx-fill">
                    <btn variation="outline-black" fill="true" icon="android-download" sutext="PNG"></btn>
                </div>
                <div class="">
                    <btn variation="outline-black" icon="android-share-alt"></btn>
                </div>
            </div>
        </div>
        <div class="sidebar-snippet">
            <snippet :current-icon="currentIcon"></snippet>
        </div>
    </aside>
</template>

<script>
import Btn from './btn.vue';
import Moongoose from '../moongoose.vue';
import Snippet from './snippet.vue';
import Choice from './choice.vue';

export default {
    name: 'sidebar',
    data: function () {
        return {
            sizeOptions:[
                { text: '18 dp', value: 'A' },
                { text: '24 dp', value: 'B' },
                { text: '36 dp', value: 'C' },
                { text: '48 dp', value: 'D' },
                { text: 'iOS', value: 'E' },
                { text: 'Android', value: 'F' }
            ],
            size: 'A'
        }
    },
    components: {
        Btn,
        Moongoose,
        Snippet,
        Choice
    },
    props: {
        currentIcon: ''
    },
    watch: {
        size: function (newVal) {
            this.$emit('iconSizeChanged', newVal);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
.flx-fill {
    flex: 1 0 auto;
}

.sidebar {
    width: 100%;
    height: 100%;
    background-color: $lightgray;
    position: relative;

    &-preview {
        border-bottom: solid thin $darkgray;
        position: relative;
        height: 12rem;

        &-icon {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &-label {
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%);
        }
    }

    &-props {
        margin-top: 2rem;
    }

    &-assets {
        margin-top: 2rem;
    }

    &-snippet {
        margin-top: 2rem;
    }
}
</style>
