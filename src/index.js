// Library entry for the Vite build. Preserves the long-standing consumption
// contract: `import moongoose from '@thechoppergroup/moongoose'` yields the
// <moongoose> SFC as the default export (same as the old webpack UMD, whose
// entry was moongoose.vue directly). Default export ONLY — a named export
// alongside it would make Rollup emit a mixed-exports UMD whose consumers must
// reach through `.default`, breaking the existing default-import contract.
import moongoose from './moongoose.vue';

export default moongoose;
