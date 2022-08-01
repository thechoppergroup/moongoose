const fs = require('fs');
const path = require('path');
const SVGO = require('svgo');
const filesPath = path.resolve(__dirname, '../src/icons');
const dimension = 512;
const svgConfig = {
    js2svg: { pretty: true, indent: 4 },
    plugins: [
        { cleanupAttrs: true },
        { removeDoctype: true },
        { removeXMLProcInst: true },
        { removeComments: true },
        { removeMetadata: true },
        { removeTitle: true },
        { removeDesc: true },
        { removeUselessDefs: true },
        { removeEditorsNSData: true },
        { removeEmptyAttrs: true },
        { removeHiddenElems: true },
        { removeEmptyText: true },
        { removeEmptyContainers: true },
        { removeViewBox: true },
        { cleanUpEnableBackground: true },
        { convertStyleToAttrs: true },
        { convertColors: true },
        { convertPathData: true },
        { convertTransform: true },
        { removeUnknownsAndDefaults: true },
        { removeNonInheritableGroupAttrs: true },
        { removeUselessStrokeAndFill: true },
        { removeUnusedNS: true },
        { cleanupIDs: true },
        { cleanupNumericValues: true },
        { moveElemsAttrsToGroup: true },
        { moveGroupAttrsToElems: true },
        { collapseGroups: true },
        { removeRasterImages: false },
        { mergePaths: true },
        { convertShapeToPath: true },
        { sortAttrs: true },
        { transformsWithOnePath: false },
        { removeDimensions: true },
        { removeAttrs: { attrs: '(stroke|fill|id|fill|data-name|width|height|viewBox)' } },
        { addAttributesToSVGElement: {
            attributes: [
                {width: dimension},
                {height: dimension},
                {viewBox: `0 0 ${dimension} ${dimension}`}
            ]
        }}
    ]
};

function getFiles() {
    var files = fs.readdirSync(filesPath);
    return files;
}

function optimize(filesPath, filename, prefix) {
    prefix = prefix || '';
    return new Promise((accept, reject) => {
        var fullPath = path.join(filesPath, filename);
        var contents = fs.readFileSync(fullPath, {encoding:'utf8'});
        var svgo = new SVGO(svgConfig);
        svgo.optimize(contents).then((result) => {
            //console.log('result', result);
            var destPath = path.join(filesPath, prefix + filename);
            fs.writeFileSync(destPath, result.data, {encoding:'utf8'});
            accept();
        });
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
            optimize(filesPath, filename).then(() => checkComplete(filename)).catch(error => {console.error(filename, error)});
        }
    });
}

main();
