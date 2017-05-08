class BasicHalo {
    constructor(props){
        // 初始值 四点坐标
        this.initRT = props.initRT;
        this.initLT = props.initLT;
        this.initLB = props.initLB;
        this.initRB = props.initRB;
        this.breakPoints = props.breakPointsList;
        this.stripeList = props.stripeList;
        this.drawStripes = (ctx) => {
            // 根据clip的划分，我其实只用拿到其会绘制点坐标，之后根据画若干个 x 值相同，y不断递减，因为旋转工作又外部完成
            // 1.每当我发现 y值小于 20,就向其指定为6000  居然不需要clear 我估计是单个画布的原因：
            // 需要找到，每次stripe前进的关系
            // 2.采取clip方式，使用单个长放形
            // 3.老方案，设未知数反推只
            this.stripeList.forEach((item) => {
                ctx.beginPath();
                // 左上
                // 因为阴影与linwidth的原因，稍微有点右歪，进行1个像素修正
                ctx.rect(this.initLB.x - 1, item.stepLB.y, 40, 10);
                ctx.closePath();
                ctx.fill();
                item.stepLB.y -= 2;
                if ( item.stepLB.y < 40){
                    item.stepLB.y = 600;
                }
            });

        };
        this.drawClipPath = (ctx) => {
            ctx.beginPath();
            ctx.moveTo(this.initRT.x, this.initRT.y);
            ctx.lineTo(this.initLT.x, this.initLT.y);
            ctx.lineTo(this.initLB.x, this.initLB.y);
            ctx.lineTo(this.initRB.x, this.initRB.y);
            ctx.closePath();
            ctx.clip();
        };
    }
    // 上下文，断格线长度，旋转弧度
    paint(ctx){
            // 开头和结尾是一样的
        // console.log(this)
        ctx.beginPath();
            // 开始右上
        ctx.moveTo(this.initRT.x, this.initRT.y);
            // 开始左上
        ctx.lineTo(this.initLT.x, this.initLT.y);
            // 绘制分隔点
        this.breakPoints.forEach((item) => {
            // 左下
            ctx.lineTo(item.stepLB.x, item.stepLB.y);
            // 右下
            ctx.lineTo(item.stepRB.x, item.stepRB.y);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
            // 创造每个隔断中的小横线
            ctx.beginPath();
            ctx.moveTo(item.stepRT.x, item.stepRT.y);
            ctx.lineTo(item.stepLT.x, item.stepLT.y);
        });
        // 左下
        ctx.lineTo(this.initLB.x, this.initLB.y);
        // 右下
        ctx.lineTo(this.initRB.x, this.initRB.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

module.exports = BasicHalo;