const pi = Math.PI;
const piStep = 0.02 * pi;
const basicColor = "#209494";

const basicConfig = {
    baseOnTime     : true,
    laTime         : 0,
    centerGradient : null,
    inSecStep      : false,
    firstCirStep   : 2.5,
    secStep        : {
        startSec : null,
        isEnd    : false,
    },
    secCirStep: 1,
};

const circularConfig = [{
    name   : "circular_1",
    radius : 20,

    startAngle : 0 * piStep,
        // 最大开始角度
    maxAngle   : 75 * piStep,
        // 每帧增加开始角度
    stepAngle  : -2 * piStep,


        // 弧度范围
    angleLength     : 20 * piStep,
        // 最大弧度
    maxAngleLength  : 75 * piStep,
        // 每帧增加的弧度范围
    stepAngleLength : 2 * piStep,

        // 宽度
    lineWidth   : 4,
        // 是否反向
    isDirChange : false,

}, {
    name       : "circular_2",
    radius     : 12.5,
    startAngle : -25 * piStep,
    maxAngle   : 175 * piStep,
    stepAngle  : 3 * piStep,

    angleLength     : 15 * piStep,
    maxAngleLength  : 75 * piStep,
    stepAngleLength : 2.5 * piStep,

    lineWidth   : 2,
    isDirChange : false,

}];
const haloConfig = {
    haloList        : [],
    // 50 * 0.4（rotateStep） = 20 （2pi）
    haloCount       : 50,
    // 光晕的长度 bot - top
    haloTopOffset   : 45,
    haloBotOffset   : 600,
    haloRotateSpeed : 0.05 * piStep,
    shandowStart    : 0.05,
    shandowStep     : 0.05,
    shandowMax      : 0.75,
    randomBit       : 2,
    isTranslate     : false,
    rotateStep      : 2 * piStep,
    baseOnTime      : 25,
    break           : {
        count       : 5,
        pro         : 0.7,
        // 每个光晕的 半旋转弧度
        radius      : 0.75 * piStep,
        stepMargin  : 0.02,
        shadowColor : basicColor,
        fillStyle   : "rgba(32,148,148,0.15)",
        lineWidth   : 3,
        shadowBlur  : 20,
    },
    stripe: {
        count        : 4,
        pro          : 0.6,
        length       : 0.02,
        color        : basicColor,
        speed        : 0.01,
        threshold    : 0.2,
        rebirthBasic : 0.7,
        rebirthStep  : 0.3,
        maxPosition  : 0.02,
        rebirthPro   : 0.4,
    },
};
const basicFont = "Microsoft Yahei,MicrosoftYaHei,Helvetica Neue Light,Lucida Grande,Calibri,Arial,sans-serif";
const titleTextConfig = [{
    text      : "科技金融",
    x         : 0,
    y         : -15,
    font      : `64px TRENDS ${basicFont}`,
    textAlign : "center",
    color     : "#fff"
}, {
    text      : "用科技开启金融服务新时代",
    x         : 0,
    y         : 35,
    font      : `30px PingFang SC Regular ${basicFont}`,
    textAlign : "center",
    color     : "#fff"
}];
module.exports = {
    basicConfig,
    haloConfig,
    circularConfig,
    titleTextConfig,
};