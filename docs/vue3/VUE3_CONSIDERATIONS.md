# Vue 3 Migration Considerations for Moongoose

This document outlines important considerations, known issues, and architectural implications of the Moongoose Vue 3 migration. Review this before making changes or working with downstream projects.

---

## Current Status: Phase 5.5 (Stabilization)

Moongoose has been migrated to Vue 3.5.0. Most of the codebase is stable and functional. However, some legacy Vue 2 patterns remain and should be addressed before the next major release.

### What's Done

- Package dependencies upgraded (vue 3.5.0, vue-loader 17)
- Webpack configuration updated
- All 422 icons working
- All component templates compatible
- Plugin export created (wrapper.js)
- Preview app (preview.js) created

### What Remains (TODO Before Release)

- wrapper.js: Needs Vue 3 plugin pattern update
- preview.js: Needs Vue 3 app creation update
- slider.vue, choice.vue: v-model binding should use Vue 3 pattern
- @vue/compat: Still in package.json but unused — should be removed
- Unit tests: Not present in codebase

---

## Critical Issues to Address

### Issue 1: wrapper.js Still Uses Vue 2 Plugin Pattern

**Status**: BLOCKING for full Vue 3 compatibility
**Severity**: High
**Impact**: Consuming apps (moonscape, moonshine) must use Vue 2 plugin syntax

#### Current Code (Vue 2 pattern)

```javascript
// src/wrapper.js
const install = function(Vue, options) {
  Vue.component('moongoose', Moongoose)
}

export default { install }
```

#### Required Update (Vue 3 pattern)

```javascript
// src/wrapper.js
const install = function(app, options) {
  app.component('moongoose', Moongoose)
}

export default { install }
```

#### Why This Matters

In Vue 2, the plugin receives the Vue constructor function:

```javascript
// Vue 2 (old)
Vue.use(Moongoose)  // Passes Vue constructor to install()
```

In Vue 3, the plugin receives the app instance:

```javascript
// Vue 3 (new)
const app = createApp(...)
app.use(Moongoose)  // Passes app instance to install()
```

The current code won't work with Vue 3 consuming apps.

#### Downstream Impact

- **moonscape**: Will fail to register the moongoose component when using the updated library
- **moonshine**: Will fail to render any icons
- **Any Vue 3 consumer**: Cannot use this library until wrapper.js is fixed

#### Remediation

1. Update wrapper.js as shown above
2. Rebuild: `npm run build`
3. npm link into moonscape: `npm link` → `cd moonscape && npm link @thechoppergroup/moongoose`
4. Rebuild moonscape: `npm run build`
5. Test icon rendering in moonscape
6. Repeat for moonshine

---

### Issue 2: preview.js Still Uses Vue 2 App Initialization

**Status**: BLOCKING for docs/preview functionality
**Severity**: High
**Impact**: The built-in preview app won't load; documentation may not build

#### Current Code (Vue 2 pattern)

```javascript
// src/preview.js
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

#### Required Update (Vue 3 pattern)

```javascript
// src/preview.js
import { createApp } from 'vue'
import App from './index.vue'
import Moongoose from './wrapper.js'

const app = createApp({
  template: '<App />',
  components: { App }
})

app.use(Moongoose)
app.mount('#app')
```

#### Why This Matters

Vue 2 constructor syntax is removed entirely in Vue 3:

- **`new Vue({ el: ... })`**: No longer available
- **`el` property**: Removed (mounting is explicit)
- **`createApp()`**: New way to create an app instance
- **`app.mount()`**: Explicit mounting replaces `el`

#### Downstream Impact

- **Preview app**: Won't render; shows blank page or errors
- **Documentation site**: Build may fail or show missing component
- **Development**: Can't visually test icons in preview during development

#### Remediation

1. Update preview.js as shown above
2. Test the preview: `npm run serve` (or equivalent dev command)
3. Verify icons display correctly
4. Check that the docs site builds

---

### Issue 3: @vue/compat Package Still Listed

**Status**: Cleanup item
**Severity**: Low
**Impact**: Unnecessary dependency; adds to npm install time

The `@vue/compat` package was used during initial Vue 2→3 transition to provide Vue 2-compatible APIs. It is no longer needed in Phase 5.5 because Moongoose uses only native Vue 3 patterns.

#### Current State

In package.json:
```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "@vue/compat": "^3.x.x"  // <-- Should be removed
  }
}
```

#### Why Remove It

- **Not used**: No part of the codebase imports from @vue/compat
- **Unused dependency**: Increases bundle size
- **Maintenance burden**: Extra package to track updates

#### Remediation

```bash
npm uninstall @vue/compat
npm install  # Re-install without it
npm run build  # Verify build still works
```

---

## v-model Pattern: slider.vue and choice.vue

**Status**: Works but not idiomatic
**Severity**: Medium
**Impact**: Components work in Vue 3 but don't follow Vue 3 conventions

### Current Implementation (Vue 2 pattern)

```vue
<!-- slider.vue -->
<script>
export default {
  props: ['value'],
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
```

### Vue 3 Best Practice

```vue
<!-- slider.vue (recommended) -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    onChange(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>
```

### Why This Matters

**Vue 2 Pattern**:
```vue
<slider v-model="value" />
```
Implicitly binds to `value` prop and listens for `input` event.

**Vue 3 Pattern**:
```vue
<slider v-model="value" />
```
Implicitly binds to `modelValue` prop and listens for `update:modelValue` event.

In Vue 3, using `modelValue`/`update:modelValue` is clearer and more explicit. The Vue 2 pattern (`value`/`input`) still works for backward compatibility, but it's not idiomatic.

### Impact on Consumers

If consumers use v-model:

```vue
<!-- This still works with current slider.vue (Vue 2 pattern) -->
<slider v-model="selectedValue" />
```

After update to Vue 3 pattern, it will also work (Vue 3 handles v-model expansion correctly).

### Recommendation

Update slider.vue and choice.vue to use Vue 3 pattern in the next feature release. This is not breaking for consumers using v-model syntax, but it is breaking for consumers who explicitly reference the `value` prop or `input` event.

---

## Webpack Externalization: Critical for Consumers

### Current Configuration (Correct)

```javascript
// webpack.config.js
externals: {
  vue: {
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
    root: 'Vue'
  }
}
```

### What This Means

The Moongoose build does NOT include Vue. Instead:

- **dist/moongoose.js**: References external `vue` module
- **Consuming apps** (moonscape, moonshine): Must provide Vue 3
- **Bundle duplication**: Prevented (only one Vue in final app)

### Implication: npm link is Essential

Pre-compiled Moongoose on npm registry (old version) targets Vue 2:

```javascript
// OLD: From npm registry (Vue 2 build)
const Moongoose = require('@thechoppergroup/moongoose')
// Contains Vue 2 render functions
```

Local build (current) targets Vue 3:

```javascript
// NEW: From local npm link (Vue 3 build)
npm link ../moongoose
// Contains Vue 3 compatible code
```

**For developers**:
- Use `npm link` during development → gets Vue 3 version
- Use npm registry version → gets old Vue 2 version (until released)

**For production consumers**:
- Update to latest npm version once Phase 5.5 is released
- Old npm version only works with Vue 2

---

## Dependency Chain Implications

Moongoose is part of a three-project dependency chain:

```
moongoose
    ↓
  moonscape
    ↓
  moonshine
```

Any change to Moongoose ripples through this chain.

### moonscape: Direct Dependency on moongoose

- Imports icons from Moongoose
- Bundles Moongoose icons into its dist
- Changes to icons or core component affect moonscape bundle

**Impact**: After updating Moongoose, must rebuild moonscape

```bash
npm run build  # Build updated moongoose
cd ../moonscape
npm link @thechoppergroup/moongoose
npm run build  # Rebuild with new moongoose
```

### moonshine: Indirect Dependency (via moonscape)

- Imports components from moonscape
- moonscape includes bundled icons from Moongoose
- Changes to Moongoose are hidden unless moonscape is rebuilt

**Impact**: Must rebuild both moonscape and moonshine after Moongoose changes

```bash
npm run build            # Update moongoose
cd ../moonscape
npm link @thechoppergroup/moongoose
npm run build            # Rebuild moonscape (includes new moongoose)
cd ../moonshine
npm link @thechoppergroup/moonscape
npm run build            # Rebuild moonshine (includes new moonscape)
```

### npm link Overwriting

After `npm install` in any project, symlinks get removed:

```bash
npm install
# ↓
# All npm link symlinks are overwritten
# Must re-link:

npm link ../moongoose
cd ../moonscape && npm link @thechoppergroup/moongoose
cd ../moonshine && npm link @thechoppergroup/moonscape
```

**Workaround**: Use `npm ci --prefer-offline` to avoid reinstalling in some cases, but generally the above procedure is necessary.

---

## Documentation Preview Status

### preview.js App

The built-in preview app in `src/preview.js` won't work until the Vue 2→3 update is made (see Issue 2 above).

### docs/ Folder

The `docs/` folder contains generated documentation. It should be regenerated after any component changes:

```bash
npm run build-docs
```

### moonscape.netlify.app

The online documentation site is built from moonscape, not directly from Moongoose. Updates to Moongoose docs require:

1. Rebuild moongoose: `npm run build`
2. Rebuild moonscape: `npm run build-docs`
3. Deploy (if using netlify)

---

## No TypeScript Support

Moongoose is not yet using TypeScript. Consider for future improvements:

### Current Situation

- All `.vue` files use JavaScript
- No `*.d.ts` type definitions
- IDE autocomplete is limited

### Benefits of Adding TypeScript

- Better IDE support (autocomplete, error detection)
- Self-documenting code (type annotations)
- Easier for TypeScript consumers
- Catches bugs earlier

### Migration Path (If Pursued)

1. Add TypeScript dependencies: `typescript`, `@vue/test-utils`
2. Configure webpack to handle .ts files
3. Migrate components one at a time (can mix JS and TS)
4. Generate type definitions (`.d.ts` files)

This is not a blocker for current development but worth considering.

---

## Testing Status

**Current**: No unit tests present

### Impact

- Component changes have no automated verification
- Regressions can slip through
- Manual testing is the only safeguard

### Recommendation

Add Jest tests for critical components:

```javascript
// example: moongoose.test.js (not currently present)
import { mount } from '@vue/test-utils'
import Moongoose from '@/moongoose.vue'

describe('Moongoose Icon Component', () => {
  it('renders SVG element', () => {
    const wrapper = mount(Moongoose, {
      props: { icon: 'menu' }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('accepts size prop', () => {
    const wrapper = mount(Moongoose, {
      props: { icon: 'menu', size: '48px' }
    })
    expect(wrapper.classes('icon-48px')).toBe(true)
  })
})
```

---

## Build Process Considerations

### npm run build

The build process:

1. **Webpack compiles** Vue components and icons into UMD module
2. **Vue externalized**: dist/moongoose.js references external `vue` module
3. **Output**: dist/moongoose.js (main), dist/moongoose.css (styles if any)

### What's in dist/

After `npm run build`:

```
dist/
├── moongoose.js      # UMD bundle (Vue 3 compatible, no Vue included)
├── moongoose.js.map  # Source map
└── (optional) moongoose.css
```

### Size Expectations

- **Uncompressed**: ~50-80 KB (depends on number of icons)
- **Gzipped**: ~10-20 KB

If significantly larger, check for:
- Accidental Vue inclusion (check webpack externals config)
- Duplicate SVG icons
- Unused dependencies

---

## Performance Considerations

### Icon Grid Rendering

For large collections (300+ icons), consider optimization:

```vue
<!-- BAD: Renders all 422 icons immediately -->
<template>
  <div v-for="icon in allIcons" :key="icon.id">
    <moongoose :icon="icon.id" />
  </div>
</template>

<!-- BETTER: Use virtual scrolling or pagination -->
<template>
  <div v-for="icon in visibleIcons" :key="icon.id">
    <moongoose :icon="icon.id" />
  </div>
</template>

<script>
export default {
  computed: {
    visibleIcons() {
      // Return only 50 icons at a time, or use virtual scroll library
      return this.allIcons.slice(this.startIndex, this.startIndex + 50)
    }
  }
}
</script>
```

The preview.js app displays all 422 icons. If performance becomes an issue, implement pagination.

---

## Known Limitations

### 1. Vue 2 Consumers

Moongoose is a Vue 3 library. Vue 2 apps cannot use it:

```javascript
// ❌ Won't work: Vue 2 app trying to use Vue 3 Moongoose
import Vue from 'vue'  // Vue 2
import Moongoose from '@thechoppergroup/moongoose'  // Vue 3
Vue.use(Moongoose)  // Error: install() expects app, not Vue constructor
```

**Workaround**: Vue 2 apps must stay on pre-Phase 5.5 version of Moongoose.

### 2. Internet Explorer

Vue 3 does not support IE 11. Moongoose inherits this limitation:

- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Not supported**: IE 11 and below

### 3. Server-Side Rendering (SSR)

Moongoose has not been tested with Vue 3 SSR. If SSR is needed:

1. Configure webpack for SSR output (separate build)
2. Test component rendering in Node.js context
3. Handle SVG element refs carefully in SSR

---

## Checklist: Before Publishing Phase 5.5

- [ ] wrapper.js updated to Vue 3 plugin pattern
- [ ] preview.js updated to Vue 3 app creation
- [ ] @vue/compat removed from package.json
- [ ] npm run build completes successfully
- [ ] dist/moongoose.js does not contain Vue code
- [ ] Preview app loads and displays icons
- [ ] moonscape builds with linked moongoose
- [ ] moonscape icons render correctly
- [ ] moonshine builds with linked moonscape
- [ ] No console errors in any app
- [ ] CHANGELOG.md updated with Vue 3 migration notes
- [ ] Version bumped (e.g., 5.5.0-vue3 or 6.0.0)
- [ ] Published to npm: `npm run release`

---

## Rollback Plan

If Phase 5.5 is released but critical issues arise:

1. **Keep previous version on npm**: Don't delete old version
2. **Tag the commit**: `git tag v5.4.1` (last Vue 2 version)
3. **Publish fix branch**: If issue is minor, branch from Phase 5.5 and publish patch
4. **Communicate to consumers**: Update docs on which version to use

---

## Timeline Recommendations

**Immediate (Before Release)**:
- [ ] Fix wrapper.js and preview.js (2-3 hours)
- [ ] Test in moonscape and moonshine (2-4 hours)
- [ ] Publish Phase 5.5 release

**Short Term (Next Sprint)**:
- [ ] Update slider.vue and choice.vue to Vue 3 v-model pattern (1-2 hours)
- [ ] Add unit tests for core components (4-6 hours)
- [ ] Update CLAUDE.md context for future Claude sessions

**Medium Term (Future)**:
- [ ] Add TypeScript support (if needed by consumers)
- [ ] Implement virtual scrolling for icon grid (if performance needed)
- [ ] Create migration guide for Vue 2 consumers staying on old version

---

## Support & Maintenance

### For Consumers Upgrading from Vue 2

1. **Check current version**: `npm list @thechoppergroup/moongoose`
2. **If on old version**: Either stay on it (Vue 2) or upgrade Vue 3 entire app
3. **After app upgrade**: `npm install @thechoppergroup/moongoose@latest`
4. **No code changes needed**: Component API unchanged for v-model users

### For Bug Reports

Include:
- Moongoose version: `npm list @thechoppergroup/moongoose`
- Vue version: `npm list vue`
- Browser and OS
- Reproducible example (CodeSandbox or similar)

---

## References

- VUE3_DEVELOPER_GUIDE.md — Detailed migration patterns
- VUE3_UPGRADE_CHANGELOG.md — All files changed
- VUE3_BEST_PRACTICES.md — Ongoing development guidelines
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [vue-loader 17 Documentation](https://vue-loader.vuejs.org/)

