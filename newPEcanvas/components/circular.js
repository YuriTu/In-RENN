class Circular {
    constructor(item){
        this.radius = item.radius;

        this.startAngle = item.startAngle;
        // this.maxAngle = item.maxAngle;
        this.stepAngle = item.stepAngle;

        this.angleLength = item.angleLength;
        this.maxAngleLength = item.maxAngleLength;
        this.stepAngleLength = item.stepAngleLength;
        this.lineWidth = item.lineWidth;
        // 默认增加Length
        this.isChangeLength = false;
    }
    rotate(){
        this.startAngle += this.stepAngle;
    }
    change(){
        if (this.angleLength > this.maxAngleLength){
            this.isChangeLength = true;
        } else if (this.angleLength < 0.1){
            this.isChangeLength = false;
        }
        if (this.isChangeLength){
            this.angleLength -= this.stepAngleLength;
        } else {
            this.angleLength += this.stepAngleLength;
        }
    }
    paint(x, y, context){
        context.save();
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.lineCap = "round";
        context.arc(x, y, this.radius, this.startAngle,
            this.startAngle + this.angleLength, false);
        context.stroke();
        context.restore();
    }
}
module.exports = Circular;