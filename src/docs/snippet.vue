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
    <input v-model="code"></input>
</div>
</template>

<script>
import Icons from '../icons_all';

export default {
    data: function () {
        return {
            code: "No Icon Selected"
        }
    },
    props: {
        currentIcon: ""
    },
    watch: {
        currentIcon: function (newVal) {
            this.code = Icons[newVal];
        }
    }
}
</script>
