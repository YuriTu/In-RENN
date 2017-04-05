/**
 * 私募页 首页banner 动画
 * Author：Yuri Date：2016/12/05
 *
 * 所有数据设定查看 config.js
 */


// context
let c;
let canvas;
// raf
let animator;
const pi = Math.PI;
const basicColor = "#209494";
const initColor = "#000";

const _ = require("../../../common/christina");
const Circular = require("./components/circular");
const BasicHalo = require("./components/basicHalo");
// 配置
const opts = require("./config").basicConfig;
const cOpts = require("./config").circularConfig;
const haloOpts = require("./config").haloConfig;
const title = require("./config").titleTextConfig;


class World {
    constructor(props){
        c = this.ctx = props.context;
        canvas = this.canvas = this.obj = props.obj;
        // 渲染总开关
        this.canDraw = props.canDraw;

        this.height = props.obj.height;
        this.width = props.obj.width;
        this.radius = 0;
        this.basicCircleRadius = 30;

        this.openCanDraw = () => {
            this.canDraw = true;
        };
        this.closeCanDraw = () => {
            this.canDraw = false;
        };

        this.clearCanvas = () => {
            c.clearRect(0, 0, this.width, this.height);
        };
        // 结束动画
        this.endAni = (loop) => {
            window.cancelAnimationFrame(loop);
        };
        // 画一个园
        this.drawCommonCirCle = () => {
            c.beginPath();
            c.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, pi * 2, false);
            c.fill();
            c.closePath();
        };
        this.baseOnTime = (time) => {
            const curTime = +new Date();
            const rs = curTime - opts.laTime;
            if (opts.baseOnTime){
                if ((curTime - opts.laTime) > time){
                    opts.laTime = curTime;
                    return rs;
                } else {
                    return false;
                }
            } else {
                return rs;
            }
        };
        // 第一步，圆环
        this.loopCirCle = () => {
            if (this.canDraw === false) {
                return;
            }
            if (this.baseOnTime(15)){
                this.radius += opts.firstCirStep;
                if ( this.radius < this.basicCircleRadius ){
                    this.clearCanvas();
                    c.save();
                    c.shadowColor = "rgba(32,148,148,0.75)";
                    c.shadowBlur = 15;
                    this.drawCommonCirCle();
                    c.fill();
                    // c.stroke();
                    c.restore();
                } else {
                    this.endAni(animator);
                    this.radius = 0;
                    return this.loopClipCircle();
                }
            }
            animator = requestAnimationFrame(this.loopCirCle.bind(this));
        };
        // 加黑色遮罩形成圆环
        this.loopClipCircle = () => {
            if (this.canDraw === false) {
                return;
            }
            // 圆弧结束1s 0.8s时，开始第四阶段
            const currentTime = +new Date();
            this.radius += opts.secCirStep;
            if (this.radius <= (this.basicCircleRadius)) {
                c.fillStyle = initColor;
                this.drawCommonCirCle();
            }
            c.save();
            c.beginPath();
            c.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, pi * 2, false);
            c.clip();
            c.closePath();
            if (this.radius > 15){
                opts.secStep.startSec ? null : opts.secStep.startSec = new Date();
                this.rotateCircular(this.canvas.width / 2, this.height / 2);
            }
            if (currentTime - opts.secStep.startSec > 1000){
                this.endAni(animator);
                this.radius = 0;
                c.restore();
                return requestAnimationFrame(this.initHalo.bind(this));

            }
            c.restore();
            animator = window.requestAnimationFrame(this.loopClipCircle.bind(this));
        };

        // 第二部，圆弧
        this.rotateCircular = (x, y) => {
            if (opts.secStep.isEnd){
                return;
            }
            const currentTime = new Date();
            if ( (currentTime - opts.secStep.startSec) < 1100 ){
                // if (this.baseOnTime(20)){ base on time 会有一下屏闪
                this.clearCanvas();
                opts.secStep.forEach((item) => {
                    c.strokeStyle = basicColor;
                    item.paint(x, y, this.ctx);
                    item.rotate();
                    item.change();
                });
                // }
            } else {
                opts.secStep.isEnd = true;
            }
        };

        this.initHalo = () => {
            if (this.canDraw === false) {
                return;
            }
            c.clearRect(-this.width, -this.height, this.width * 2, this.height * 2);
            if (haloOpts.isTranslate === false){
                c.setTransform(1, 0, 0, 1, this.canvas.width / 2, this.canvas.height / 2);
                haloOpts.isTranslate = true;
            }
            this.rotateCircular(0, 0);

            this.drawHaloCenCircle();

            this.drawHalo();
            this.drawText();
            if (haloOpts.shandowMax > haloOpts.shandowStart){
                this.drawHaloShadow(haloOpts.shandowStart);
                haloOpts.shandowStart += haloOpts.shandowStep;
            } else {
                this.drawHaloShadow(haloOpts.shandowMax);
            }
            // animate
            c.rotate(haloOpts.haloRotateSpeed);
            if (!!this.baseOnTime(haloOpts.baseOnTime)){
                this.initCreateHalo();
            }
            animator = requestAnimationFrame(this.initHalo.bind(this));
        };
        this.drawText = () => {

            c.save();
            c.setTransform(1, 0, 0, 1, this.canvas.width / 2, this.canvas.height / 2);
            title.forEach((item) => {
                c.fillStyle = item.color;
                c.font = item.font;
                c.textAlign = item.textAlign,
                c.fillText(item.text, item.x, item.y);
            });
            c.restore();
        };
        this.drawHaloCenCircle = () => {
            c.save();
            c.lineWidth = 3;
            c.shadowBlur = 20;
            c.shadowColor = basicColor;
            this.drawGradCircle(0, 0, this.basicCircleRadius, opts.centerGradient(0, 0));
            c.restore();
        };
        this.drawHaloShadow = (endApl) => {
            c.save();
            const length = this.width < 1200 ? 600 : this.width / 2;
            c.strokeStyle = initColor;
            c.shadowBlur = 0;
            const gradient = c.createRadialGradient(
                0, 0, 1,
                0, 0, length
            );
            gradient.addColorStop(0, _.hexToRgba(initColor, 0.01));
            gradient.addColorStop(endApl, _.hexToRgba(initColor, 0.85));
            c.strokeStyle = "#000";
            this.drawGradCircle(0, 0, length, gradient);
            c.restore();
        };
        this.drawGradCircle = (x, y, radius, color) => {
            c.beginPath();
            c.arc(x, y, radius, 0, 2 * pi, false);
            c.fillStyle = color;
            c.closePath();
            c.fill();
            c.stroke();
        };

        this.drawHalo = () => {
            c.shadowColor = haloOpts.break.shadowColor;
            c.fillStyle = haloOpts.break.fillStyle;
            c.lineWidth = haloOpts.break.lineWidth;
            c.shadowBlur = haloOpts.break.shadowBlur;
            const step = haloOpts.break.stepMargin;
            // 渲染 旋转坐标轴步长
            const rotateStep = haloOpts.rotateStep;
            // 渲染
            haloOpts.haloList.forEach( (item) => {
                item.paint(c, step, haloOpts.break.radius, haloOpts.stripe.length, haloOpts.stripe.color);
                c.rotate(rotateStep);
            });
        };
    }
    init(){
        c.fillStyle = basicColor;
        c.strokeStyle = basicColor;
        this.initSecCir();
        this.initCreateHalo();
        haloOpts.isTranslate = false;
        opts.centerGradient = (x, y) => this.initCenterColor(x, y);
        c.save();
    }
    initCenterColor(x, y){
        const centerGradient = c.createRadialGradient(
            x, y, 0,
            x, y, this.basicCircleRadius
        );
        centerGradient.addColorStop(0, _.hexToRgba(basicColor, 0.1));
        centerGradient.addColorStop(0.5, _.hexToRgba(basicColor, 0.4));
        centerGradient.addColorStop(0.75, _.hexToRgba(basicColor, 0.6));
        centerGradient.addColorStop(1, _.hexToRgba(basicColor, 0.95));

        return centerGradient;
    }
    initSecCir(){
        opts.secStep = cOpts.map((item) => {
            return new Circular(item);
        });
    }
    initCreateHalo(){
        // halo数量
        const length = haloOpts.haloCount;
        if (haloOpts.haloList.length === 0){
            haloOpts.haloList = [];
            // 园的半径和当前屏幕有关， -20 是为了 阴影能全部覆盖
            haloOpts.haloBotOffset = this.width < 1200 ? 580 : this.width / 2 - 20;
            for (let i = 0;i < length;i++){
                // 分割线容器
                // 以70%的概率 ，创造1-5条分隔
                const breakPointsList = this.createRandomList(haloOpts.break.count, haloOpts.break.pro);
                // 以60%的概率创造1-3条条纹
                const stripeList = this.createRandomList(haloOpts.stripe.count, haloOpts.stripe.pro);
                // 每个halo的创建
                const item = new BasicHalo(0, 0, breakPointsList, stripeList, haloOpts.haloTopOffset, haloOpts.haloBotOffset);
                haloOpts.haloList.push(item);
            }
        } else {
            haloOpts.haloList.forEach((item) => {
                // 给每个条纹+一点
                const stList = item.stripeList;
                const maxCount = haloOpts.stripe.rebirthBasic + haloOpts.stripe.rebirthStep * Math.random();
                let newStList = [];
                if (stList.length === 0){
                    if (Math.random() > haloOpts.stripe.rebirthPro){
                        stList.push(maxCount);
                        newStList = stList;
                    }
                } else {
                    newStList = stList.map(( subItem ) => {
                        let count = subItem - haloOpts.stripe.speed * ( 1 + haloOpts.stripe.threshold * Math.random());
                        if (count < haloOpts.stripe.maxPosition){
                            count = maxCount;
                        }
                        return count.toFixed(2);
                    });
                }
                item.stripeList = newStList;
            });

        }
    }
    createRandomList(count, probability){
        let rs = [];
        // 在70%的概率下上成1-5条线  每条线给出 百分比
        const hasBreakPoints = Math.random() < probability;
        // 需要多少个break  因为是0-1的小数
        const breakCount = count;
        if (hasBreakPoints){
            // 成1-5条线
            const breakPointsLength = Math.ceil((Math.random() % (breakCount / 10) ) * 10);
            // 获得每条线的对应百分比
            rs = _.smoothRandom(breakPointsLength, haloOpts.randomBit);
        }
        return rs;
    }
    // 分布增长圆
    start(){
        c.save();
        c.beginPath();
        animator = requestAnimationFrame(this.loopCirCle.bind(this));
    }
    resize(){
        c.save();
        c.beginPath();
        c.fillStyle = basicColor;
        c.strokeStyle = basicColor;
        c.setTransform(1, 0, 0, 1, this.canvas.width / 2, this.canvas.height / 2);
        // 在动画没用进入第二步进行resize，那么就直接不执行第三部了
        opts.secStep.startSec = new Date() - 20000;
        animator = requestAnimationFrame(this.initHalo.bind(this));
    }
}
module.exports = World;