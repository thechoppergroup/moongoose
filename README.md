# Moongoose

SVG Icon Library

## Getting Started

- `yarn add https://github.com/thechoppergroup/moon-goose.git`
- `import Moongoose from 'moongoose';`

~ or ~

- `<script src="moon-goose/dist/moongoose.min.js"></script>`

## Adding new Icons

- Drop your new SVG icon into `src/icons/`
- Run `yarn run build`
- Commit changes to GitHub
- Reinstall Moongoose to your project

## Notes

- `scripts/resize-svg.js` is used to format the SVG files for consistency
- `scripts/svg-to-module.js` is used to bundle all SVG files into a JS module
