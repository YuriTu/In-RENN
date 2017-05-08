// 渲染逻辑 不控制流程，只负责view层功能
// constructor内写工具方法，外部写生命周期

let ctx, canvas, offCtx, offCanvas;
const _ = require("../../../common/christina");
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const MAX_IMG_HEIGHT = 1600;
class Animation {
    constructor(upper, off){
        canvas = { ...upper };
        offCanvas = { ...off };
        ctx = upper.ctx;
        offCtx = off.ctx;

        this.center = {
            x : canvas.width / 2,
            y : canvas.height / 2
        };
        this.first = {
            curRadius : 0,
            status    : 0,
        };
        this.second = {
            curRadius : 0,
            status    : 1,
        };
        this.third = {
            isTransAxis : false,
            hasShowBG   : false,
            rotateSum   : 0,
        };
        this.clearCanvas = (x, y, width, height) => {
            if (!!width && !!height){
                ctx.clearRect(x, y, width, height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        this.drawBasicCircle = (radius, x, y) => {
            ctx.beginPath();
            if (x === 0 || y === 0){
                ctx.arc(x, y,
                    radius || 0, 0, Math.PI * 2, false);
            } else {
                ctx.arc(x || this.center.x, y || this.center.y,
                    radius || 0, 0, Math.PI * 2, false);
            }
        };
        this.compClearHeight = () => {
            if (canvas.height * 2 < MAX_HEIGHT){
                return MAX_HEIGHT;
            }
            return canvas.height * 2;
        };
        this.compClearY = () => {
            if (this.center.y <= MAX_HEIGHT / 2){
                return -MAX_HEIGHT / 2;
            }
            return -this.center.y;
        };
    }
    init(config){
        ctx.fillStyle = config.fillStyle;
        ctx.strokeStyle = config.strokeStyle;
        ctx.shadowBlur = config.shadowBlur;
        ctx.shadowColor = config.shadowColor;
        ctx.beginPath();
    }
    firstStep(config){
        // 12帧，0.3s
        if (this.first.curRadius < config.maxRadius){
            this.clearCanvas();
            this.drawBasicCircle(this.first.curRadius);
            ctx.fill();
            ctx.closePath();
            this.first.curRadius += config.radiusStep;
        } else {
            this.initSecStep();
            this.first.status = 1;
        }
        return this.first.status;
    }
    initSecStep(){
        ctx.fillStyle = "#000";
        ctx.shadowBlur = 0;
    }
    secondStep(config, third){
        // 20帧 0.5s
        if (this.second.curRadius < config.maxRadius){
            this.drawBasicCircle(this.second.curRadius);
            ctx.save();
            ctx.fill();
            ctx.clip();
            ctx.closePath();
            this.rotateArc(config.arcList, config.startArcTime);
            ctx.restore();
            this.second.curRadius += config.radiusStep;
        } else {
            // 任务分布，将时间转嫁给其他步骤
            this.initThird(third);
            this.second.status = 2;
        }
        return this.second.status;
    }
    rotateArc(list, startTime){
        // 11帧0.275s
        if (this.second.curRadius > startTime){
            this.clearCanvas();
            list.forEach((item) => {
                item.paint(this.center.x, this.center.y, ctx);
                item.rotate();
                item.change();
            });
        }
    }
    initThird(config){
        this.initStripe(config.stripe.color);
        ctx.shadowBlur = config.shadowBlur;
    }
    thirdStep(config, textConfig){
        // 更改坐标轴为中心
        this.third.isTransAxis || (this.third.isTransAxis = this.transAxisCenter(ctx, this.center));
        this.clearCanvas(-this.center.x, this.compClearY(), canvas.width, this.compClearHeight());
        // 加载图片
        this.third.hasShowBG || (this.third.hasShowBG = this.showBG(config.haloRotateSpeed));
        this.rotateBG(config.haloRotateSpeed);
        // 绘制条纹动画
        this.drawAniStripe(config);

        this.drawText(textConfig);
        this.drawShadow(config.shadow);
        // 整体旋转
        ctx.rotate(config.haloRotateSpeed);
    }
    transAxisCenter(c, center){
        c.setTransform(1, 0, 0, 1,
            center.x, center.y);
        return true;
    }

    drawOffHalo(config){
        this.transAxisCenter(offCtx, {
            x : offCanvas.width / 2,
            y : offCanvas.height / 2,
        });
        offCtx.save();
        this.initOffHalo(config.offScreen);
        config.haloList.forEach((item) => {
            item.paint(offCtx, config.stepMargin);
            offCtx.rotate(config.rotateStep);
        });
        offCtx.restore();
        return true;
    }
    initOffHalo(config){
        offCtx.fillStyle = config.fillStyle;
        offCtx.strokeStyle = config.stripeStyle;
        offCtx.lineWidth = config.lineWidth;
        offCtx.shadowColor = config.shadowColor;
        offCtx.shadowBlur = config.shadowBlur;
    }
    drawOffCenter(config){
        offCtx.save();
        offCtx.lineWidth = config.lineWidth;
        offCtx.shadowBlur = config.shadowBlur;
        offCtx.shadowColor = config.shadowColor;
        const centerGradient = offCtx.createRadialGradient(
            0, 0, 0,
            0, 0, config.radius
        );
        centerGradient.addColorStop(0, "rgba(32,148,148,0.1)");
        centerGradient.addColorStop(0.5, "rgba(32,148,148,0.4)");
        centerGradient.addColorStop(0.75, "rgba(32,148,148,0.6)");
        centerGradient.addColorStop(0.1, "rgba(32,148,148,0.95)");
        offCtx.beginPath();
        offCtx.arc(0, 0, config.radius, 0, Math.PI * 2, false);
        offCtx.fillStyle = centerGradient;
        offCtx.closePath();
        offCtx.fill();
        offCtx.restore();
    }
    drawOffShadow(config){
        this.createShadow(config.shandowMax, offCtx);
    }
    createImgElement(){
        const container = document.createElement("div");
        container.className = "canvas-bg-container";
        const newImage = document.createElement("img");
        newImage.className = "canvas-bg";
        newImage.style.display = "none";
        const data = offCanvas.obj.toDataURL();
        newImage.src = data;
        const ele = document.querySelector(".canvas");
        container.appendChild(newImage);
        ele.appendChild(container);
    }
    showBG(){
        const ele = document.querySelector(".canvas-bg");
        ele && (ele.style.display = "block");
        const container = document.querySelector(".canvas-bg-container");
        container && (container.style.top = `${(canvas.height / 2) - (MAX_HEIGHT / 2)}px`);
        return true;
    }
    rotateBG(deg){
        this.third.rotateSum += _.rad2deg(deg);
        const ele = document.querySelector(".canvas-bg");
        ele && (ele.style.transform = `rotate3d(0,0,1,${this.third.rotateSum}deg)`);
    }
    drawText(config){
        // 考虑用离屏处理
        ctx.save();
        ctx.setTransform(1, 0, 0, 1,
            canvas.width / 2, canvas.height / 2);
        config.forEach((item) => {
            // api操作可以优化
            ctx.fillStyle = item.color;
            ctx.font = item.font;
            ctx.textAlign = item.textAlign,
                ctx.fillText(item.text, item.x, item.y);
        });
        ctx.restore();
    }
    copyCanvasFormOff(){
        ctx.drawImage(offCanvas.obj,
            0, 0, MAX_WIDTH, MAX_HEIGHT,
            -this.center.x, -this.center.y, MAX_WIDTH, MAX_HEIGHT);
    }
    initStripe(color){
        ctx.fillStyle = color;
        return true;
    }
    drawAniStripe(config){
        config.haloList.forEach((item) => {
            ctx.save();
            item.drawClipPath(ctx);
            item.drawStripes(ctx);
            ctx.restore();
            ctx.rotate(config.rotateStep);
        });
    }
    drawShadow(config){
        ctx.save();
        if (config.shandowMax > config.shandowStart){
            this.createShadow(config.shandowStart, ctx);
            config.shandowStart += config.shandowStep;
        } else {
            this.createShadow(config.shandowMax, ctx);
        }
        ctx.restore();
    }
    createShadow(radiusPercentage, c){
        // 屏幕最小width 1200 620是为了在1200的情况下circle的阴影不要露出
        const length = canvas.width <= MAX_WIDTH ? (MAX_WIDTH / 2 + 20) : canvas.width / 2;
        const gradient = c.createRadialGradient(
            0, 0, 1,
            0, 0, length
        );
        gradient.addColorStop(0, "rgba(0,0,0,0.1)");
        gradient.addColorStop(radiusPercentage, "rgba(0,0,0,0.85)");

        this.drawBasicCircle(length, 0, 0);
        c.arc(0, 0, length, 0, Math.PI * 2, false);
        c.shadowBlur = 0;
        c.fillStyle = gradient;
        c.closePath();
        c.fill();
    }
}

module.exports = Animation;