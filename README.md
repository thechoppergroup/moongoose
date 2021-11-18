# Moongoose

SVG Icon Library

## Getting Started

- `yarn add https://github.com/thechoppergroup/moongoose.git`
- `import Moongoose from 'moongoose';`

~ or ~

- `<script src="moon-goose/dist/moongoose.min.js"></script>`

## Adding new Icons

- Run `yarn install`
- Drop your new SVG icon into `src/icons/`
- Run `yarn run build`
- Commit changes to GitHub
- Reinstall Moongoose to your project

## Notes

- `scripts/resize-svg.js` is used to format the SVG files for consistency
- `scripts/svg-to-module.js` is used to bundle all SVG files into a JS module

[![Netlify Status](https://api.netlify.com/api/v1/badges/56a6a3b1-7d7e-4102-9aa2-157f27b16ddd/deploy-status)](https://app.netlify.com/sites/moongoose/deploys)

## Adding icon to docs
- Drop your new SVG icon into `src/icons/`
- Update src/docs/meta.json with the new icon

Example:
```
"new_icon_file_name": {
    "searchTerms": ["search", "terms"],
    "similar": ["similar", "icon", "names"]
},
```
- Run `npm run build'
- run `yarn build watch'