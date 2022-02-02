const path = require('path');
const fs = require('fs');
const icons_path = path.resolve(__dirname, '../src/icons');
const output_path = path.resolve(__dirname, '../src/icons_all.js');
const list_path = path.resolve(__dirname, '../src/icons_list.js');

function main() {
    fs.readdir(icons_path, function (err, files) {
        var processedFiles = readFiles(files);
        var module_str = filesToModule(processedFiles);
        var list_str = filesToList(processedFiles);
        writeIcons(output_path, module_str);
        writeIcons(list_path, list_str);
    });
}

function writeIcons(output_js, module_str) {
    fs.writeFileSync(output_js, module_str, { encoding: 'utf8' });
}

function filesToList(files) {
    var strAry = [];
    strAry.push("module.exports = [");
    files.forEach(function (f) {
        var contents = f.contents.replace(/\n/g, '');
        strAry.push(`'${f.name}',`);
    });
    strAry[strAry.length - 1] = strAry[strAry.length - 1].slice(0, -1);
    strAry.push("];");
    return strAry.join("\n");
}

function filesToModule(files) {
    var strAry = [];
    strAry.push("module.exports = {");
    files.forEach(function (f) {
        var contents = f.contents.replace(/\n/g, '');
        strAry.push(`    "${f.name}": '${contents}',`);
    });
    strAry[strAry.length - 1] = strAry[strAry.length - 1].slice(0, -1);
    strAry.push("};");
    return strAry.join("\n");
}

function readFiles(files) {
    var svgFiles = files.filter(function (f) {
        return f.endsWith('.svg');
    })
    var objAry = svgFiles.map(function (f) {
        var out = {};
        out.name = getName(f);
        out.filename = f;
        out.contents = fs.readFileSync(path.join(icons_path, f), { encoding: 'utf8' });
        return out;
    });
    return objAry;
}

function getName(filename) {
    filename = filename.replace(/\.svg/gi, '');
    filename = filename.replace(/\./g, '-');
    filename = filename.replace(/\s/g, '-');
    filename = filename.toLowerCase();
    return filename;
}

main();
