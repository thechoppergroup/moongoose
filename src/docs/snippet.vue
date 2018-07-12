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
export default {
    data: function () {
        return {
            code: "<div class='test'>Hello Code this is a long code that needs to be copied and pasted</div>"
        }
    }
}
</script>
