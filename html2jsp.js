/**
 * html转换jsp脚本
 * 
 * updated by Yuri on 17/5/05.
 */
const version = require("./version.json");
const fs = require("fs");
const packageConfig = require("./package.json");
const shell = require("shelljs");
const cheerio = require("cheerio");
function Html2Jsp(htmlList) {
    // static class
    this.htmlList = htmlList;
}
var htmlList = [];
const formatNumToString = num => num < 10 ? `0${num}` : num;
const getCurBranchName = () => shell.exec("git symbolic-ref --short HEAD").replace("\n", "");
const generateVersion = chunklist => {
    const date = new Date();
    for (const key in chunklist){
        if (Array.isArray(chunklist[key])) {
            const cssStatic = chunklist[key][1].replace("../css/", "");
            chunklist[key].pop();
            chunklist[key].push(cssStatic);
        }
    }
    const dateString = `${
        date.getFullYear()
        }-${
        formatNumToString(date.getMonth() + 1)
        }-${
        formatNumToString(date.getDate())
        } ${
        formatNumToString(date.getHours())
        }:${
        formatNumToString(date.getMinutes() + 1)
        }:${
        formatNumToString(date.getSeconds() + 1)
        }`;
    return {
        main    : packageConfig.version,
        date    : dateString,
        branch  : getCurBranchName(),
        version : chunklist
    };
};

var html2Jsp = function (key, fileName) {
    console.log(fileName);
    fs.readFile(htmlList[key], "UTF-8", (error, data) => {
        const che = cheerio.load(data);
        fileName && che(".online").attr("src", `http://static.sofund.com/matrix/js/${fileName[0]}`);
        fileName && che("link[rel=stylesheet]").attr("href", `http://static.sofund.com/matrix/css/${fileName[1].replace("../css/", "")}`);
        const loadingTmpl = fs.readFileSync("./src/tmpl/loading.tmpl", "utf8");
        fileName && che("#content").append(loadingTmpl);
        fs.writeFileSync(`./dist/matrix/jsp/${key}.jsp`,
            `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
            <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
            <%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>`,
            { flag: "w" });

        fs.writeFileSync(`./dist/matrix/jsp/${key}.jsp`, che.html(), { flag: "a" });

        fileName ?
            console.log(`${key}.jsp生成成功===JS:${fileName[0]}--CSS:${fileName[1].replace("../css/", "")}`) :
            console.log(`==============${key}.jsp生成成功===============`);
    });
};

var create = function(stats){
    var that = this;
    htmlList = that.htmlList;
    var assetsByChunkName = stats.toJson().assetsByChunkName;
    const newVersionObj = generateVersion(assetsByChunkName);
    version.unshift(newVersionObj);
    fs.writeFileSync("./version.json", JSON.stringify(version, null, 4), { flag: "w" });
    for (const key in htmlList){
        html2Jsp(key, assetsByChunkName[key]);
    }
};

Html2Jsp.prototype.apply = function (compiler) {
    var that = this;
    if(compiler !== undefined){
        compiler.plugin("done", function (stats) {
            create.call(that, stats);
        });
    } else {
        console.error("compiler not fund!");
    }

};

module.exports = Html2Jsp;