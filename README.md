# Moongoose

SVG Icon Library

## Getting Started

- `yarn add https://github.com/thechoppergroup/moongoose.git`
- `import Moongoose from 'moongoose';`

~ or ~

- `<script src="moon-goose/dist/moongoose.min.js"></script>`

## Usage

```html
<moongoose name="trash-b" />
<button @click="remove"><moongoose name="close" label="Remove" /></button>
```

Icons are decorative by default and rendered with `aria-hidden="true"`. When an icon is the only
content of a control, give it a `label`: it renders as `role="img"` with that `aria-label`, which
becomes the control's accessible name. (Labeling the control itself works too.)

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