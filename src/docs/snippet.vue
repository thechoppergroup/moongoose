<style lang="scss" scoped>
    .snippet {
        width: 100%;
        input {
            width: 100%;
            padding: .5rem .75rem;
            border-radius: 2px;
            background-color: black;
            color: white;
            border: none;
            overflow-y: auto;
        }
    }
</style>

<template>
<div class="snippet">
    <p>language</p>
    <div class="flx">
        <input v-model="code"></input>
        <btn @click.native="copyToClipboard" icon="ios-copy"></btn>
    </div>
</div>
</template>

<script>
import Icons from '../icons_all';
import Copy from 'copy-to-clipboard';
import Btn from './btn.vue';

export default {
    data: function () {
        return {
            code: "No Icon Selected"
        }
    },
    components: {
            Btn
    },
    props: {
        currentIcon: ''
    },
    methods: {
            copyToClipboard: function () {
                Copy(`<moongoose :name="${this.currentIcon}"></moongoose>`);
            }
    },
    watch: {
        currentIcon: function (newVal) {
            this.code = `<moongoose :name="${newVal}"></moongoose>`;
        }
    }
}
</script>
