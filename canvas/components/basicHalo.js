class BasicHalo {
    constructor(x, y, breakPoints, stripeList, topOffset, botOffset){
        this.x = x;
        this.y = y;
        this.breakPoints = breakPoints;
        this.stripeList = stripeList;

        this.topOffset = topOffset;
        this.botOffset = botOffset;
        this.drawStripes = (ctx, topMid, stripeLength, haloLength, marginBottom, stripeColor) => {
            ctx.save();
            ctx.fillStyle = stripeColor;
            this.stripeList.forEach((item) => {
                let step = item;
                if (step < 0.02){
                    step = 0.02;
                } else if ( step > 0.95){
                    step = 0.95;
                }
                const nextStep = +step + stripeLength;
                ctx.beginPath();
                // 右上
                ctx.moveTo(topMid.x + step * marginBottom, topMid.y + step * haloLength);
                // 左上
                ctx.lineTo(topMid.x - step * marginBottom, topMid.y + step * haloLength);
                // 左下
                ctx.lineTo(topMid.x - nextStep * marginBottom, topMid.y + nextStep * haloLength);
                ctx.lineTo(topMid.x + nextStep * marginBottom, topMid.y + nextStep * haloLength);
                ctx.closePath();
                ctx.fill();
            });
            ctx.restore();
        };
    }
    // 上下文，断格线长度，旋转弧度
    paint(ctx, stepMargin, radius, stripeLength, stripeColor){
        const topMid = {
            x : this.x,
            y : this.y + this.topOffset,
        };
        const botMid = {
            x : this.x,
            y : this.y + this.botOffset,
        };
        const haloLength = this.botOffset - this.topOffset;
        // 矩形上边 半径
        // 说白了是一段圆弧，其半径为topoffset
        const marginTop = Math.tan(radius) * this.topOffset;
        // 矩形下半径
        const marginBottom = Math.tan(radius) * this.botOffset;
            // 开头和结尾是一样的
        ctx.beginPath();
            // 开始右上
        ctx.moveTo(topMid.x + marginTop, topMid.y);
            // 开始左上
        ctx.lineTo(topMid.x - marginTop, topMid.y);
            // 5%
        const stepLength = stepMargin || 0.025;
            // 绘制分隔点
        for (let i = 0;i < this.breakPoints.length;i++){
            let step = +this.breakPoints[i];
            // 对开头结尾太靠近的处理
            if (step < 0.05){
                step = 0.05;
            } else if ( step > 0.95){
                step = 0.95;
            }

            const nextStep = step + stepLength;
                // 左下
            ctx.lineTo(topMid.x - step * marginBottom, topMid.y + step * haloLength);
                // 右下
            ctx.lineTo(topMid.x + step * marginBottom, topMid.y + step * haloLength);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 创造每个隔断中的小横线
            ctx.beginPath();


            ctx.beginPath();
                // 右上
            ctx.moveTo(topMid.x + nextStep * marginBottom, topMid.y + nextStep * haloLength);
                // 左上
            ctx.lineTo(topMid.x - nextStep * marginBottom, topMid.y + nextStep * haloLength);
        }
        ctx.lineTo(botMid.x - marginBottom, botMid.y);
        ctx.lineTo(botMid.x + marginBottom, botMid.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.drawStripes(ctx, topMid, stripeLength, haloLength, marginBottom, stripeColor);
    }
}

module.exports = BasicHalo;