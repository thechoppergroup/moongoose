<template lang="html">
    <aside class="sidebar">
        <div class="sidebar-preview">
            <i class="sidebar-preview-icon c1"><moongoose name="plus"></moongoose></i>
            <span class="sidebar-preview-label">plus</span>
        </div>
        <div class="sidebar-props">
            <choice></choice>
            <btn variation="solid-black" icon="checkmark"></btn>
            <btn variation="solid-white"></btn>
        </div>
        <div class="sidebar-assets">
            <btn variation="outline-black" icon="android-download" sutext="SVG"></btn>
            <btn variation="outline-black" icon="android-download" sutext="PNG"></btn>
            <btn variation="outline-black" icon="android-share-alt"></btn>
        </div>
        <div class="sidebar-snippet">
            <snippet></snippet>
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
    components: {
        Btn,
        Moongoose,
        Snippet,
        Choice
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';

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
        display: flex;
        justify-content: space-between;
        margin: 2rem 0 0
    }

    &-assets {
        display: flex;
        justify-content: space-between;
        margin: 2rem 0 0;
    }

    &-snippet {
        margin: 2rem 0 0;
    }
}
</style>
