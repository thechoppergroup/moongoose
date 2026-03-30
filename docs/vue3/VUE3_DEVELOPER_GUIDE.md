# Vue 2 to Vue 3: Developer Guide for Moongoose

This guide covers the Vue 2 to Vue 3 migration specific to the Moongoose icon library project. Moongoose is an SVG icon library (`@thechoppergroup/moongoose`) written in Vue 3.5.0 with 422 icons and 9 Vue components (1 core + 8 for documentation and preview).

## Quick Reference: Vue 2 vs Vue 3 in Moongoose

| Feature | Vue 2 | Vue 3 | Moongoose Status |
|---------|-------|-------|------------------|
| Plugin Installation | `install(Vue, options)` | `install(app, options)` | **wrapper.js needs update** |
| App Creation | `new Vue({ el, ... })` | `createApp().mount('#id')` | **preview.js needs update** |
| Template Compilation | vue-loader 15, vue-template-compiler | vue-loader 17, @vue/compiler-sfc | ✓ Updated |
| Webpack External Vue | Not externalized | commonjs/amd/root external | ✓ Updated |
| VueLoaderPlugin Import | `require('vue-loader/lib/plugin')` | `require('vue-loader')` | ✓ Updated |
| Options API | Fully supported | Fully supported | ✓ No changes needed |
| Composition API | Not available | Optional | Not used (Options API sufficient) |
| v-model | Single binding per component | Named bindings (modelValue/update:modelValue) | **slider.vue, choice.vue need review** |
| $listeners | Available | Removed (merged into $attrs) | No uses found |
| Filters | Global/local | Removed | Not used |
| Render Functions | `render(h)` parameter | `import { h } from 'vue'` | No render functions in project |

## Vue 3 Plugin Pattern — wrapper.js Update

### Current Vue 2 Pattern (wrapper.js)

```javascript
// OLD: Vue 2 pattern
const install = function(Vue, options) {
  // Vue is the constructor function
  Vue.component('moongoose', Moongoose)
}

export default { install }
```

The Vue 2 pattern expects `Vue.install()` to receive the Vue constructor function as the first argument. This pattern is deprecated in Vue 3.

### Updated Vue 3 Pattern (Action Required)

```javascript
// NEW: Vue 3 pattern
const install = function(app, options) {
  // app is the application instance created by createApp()
  // This pattern aligns with Vue 3's application-scoped plugins
  app.component('moongoose', Moongoose)
}

export default { install }
```

### Usage in Consuming Applications

**Vue 2 Usage:**
```javascript
// In consumer app (Vue 2)
import Vue from 'vue'
import Moongoose from '@thechoppergroup/moongoose'
Vue.use(Moongoose)
```

**Vue 3 Usage (Required):**
```javascript
// In consumer app (Vue 3)
import { createApp } from 'vue'
import Moongoose from '@thechoppergroup/moongoose'

const app = createApp({ /* ... */ })
app.use(Moongoose)  // Pass the app instance, not Vue
app.mount('#app')
```

---

## App Creation Pattern — preview.js Update

### Current Vue 2 Pattern (preview.js)

The documentation and preview application in `preview.js` uses the Vue 2 constructor syntax:

```javascript
// OLD: Vue 2 pattern
new Vue({
  el: '#app',
  template: '<App />',
  components: { App }
})
```

This pattern is no longer supported in Vue 3. The `el` property is removed, and mounting is explicit.

### Updated Vue 3 Pattern (Action Required)

```javascript
// NEW: Vue 3 pattern
import { createApp } from 'vue'

const app = createApp({
  template: '<App />',
  components: { App }
})

app.mount('#app')  // Explicit mount call
```

### With Options

```javascript
// If preview.js has additional configuration
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)  // Or pass the component directly

// Add plugins/config as needed
app.config.globalProperties.$someProperty = value

app.mount('#app')
```

---

## Template Compilation: vue-loader 17 & @vue/compiler-sfc

Moongoose has been upgraded to use Vue 3 compatible tooling:

- **vue-loader**: 15.x → **17.4.0+** (supports Vue 3 single-file components)
- **@vue/compiler-sfc**: **3.5.0** (handles template compilation to render functions)
- **vue-template-compiler**: Removed (replaced by @vue/compiler-sfc)

### Impact on `.vue` Files

All `.vue` files in Moongoose continue to work without modification. The compiler handles:

- Template syntax (no changes needed — Vue 3 is backward compatible with Vue 2 templates)
- Script setup syntax (available for new components, but not required)
- Scoped styles (unchanged)

Example component (no changes required):
```vue
<template>
  <svg :class="['moongoose-icon', iconClass]">
    <use :xlink:href="`#icon-${icon}`" />
  </svg>
</template>

<script>
export default {
  props: {
    icon: String,
    size: { type: String, default: '24px' }
  },
  computed: {
    iconClass() {
      return `icon-${this.size}`
    }
  }
}
</script>
```

---

## Webpack Configuration: vue Externalized

The Moongoose webpack configuration has been updated to externalize Vue, preventing duplicate Vue runtimes in consuming applications.

### In webpack.config.js

```javascript
// Vue is externalized so consuming apps provide their own Vue 3 instance
externals: {
  vue: {
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
    root: 'Vue'
  }
}
```

### Why This Matters

1. **Dependency Management**: Consuming apps (moonscape, moonshine) handle their own Vue 3 dependency
2. **Build Size**: Moongoose dist doesn't include Vue runtime (smaller bundles)
3. **Version Control**: Apps can independently upgrade Vue while Moongoose components work with all Vue 3.x versions
4. **Bundle Duplication**: Prevents two copies of Vue in the final app

### Consuming App Requirements

When importing Moongoose in moonscape or moonshine:

```javascript
// These apps MUST have Vue 3 installed and configured
import Vue from 'vue'
import Moongoose from '@thechoppergroup/moongoose'

// For npm link (local development):
// npm link ../moongoose
// npm link
```

---

## VueLoaderPlugin Import Path Change

### Old Path (Vue 2)

```javascript
// webpack.base.js (OLD)
const VueLoaderPlugin = require('vue-loader/lib/plugin')
```

This path was specific to vue-loader 15.

### New Path (Vue 3)

```javascript
// webpack.base.js (NEW)
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
// OR
const { VueLoaderPlugin } = require('vue-loader')
```

The plugin is now exported directly from the main vue-loader module.

---

## Options API Still Fully Supported

Moongoose components use the **Options API** exclusively — there is no need to migrate to the Composition API.

### Supported Vue 2 Patterns (Still Work in Vue 3)

```vue
<script>
export default {
  props: ['icon', 'size'],
  data() {
    return { isActive: false }
  },
  computed: {
    displayName() {
      return this.icon.toUpperCase()
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive
    }
  },
  watch: {
    icon(newVal, oldVal) {
      console.log(`Icon changed from ${oldVal} to ${newVal}`)
    }
  },
  created() {
    // Lifecycle hook — still works
  },
  mounted() {
    // Lifecycle hook — still works
  }
}
</script>
```

All of these patterns continue to work in Vue 3 without modification.

### When to Use Composition API (Optional)

For new components, the Composition API offers better organization for complex logic:

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps(['icon', 'size'])
const isActive = ref(false)

const displayName = computed(() => props.icon.toUpperCase())

const toggle = () => { isActive.value = !isActive.value }

watch(() => props.icon, (newVal, oldVal) => {
  console.log(`Icon changed from ${oldVal} to ${newVal}`)
})
</script>
```

However, this is **optional** — keep using Options API if it's simpler for your use case.

---

## v-model Changes: modelValue and update:modelValue

Vue 3 changes the v-model syntax for custom components. This affects **slider.vue** and **choice.vue**.

### Vue 2 Pattern

```vue
<!-- Parent (Vue 2) -->
<MyComponent v-model="value" />

<!-- Component (Vue 2) -->
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(newVal) {
      this.$emit('input', newVal)  // Emits 'input' event
    }
  }
}
</script>
```

The implicit binding is to the `value` prop and `input` event.

### Vue 3 Pattern

```vue
<!-- Parent (Vue 3) -->
<MyComponent v-model="value" />

<!-- Component (Vue 3) -->
<script>
export default {
  props: ['modelValue'],  // Renamed from 'value'
  emits: ['update:modelValue'],  // Explicit event declaration
  methods: {
    updateValue(newVal) {
      this.$emit('update:modelValue', newVal)  // New event name
    }
  }
}
</script>
```

### In Moongoose: slider.vue and choice.vue

These components currently emit `'input'` events (Vue 2 convention). They should be updated to emit `'update:modelValue'` and use the `modelValue` prop for full Vue 3 compatibility.

**Example Update to slider.vue:**

```vue
<template>
  <input
    type="range"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>
```

---

## Event Handling: $emit, $listeners, and $attrs

### $emit (Unchanged)

The `$emit()` method works the same way in Vue 3:

```javascript
this.$emit('custom-event', payload)
```

### $listeners (Removed)

In Vue 2, `$listeners` contained all event listeners passed to a component:

```vue
<!-- Vue 2 -->
<ChildComponent v-on="$listeners" />
```

Vue 3 removes `$listeners` because event listeners are merged into `$attrs`.

### $attrs (Enhanced)

In Vue 3, `$attrs` now includes both attributes **and** event listeners:

```vue
<!-- Vue 3 — event listeners are in $attrs -->
<ChildComponent v-bind="$attrs" />
```

### Recommended Practice for Moongoose

In components that pass through events (wrapper or preview components):

```vue
<script>
export default {
  // Explicitly declare which events this component emits
  emits: ['icon-selected', 'size-changed'],
  methods: {
    handleIconClick(icon) {
      this.$emit('icon-selected', icon)
    }
  }
}
</script>
```

---

## Lifecycle Hooks

Moongoose uses these lifecycle hooks, all of which are unchanged from Vue 2 to Vue 3:

| Hook | Vue 2 | Vue 3 | Usage |
|------|-------|-------|-------|
| `beforeCreate()` | ✓ | ✓ | Setup before data/computed |
| `created()` | ✓ | ✓ | After instance is created |
| `beforeMount()` | ✓ | ✓ | Before DOM rendering |
| `mounted()` | ✓ | ✓ | After DOM is ready |
| `beforeUpdate()` | ✓ | ✓ | Before re-render |
| `updated()` | ✓ | ✓ | After re-render |
| `beforeUnmount()` | Changed from beforeDestroy | ✓ | Before component removed |
| `unmounted()` | Changed from destroyed | ✓ | After component removed |

Moongoose does not use `beforeDestroy()` or `destroyed()`, so no changes are needed.

---

## Filters (Not Used)

Vue 3 **removed global and local filters**. Moongoose does not use filters, so no migration is needed. If filters are added in the future, use computed properties or methods instead:

```vue
<!-- Vue 2 (Filters) -->
<div>{{ message | capitalize }}</div>

<!-- Vue 3 (Computed Property) -->
<div>{{ capitalizedMessage }}</div>

<script>
export default {
  computed: {
    capitalizedMessage() {
      return this.message.charAt(0).toUpperCase() + this.message.slice(1)
    }
  }
}
</script>
```

---

## Code Examples: Before and After

### Example 1: Component with Props and Events

**Vue 2 (moongoose.vue):**
```vue
<template>
  <div class="moongoose-wrapper">
    <img :src="iconUrl" @click="selectIcon" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    size: { type: String, default: '24px' }
  },
  computed: {
    iconUrl() {
      return `/icons/${this.icon}.svg`
    }
  },
  methods: {
    selectIcon() {
      this.$emit('icon-selected', this.icon)
    }
  }
}
</script>
```

**Vue 3 (No Changes — Options API Still Works):**
```vue
<template>
  <div class="moongoose-wrapper">
    <img :src="iconUrl" @click="selectIcon" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    size: { type: String, default: '24px' }
  },
  emits: ['icon-selected'],  // ADDED: Explicit event declaration (optional but recommended)
  computed: {
    iconUrl() {
      return `/icons/${this.icon}.svg`
    }
  },
  methods: {
    selectIcon() {
      this.$emit('icon-selected', this.icon)
    }
  }
}
</script>
```

### Example 2: Plugin Installation (wrapper.js)

**Vue 2 (Current — NEEDS UPDATE):**
```javascript
import Moongoose from './moongoose.vue'

const install = function(Vue, options) {
  Vue.component('moongoose', Moongoose)
}

export default { install }
```

**Vue 3 (Target):**
```javascript
import Moongoose from './moongoose.vue'

const install = function(app, options) {
  app.component('moongoose', Moongoose)
}

export default { install }
```

### Example 3: App Initialization (preview.js)

**Vue 2 (Current — NEEDS UPDATE):**
```javascript
import Vue from 'vue'
import App from './index.vue'
import Moongoose from './wrapper.js'

Vue.use(Moongoose)

new Vue({
  el: '#app',
  template: '<App />',
  components: { App }
})
```

**Vue 3 (Target):**
```javascript
import { createApp } from 'vue'
import App from './index.vue'
import Moongoose from './wrapper.js'

const app = createApp({
  template: '<App />',
  components: { App }
})

app.use(Moongoose)  // Install plugin after createApp
app.mount('#app')
```

---

## Testing for Vue 3 Compatibility

When developing or modifying components:

1. **Build locally**: `npm run build`
2. **Link in moonscape**: `npm link` (from moongoose), `npm link @thechoppergroup/moongoose` (from moonscape)
3. **Rebuild moonscape**: `npm run build`
4. **Test in moonscape**: Verify icons render and interactive components (slider, choice) work
5. **Test in moonshine**: Link moonscape, rebuild moonshine, verify full integration
6. **Check bundle size**: Ensure Vue is externalized (not included in moongoose dist)

---

## Summary

Moongoose is fundamentally compatible with Vue 3 thanks to the Options API remaining unchanged. The key items that need attention are:

1. **wrapper.js**: Update `install(Vue, options)` → `install(app, options)`
2. **preview.js**: Replace `new Vue()` → `createApp().mount()`
3. **slider.vue, choice.vue**: Consider updating v-model patterns to use `modelValue` and `update:modelValue` (optional but recommended)
4. **Component improvements**: Add `emits` declarations for clearer intent

For ongoing development, follow the Vue 3 best practices outlined in the Vue 3 Best Practices guide.
