/**
 * 清空文件夹插件
 *
 * Updated by renren on 17/5/05.
 */
const fs = require("fs");
const path = require("path");
function WebpackCleanPlugin(purePaths, prueOptions) {
    let paths = purePaths;
    let options = prueOptions;
    if (typeof options === "string") {
        options = {
            root: options
        };
    }

    options = options || {};
    options.root = options.root || path.dirname(path.resolve("./dist"));

    if ( typeof paths === "string" || paths instanceof String){
        paths = [paths];
    }
    this.paths = paths;
    this.options = options;

}

const clean = function () {
    const that = this;
    const path = that.options.root + that.paths;
    let files = [];
    if (fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            const curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()){
                that.paths = curPath;
                clean.call(that);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    }
};
WebpackCleanPlugin.prototype.apply = function (compiler) {
    const that = this;
    if (compiler === undefined) {
        return clean.call(that);
    } else {
        if (that.options.watch) {
            compiler.plugin("compile", function (params) {
                clean.call(that);
            });
        } else {
            return clean.call(that);
        }
    }
};


module.exports = WebpackCleanPlugin;