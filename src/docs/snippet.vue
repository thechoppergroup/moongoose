<template>
<div class="snippet">
    <p>Snippet</p>
    <div class="flx snippet-code origin">
        <input v-model="code"></input>
        <button @click="copyToClipboard" class="snippet-code-copy abs--center-right">Copy</button>
        <span v-show="success" class="snippet-code-copied abs--center-right">Copied</span>
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
                }, 2000)
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
@import '../scss/color.scss';

.snippet {
    width: 100%;
    &-code {
        align-items: center;
        & input {
            width: 100%;
            padding: .75rem 1.25rem;
            border-radius: 2px;
            background-color: black;
            color: white;
            border: none;
            overflow-y: auto;
        }
        &-copy {
            transform: translate(-50% , -50%);
            padding: .25rem .5rem;
            background: $primary-color;
            color: black;
            font-size: 10px;
            border-radius: 9999px;
            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }
        &-copied {
            transform: translate(-40% , -50%);
            padding: .25rem .5rem;
            background: black;
            color: $primary-color;
            font-size: 10px;
            border-radius: 9999px;
            pointer-events: none;
        }
    }
}
</style>
