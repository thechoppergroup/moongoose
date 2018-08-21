<template>
<div class="snippet">
    <p>Snippet</p>
    <div class="flx snippet-code">
        <input v-model="code"></input>
        <btn @click.native="copyToClipboard" icon="ios-copy"></btn>
        <span v-show="success">Copied</span>
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
            code: "No Icon Selected",
            success: false
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
                this.success = true;
                setTimeout(() => {
                    this.success = false;
                }, 3000)
            }
    },
    watch: {
        currentIcon: function (newVal) {
            this.code = `<moongoose :name="${newVal}"></moongoose>`;
        }
    }
}
</script>

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
        &-code {
            align-items: center;
        }
        span {
            color: #42b0bd;
            margin-left: -60px;
        }
    }
</style>
