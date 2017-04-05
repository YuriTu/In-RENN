class Sprite {
    constructor(name, painter, behaviors){
        this.name = name || null;
        // 应为 对象 包含一个paint（sprite， context） 方法
        this.painter = painter || null;
        // 应为对象 包含一个execute（sprite，context，time）方法
        this.behaviors = behaviors || null;

        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;

        this.velocityX = 0;
        this.velocityY = 0;
        this.visible = true;
        this.animating = false;
    }
    paint(context){
        if (this.visible && !!this.painter ){
            // 绘制器与绘制器对象之间是解耦的 具体的绘制动作是通过construct的时候传进来的

            this.painter.paint(this, context);
        }
    }
    update(context, time){

        for (let i = this.behaviors.length; i > 0;i--){
            this.behaviors[i - 1].execute(this, context, time);
        }
    }
}

class ImagePainter {
    constructor(imageUrl){
        this.image = new Image();
        this.image.src = imageUrl;
    }
    paint(sprite, context){
        if (!!this.image.src){
            if (!this.image.complete){
                this.image.onload = (e) => {
                    sprite.width = e.width;
                    sprite.height = e.height;
                    context.drawImage(this.target, sprite.left, sprite.top, sprite.width, sprite.height);

                };
            } else {
                context.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
            }
        }
    }
}

class SpriteSheetPainter {
    constructor(cells){
        this.cells = cells || [];
        this.cellIndex = 0;
    }
    // 循环调用每个项目
    // advance(){
    //     if (this.cellIndex === this.cells.length - 1){
    //         this.cellIndex = 0;
    //     }
    // }


}


module.exports = Sprite;