'use strict';

var FS = require('fs');
var path = require('path');
var SVGO = require('svgo');
var filesPath = path.resolve(__dirname, 'svg');
var filesDist = path.resolve(__dirname, 'dist/svg_all.js');
var dimension = 512;

var svgo = new SVGO({
    plugins: [{
        cleanupAttrs: true,
    }, {
        removeDoctype: true,
    }, {
        removeXMLProcInst: true,
    }, {
        removeComments: true,
    }, {
        removeMetadata: true,
    }, {
        removeTitle: true,
    }, {
        removeDesc: true,
    }, {
        removeUselessDefs: true,
    }, {
        removeEditorsNSData: true,
    }, {
        removeEmptyAttrs: true,
    }, {
        removeHiddenElems: true,
    }, {
        removeEmptyText: true,
    }, {
        removeEmptyContainers: true,
    }, {
        removeViewBox: true,
    }, {
        cleanUpEnableBackground: true,
    }, {
        convertStyleToAttrs: true,
    }, {
        convertColors: true,
    }, {
        convertPathData: true,
    }, {
        convertTransform: true,
    }, {
        removeUnknownsAndDefaults: true,
    }, {
        removeNonInheritableGroupAttrs: true,
    }, {
        removeUselessStrokeAndFill: true,
    }, {
        removeUnusedNS: true,
    }, {
        cleanupIDs: true,
    }, {
        cleanupNumericValues: true,
    }, {
        moveElemsAttrsToGroup: true,
    }, {
        moveGroupAttrsToElems: true,
    }, {
        collapseGroups: true,
    }, {
        removeRasterImages: false,
    }, {
        mergePaths: true,
    }, {
        convertShapeToPath: true,
    }, {
        sortAttrs: true,
    }, {
        transformsWithOnePath: false,
    }, {
        removeDimensions: true,
    }, {
        removeAttrs: { attrs: '(stroke|fill|id|fill|data-name|width|height|viewBox)' },
    }, {
        addAttributesToSVGElement: {
            attributes: [
                {
                    width: dimension
                }, {
                    height: dimension
                }, {
                    viewBox: `0 0 ${dimension} ${dimension}`
                }
            ]
        }
    }]
});

FS.readdir(filesPath, function (err, files) {
    var output = [];
    output.push("module.exports = {")

    if (err) {
        throw err;
    }

    files.forEach(function(file, index, array) {
        
        FS.readFile(path.join(filesPath, file), { encoding: 'utf8' }, function (err, data) {
            if (err) {
                throw err
            }
            
            svgo.optimize(data, { path: filesPath }).then(function (result) {
                output.push('\'' + file.split('.svg')[0] + '\':\'' + result.data + '\'');

                if (index === array.length - 1) {
                    FS.writeFileSync(filesDist, output.join('') + "}", { encoding: 'utf8' });
                } else {
                    output.push(',')
                }
            });
        });
    })
});