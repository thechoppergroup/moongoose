<style lang="scss">
.moongoose {
  display: inline-block;

  svg {
    display: inline-block;
    stroke-width: 0;
    stroke: currentColor !important;
    fill: currentColor !important;
    vertical-align: middle;
    height: 1em;
    width: 1em;
  }
}
</style>

<template>
  <i class="moongoose" v-bind="a11yAttrs" v-html="rawHtml"></i>
</template>

<script>
import Icons from "./icons_all";

export default {
  name: "moongoose",
  props: {
    name: String,
    // Accessible name. Without one the icon is decorative and hidden from assistive technology;
    // give icon-only controls a label (or label the control itself).
    label: {
      type: String,
      default: "",
    },
  },

  data: function() {
    var out = { rawHtml: "" };
    return out;
  },

  computed: {
    a11yAttrs: function() {
      return this.label ? { role: "img", "aria-label": this.label } : { "aria-hidden": "true" };
    },
  },

  watch: {
    name: function(newVal, oldVal) {
      this.updateHtml();
    },
  },

  mounted: function() {
    this.updateHtml();
  },

  methods: {
    updateHtml: function() {
      this.rawHtml = Icons[this.name];
    },
  },
};
</script>
