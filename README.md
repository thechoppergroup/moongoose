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

## Browsing docs locally

The docs are not hosted anywhere — run them on your own machine:

```
npm install
npm run serve
```

This rebuilds on file change and serves via browser-sync.

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