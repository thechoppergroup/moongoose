# Vue 3 Best Practices for Moongoose Development

This guide outlines best practices for developing Moongoose components and maintaining the icon library in the Vue 3 ecosystem.

---

## Overview

Moongoose is now a Vue 3 library. These best practices ensure consistency, maintainability, and compatibility as new features are added and components are updated.

**Key Principle**: Options API is the current standard for Moongoose. Composition API is optional for new code where it improves clarity.

---

## 1. Component Development

### 1.1 Use Options API for Most Components

The Options API remains the best choice for Moongoose components because:

- **Icon library is simple**: Components are mostly presentational (icons, sliders, choice lists)
- **Options API is familiar**: The entire codebase uses it
- **Backward compatibility**: Easier to understand for developers familiar with Vue 2
- **Less boilerplate**: For simple components, Options API has less overhead

### Pattern: Standard Component

```vue
<template>
  <div class="icon-container">
    <svg :class="['icon', `icon-${size}`]">
      <use :xlink:href="`#${iconId}`" />
    </svg>
  </div>
</template>

<script>
export default {
  // Explicitly declare component name (helps with debugging)
  name: 'IconComponent',

  // Declare props with type validation
  props: {
    iconId: {
      type: String,
      required: true,
      validator: (value) => /^[a-z0-9_-]+$/.test(value)
    },
    size: {
      type: String,
      default: '24px',
      validator: (value) => ['16px', '24px', '32px', '48px'].includes(value)
    },
    color: String
  },

  // Declare emitted events (Vue 3 best practice)
  emits: ['click', 'load-error'],

  // Data properties
  data() {
    return {
      isLoaded: false,
      loadError: false
    }
  },

  // Computed properties for derived state
  computed: {
    // Computed properties are cached based on dependencies
    iconSize() {
      return parseInt(this.size, 10)
    },

    iconStyle() {
      return {
        width: this.size,
        height: this.size,
        color: this.color || 'inherit'
      }
    }
  },

  // Watch object/property changes
  watch: {
    iconId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isLoaded = false
        this.loadError = false
        console.log(`Icon changed from ${oldVal} to ${newVal}`)
      }
    }
  },

  // Lifecycle hooks
  created() {
    // Called when the component instance is created
    // Good place for initializing data or making API calls
  },

  mounted() {
    // Called after the component is mounted to DOM
    // Good place for setting up event listeners or loading resources
    this.$nextTick(() => {
      // Ensures DOM has been fully rendered
      this.checkIconLoaded()
    })
  },

  // Methods
  methods: {
    // All methods should have clear, single responsibility
    checkIconLoaded() {
      // Implementation
      this.isLoaded = true
    },

    handleClick() {
      // Emit events with a clear intent
      this.$emit('click', {
        iconId: this.iconId,
        size: this.size,
        timestamp: Date.now()
      })
    }
  }
}
</script>

<style scoped>
/* Scoped styles are automatically namespaced to this component */
.icon-container {
  display: inline-flex;
  align-items: center;
}

.icon {
  flex-shrink: 0;
}
</style>
```

---

### 1.2 Composition API for Complex Logic (Optional)

For new components with complex state management or reusable logic, consider the Composition API with `<script setup>`:

```vue
<template>
  <div class="icon-editor">
    <input v-model="searchQuery" placeholder="Search icons..." />
    <div class="results">
      <button
        v-for="icon in filteredIcons"
        :key="icon.id"
        @click="selectIcon(icon)"
      >
        {{ icon.name }}
      </button>
    </div>
    <div v-if="selectedIcon" class="preview">
      <svg :title="`Selected: ${selectedIcon.name}`">
        <use :xlink:href="`#${selectedIcon.id}`" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIconSearch } from './composables/useIconSearch'

// Define props
const props = defineProps({
  icons: {
    type: Array,
    required: true
  }
})

// Define emits
const emit = defineEmits(['icon-selected'])

// Reactive state
const searchQuery = ref('')
const selectedIcon = ref(null)

// Use composable for complex logic
const { search } = useIconSearch()

// Computed properties
const filteredIcons = computed(() => {
  return search(props.icons, searchQuery.value)
})

// Methods
const selectIcon = (icon) => {
  selectedIcon.value = icon
  emit('icon-selected', icon)
}
</script>

<style scoped>
.icon-editor {
  padding: 1rem;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}
</style>
```

**When to Use Composition API**:
- Complex filtering/searching logic
- Multiple related state variables that benefit from logical grouping
- Reusable composable functions (hooks)
- Heavy use of watchers or computed properties

**When to Stick with Options API**:
- Simple presentational components (most icons)
- Single responsibility components
- Straightforward props → template → emit pattern

---

## 2. Plugin Pattern

### 2.1 Plugin Installation

Moongoose exports a Vue 3 plugin. The correct pattern is:

```javascript
// src/wrapper.js
import Moongoose from './moongoose.vue'

const install = function(app, options) {
  // app is the Vue application instance (from createApp())
  // Register the component globally
  app.component('moongoose', Moongoose)

  // Optional: Add global properties if needed
  if (options?.globalProperty) {
    app.config.globalProperties.$moongooseConfig = options.globalProperty
  }
}

export default {
  install,
  version: '__VERSION__' // Updated at build time if needed
}
```

### 2.2 Plugin Usage in Consumer Applications

```javascript
// In moonscape/main.js or similar
import { createApp } from 'vue'
import App from './App.vue'
import Moongoose from '@thechoppergroup/moongoose'

const app = createApp(App)

// Install the plugin
app.use(Moongoose, {
  // Optional: pass configuration
  globalProperty: { /* ... */ }
})

app.mount('#app')
```

### 2.3 What NOT to Do

```javascript
// ❌ DO NOT: Vue 2 pattern (won't work in Vue 3)
const install = function(Vue, options) {
  Vue.component('moongoose', Moongoose)
}

// ❌ DO NOT: Try to access Vue constructor
// There is no global Vue in Vue 3 — it's app-scoped
app.config.globalProperties.Vue  // ❌ This doesn't work
```

---

## 3. Event Handling

### 3.1 Declare Emitted Events

Always use the `emits` option to declare which events a component emits:

```vue
<script>
export default {
  emits: {
    // Simple declaration
    'icon-click': null,

    // Or with payload validation
    'icon-selected': (payload) => {
      if (!payload.iconId) return false  // Validation fails
      return true  // Validation passes
    },

    'size-changed': (newSize) => {
      return ['16px', '24px', '32px'].includes(newSize)
    }
  },

  methods: {
    handleClick() {
      this.$emit('icon-click', { /* payload */ })
    }
  }
}
</script>
```

**Benefits**:
- Self-documenting component interface
- IDE autocomplete for events
- TypeScript type inference
- Vue DevTools event tracking

### 3.2 Event Naming Convention

Use kebab-case (lowercase-with-dashes) for event names:

```vue
<script>
export default {
  emits: [
    'icon-selected',      // ✓ Good
    'search-input',       // ✓ Good
    'error-occurred',     // ✓ Good

    // ❌ Avoid these patterns:
    // 'iconSelected',    // camelCase looks like a prop/method
    // 'Icon-Selected',   // Mixed case inconsistent
    // 'icon_selected'    // Underscore less common in Vue
  ]
}
</script>
```

### 3.3 Event Payload Best Practices

Emit objects with clear structure, not arbitrary values:

```vue
<script>
export default {
  methods: {
    selectIcon(iconId) {
      // ❌ Bad: Emit just the ID
      // this.$emit('select', iconId)

      // ✓ Good: Emit an object with context
      this.$emit('icon-selected', {
        iconId,
        timestamp: Date.now(),
        source: 'user-click'
      })
    }
  }
}
</script>
```

---

## 4. Props Validation

Always validate props to catch bugs early:

```vue
<script>
export default {
  props: {
    // String with default
    icon: {
      type: String,
      required: true
    },

    // Size with enumerated values
    size: {
      type: String,
      default: '24px',
      validator: (value) => {
        const validSizes = ['16px', '24px', '32px', '48px', '64px']
        if (!validSizes.includes(value)) {
          console.warn(`Icon size "${value}" is not valid. Use one of: ${validSizes.join(', ')}`)
          return false
        }
        return true
      }
    },

    // Optional color
    color: {
      type: String,
      default: null
    },

    // Boolean flag
    disabled: {
      type: Boolean,
      default: false
    },

    // Array of objects
    icons: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(icon => icon.id && icon.name)
      }
    }
  }
}
</script>
```

---

## 5. Webpack Configuration

### 5.1 Keep Vue Externalized

The webpack config correctly externalizes Vue:

```javascript
// webpack.config.js — IMPORTANT: Do NOT change this
externals: {
  vue: {
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
    root: 'Vue'
  }
},
output: {
  libraryTarget: 'umd',
  library: 'Moongoose',
  filename: 'moongoose.js'
}
```

**Why**:
- Prevents duplicate Vue runtime
- moonscape and moonshine provide their own Vue 3
- Allows independent version management
- Reduces bundle size

**Do NOT**:
- Remove the externals configuration
- Try to bundle Vue into moongoose.js
- Change the UMD library target

---

## 6. Working with Icons

### 6.1 Adding New Icons

The process for adding icons to Moongoose:

```bash
# 1. Drop the SVG file into src/icons/
cp my-new-icon.svg src/icons/

# 2. Update src/docs/meta.json with icon metadata
# (Add entry in the correct category)
{
  "name": "my-new-icon",
  "category": "navigation",
  "tags": ["menu", "drawer", "sidebar"]
}

# 3. Rebuild the icon library
npm run build

# 4. The icon is now available in dist/moongoose.js
# And can be used in consuming apps:
# <moongoose icon="my-new-icon" size="24px" />
```

### 6.2 Icon Component Usage

Once icons are added, use them in consuming applications:

```vue
<!-- In moonscape or moonshine -->
<template>
  <div class="icon-display">
    <!-- Simple usage -->
    <moongoose icon="menu" />

    <!-- With props -->
    <moongoose
      icon="settings"
      size="32px"
      color="currentColor"
    />

    <!-- With event handling -->
    <moongoose
      icon="delete"
      @click="confirmDelete"
    />
  </div>
</template>

<script>
export default {
  methods: {
    confirmDelete() {
      if (confirm('Are you sure?')) {
        // Delete logic
      }
    }
  }
}
</script>
```

---

## 7. Dependency Chain Management

### 7.1 Build Order

Always follow this order after making changes:

```bash
# 1. Build moongoose (your changes compile to dist/)
npm run build

# 2. Link moongoose into moonscape
npm link
cd ../moonscape
npm link @thechoppergroup/moongoose
npm run build

# 3. Link moonscape into moonshine (if using it)
npm link
cd ../moonshine
npm link @thechoppergroup/moonscape
npm run build

# 4. Test in moonshine
npm run dev
```

### 7.2 npm link Procedure

After `npm install`, symlinks get overwritten. Re-link:

```bash
# From moongoose root
npm link

# From moonscape root
npm link @thechoppergroup/moongoose

# From moonshine root (if using moonscape)
npm link @thechoppergroup/moonscape
```

**Common issue**: Icons disappear after `npm install` → this is because symlinks were overwritten.
**Fix**: Re-run the npm link procedure above.

### 7.3 Verifying Links Are Active

```bash
# Check if link is active
npm ls @thechoppergroup/moongoose

# Should show something like:
# moonscape@0.1.0 /path/to/moonscape
# └── @thechoppergroup/moongoose -> /path/to/moongoose (symlink)
```

---

## 8. Testing Components

### 8.1 Manual Testing in Preview

```bash
# From moongoose root
npm run watch &    # Watch for changes
npm run serve-docs # Start preview server

# Open http://localhost:8080
# Test components interactively
```

### 8.2 Testing in Consumer Apps

```bash
# In moonscape or moonshine
npm run dev        # Start dev server with HMR

# Change icon in moongoose/src/icons/
# Change component in moongoose/src/
npm run build      # (from moongoose root)
# Changes appear immediately in dev server via npm link
```

### 8.3 Unit Testing (Currently Not Implemented)

Consider adding tests in the future:

```javascript
// example test (not currently in repo)
import { mount } from '@vue/test-utils'
import Moongoose from '@/moongoose.vue'

describe('Moongoose Icon Component', () => {
  it('renders the correct SVG', () => {
    const wrapper = mount(Moongoose, {
      props: {
        icon: 'menu'
      }
    })
    expect(wrapper.find('use').attributes('xlink:href')).toBe('#menu')
  })

  it('emits click event', async () => {
    const wrapper = mount(Moongoose, {
      props: { icon: 'menu' }
    })
    await wrapper.find('svg').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

---

## 9. Browser Compatibility

Moongoose supports:

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Vue 3.5.0+**: The external vue dependency

Do NOT support:
- Internet Explorer (Vue 3 dropped IE11 support)
- Vue 2 consumers (this is a Vue 3 library)

---

## 10. Common Patterns

### 10.1 Two-Way Binding (v-model)

For new interactive components, use Vue 3 pattern:

```vue
<!-- Parent -->
<template>
  <choice-component v-model="selectedChoice" />
</template>

<script>
export default {
  data() {
    return {
      selectedChoice: 'option1'
    }
  }
}
</script>

<!-- Component: choice.vue (Vue 3 pattern) -->
<template>
  <div class="choice">
    <button
      v-for="option in options"
      :key="option.id"
      :class="{ active: modelValue === option.id }"
      @click="$emit('update:modelValue', option.id)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'options'],
  emits: ['update:modelValue']
}
</script>
```

### 10.2 Scoped Slots (If Needed)

```vue
<template>
  <div class="icon-grid">
    <slot
      v-for="icon in icons"
      :key="icon.id"
      :icon="icon"
      :size="size"
    >
      <!-- Default: render as moongoose icon -->
      <moongoose :icon="icon.id" :size="size" />
    </slot>
  </div>
</template>

<script>
export default {
  props: ['icons', 'size']
}
</script>

<!-- Usage -->
<template>
  <icon-grid :icons="allIcons" :size="32px">
    <template #default="{ icon, size }">
      <div class="custom-icon-wrapper">
        <moongoose :icon="icon.id" :size="size" />
        <p>{{ icon.name }}</p>
      </div>
    </template>
  </icon-grid>
</template>
```

---

## 11. Code Organization

### 11.1 File Structure Best Practices

```
moongoose/
├── src/
│   ├── icons/                 # SVG icon files (422 icons)
│   ├── components/            # Vue components
│   │   ├── slider.vue         # Interactive slider
│   │   ├── choice.vue         # Choice component
│   │   ├── editor.vue         # Icon editor
│   │   ├── filters.vue        # Search filters
│   │   ├── grid.vue           # Icon grid
│   │   ├── pagination.vue     # Pagination control
│   │   └── search.vue         # Search component
│   ├── docs/                  # Documentation & preview
│   │   ├── index.vue          # Main docs page
│   │   ├── preview.vue        # Preview component
│   │   ├── meta.json          # Icon metadata
│   │   └── styles.css         # Docs styles
│   ├── moongoose.vue          # Main icon component (core)
│   ├── wrapper.js             # Plugin wrapper
│   └── preview.js             # Preview app entry point
├── docs/                      # Generated documentation
│   └── vue3/                  # Vue 3 migration docs
├── dist/                      # Generated bundle (after build)
├── webpack.base.js            # Shared webpack config
├── webpack.config.js          # Main webpack config
├── package.json
└── README.md
```

### 11.2 Naming Conventions

- **Files**: kebab-case.vue, kebab-case.js
- **Components**: PascalCase (exported as default)
- **Props**: camelCase
- **Events**: kebab-case
- **Classes**: kebab-case
- **IDs**: kebab-case
- **Constants**: SCREAMING_SNAKE_CASE

```javascript
// ✓ Good
const DEFAULT_ICON_SIZE = '24px'
const validateIconId = (id) => { /* ... */ }

export default {
  name: 'IconComponent',
  props: { iconSize: String },
  emits: ['icon-selected']
}
```

---

## 12. Performance Considerations

### 12.1 Bundle Size

Monitor the dist/moongoose.js size:

```bash
# Check bundle size
du -h dist/moongoose.js

# Should be roughly 30-50KB (gzipped: 10-15KB)
# If significantly larger, check for:
# - Accidental Vue inclusion (check webpack externals)
# - Unused dependencies
# - Duplicate code
```

### 12.2 Component Rendering

For large icon grids, consider:

```vue
<script>
export default {
  props: {
    icons: Array,
    lazy: {
      type: Boolean,
      default: false  // Set true for 500+ icons
    }
  },
  computed: {
    visibleIcons() {
      // Implement virtual scrolling or pagination
      // to avoid rendering thousands of SVGs at once
      return this.lazy
        ? this.icons.slice(0, 50)
        : this.icons
    }
  }
}
</script>
```

---

## 13. Development Workflow

### 13.1 Adding a New Feature to Moongoose

```bash
# 1. Create a new branch
git checkout -b feature/new-icon-type

# 2. Add icons or components
vim src/icons/new-icon.svg
vim src/components/new-feature.vue

# 3. Update metadata if adding icons
vim src/docs/meta.json

# 4. Build and test locally
npm run build
npm link
cd ../moonscape && npm link @thechoppergroup/moongoose
npm run build

# 5. Test in moonscape/moonshine
npm run dev

# 6. Commit changes
git add .
git commit -m "feat: add new icon type"

# 7. Push and create PR
git push origin feature/new-icon-type
```

### 13.2 Debugging

```bash
# Enable Vue DevTools
# https://devtools.vuejs.org/

# Check webpack bundle
npm run build -- --profile
# Generates JSON analysis

# Watch for errors
npm run watch
# Keep terminal open, watch for compile errors
```

---

## 14. Migration Checklist

When updating components to follow these best practices:

- [ ] Use Options API or Composition API consistently
- [ ] Declare all `props` with types and validation
- [ ] Declare all `emits` with clear event names
- [ ] Use kebab-case for event names
- [ ] Use computed properties instead of methods for derived state
- [ ] Add lifecycle hooks only when needed
- [ ] Use scoped styles exclusively
- [ ] Avoid global state (no event buses or Vuex if possible)
- [ ] Document complex logic with comments
- [ ] Test in preview and consumer apps

---

## 15. Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue 3 Component Composition](https://vuejs.org/guide/extras/composition-api-faq.html)
- [vue-loader 17 Documentation](https://vue-loader.vuejs.org/)
- [Best Practices for Vue Components](https://vuejs.org/guide/components/)
- Moongoose README.md (project overview)
- VUE3_DEVELOPER_GUIDE.md (migration reference)

