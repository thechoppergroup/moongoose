const fs = require('fs');
const path = require('path');
const SVGO = require('svgo');
const filesPath = path.resolve(__dirname, '../src/icons');
const dimension = 512;
const svgConfig = {
    js2svg: { pretty: true, indent: 4 },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // viewBox is required to resize SVGs with CSS.
                    // @see https://github.com/svg/svgo/issues/1128
                    removeViewBox: false,
                },
            },
        },
        {
            name: 'addAttributesToSVGElement',
            params : {
                attributes: [
                    { width: dimension },
                    { height: dimension },
                    { viewBox: `0 0 ${dimension} ${dimension}` }
                ]
            }
        }
    ] ,

        // { cleanupAttrs: true },
        // { removeDoctype: true },
        // { removeXMLProcInst: true },
        // { removeComments: true },
        // { removeMetadata: true },
        // { removeTitle: true },
        // { removeDesc: true },
        // { removeUselessDefs: true },
        // { removeEditorsNSData: true },
        // { removeEmptyAttrs: true },
        // { removeHiddenElems: true },
        // { removeEmptyText: true },
        // { removeEmptyContainers: true },
        // { removeViewBox: true },
        // { cleanUpEnableBackground: true },
        // { convertStyleToAttrs: true },
        // { convertColors: true },
        // { convertPathData: true },
        // { convertTransform: true },
        // { removeUnknownsAndDefaults: true },
        // { removeNonInheritableGroupAttrs: true },
        // { removeUselessStrokeAndFill: true },
        // { removeUnusedNS: true },
        // { cleanupIDs: true },
        // { cleanupNumericValues: true },
        // { moveElemsAttrsToGroup: true },
        // { moveGroupAttrsToElems: true },
        // { collapseGroups: true },
        // { removeRasterImages: false },
        // { mergePaths: true },
        // { convertShapeToPath: true },
        // { sortAttrs: true },
        // { transformsWithOnePath: false },
        // { removeDimensions: true },
        // { removeAttrs: { attrs: '(stroke|fill|id|fill|data-name|width|height|viewBox)' } },
        // { addAttributesToSVGElement: {
        //     attributes: [
        //         {width: dimension},
        //         {height: dimension},
        //         {viewBox: `0 0 ${dimension} ${dimension}`}
        //     ]
        // }}
    // ]
};

function getFiles() {
    var files = fs.readdirSync(filesPath);
    return files;
}

function optimize(filesPath, filename, prefix) {
    prefix = prefix || '';
    return new Promise((accept, reject) => {
        try{
            var fullPath = path.join(filesPath, filename);
            var contents = fs.readFileSync(fullPath, {encoding:'utf8'});
        } catch (e){
            console.error("Failed to set up svgo", e);
            reject();
        }
        let result = SVGO.optimize(contents, svgConfig );
        //console.log('result', result);
        let destPath = path.join(filesPath, prefix + filename);
        fs.writeFileSync(destPath, result.data, { encoding:'utf8' });
        accept();
    });
}

function main() {
    var files = getFiles();
    var count = 0;

    function checkComplete(filename) {
        count++;
        console.log('Optimized:', filename);
        if(count === files.length) {
            console.log('Finished.');
        }
    }

    files.forEach((filename) => {
        console.log('looking at file', filename);
        if(filename.toLowerCase().indexOf('.svg')) {
            optimize(filesPath, filename).then(() => checkComplete(filename)).catch(error => {console.error(filename, error); throw('FAILED on ' + filename);});
        }
    });
}

main();
