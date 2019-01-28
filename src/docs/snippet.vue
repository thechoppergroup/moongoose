<template>
<div class="snippet">
    <p>Snippet</p>
    <div class="flx--default snippet-code origin">
        <input v-model="code" class="snippet-code-input"></input>
        <button @click="copyToClipboard" class="snippet-code-copy abs--center-right b0 rst--button"><moongoose name="code" class="snippet-icon e0 abs--center-left" /> {{buttonLabel}}</button>
    </div>
</div>
</template>

<script>
import Icons from '../icons_all';
import Copy from 'copy-to-clipboard';
import Btn from './btn.vue';
import Moongoose from '../moongoose.vue';

export default {
    data: function () {
        return {
            code: "No Icon Selected",
            success: false
        }
    },
    components: {
        Btn,
        Moongoose
    },
    props: {
        currentIcon: ''
    },
    computed: {
        buttonLabel: function () {
            if (this.success) {
                return 'Copied'
            }
            return 'Copy'
        }
    },
    methods: {
            copyToClipboard: function () {
                Copy(`<moongoose :name="${this.currentIcon}"></moongoose>`);
                this.success = true;
                this.$emit('copiedToClipboard');

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

        &-input {
            width: 100%;
            padding: .75rem 1.25rem;
            border-radius: 2px;
            background-color: black;
            color: white;
            border: none;
            overflow-y: auto;
        }

        &-copy {
            height: 50px;
            padding: 0 1rem 0 3rem;
            background: $primary-color;
            color: #ffffff;

            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }
    }

    &-icon {
        transform: translate(.75rem, -50%);
    }
}
</style>
