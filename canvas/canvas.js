const React = require("react");

const Component = React.Component;
const TheWorld = require("./world");

let world, timeout;

class Canvas extends Component{
    constructor(){
        super();
        this.init = () => {
            const canvas = {};
            canvas.obj = this.refs.theWorld;
            canvas.obj.width = window.innerWidth;
            // 顶部有60的nav
            canvas.obj.height = window.innerHeight - 60;
            canvas.context = canvas.obj.getContext("2d");
            canvas.canDraw = false;
            return canvas;
        };
        this.draw = (canvas) => {
            world = new TheWorld(canvas);
            world.init();
            world.openCanDraw();
            world.start();
        };
    }
    componentDidMount(){
        const canvas = this.init();
        this.draw(canvas);
        window.addEventListener("resize", () => this.resize(), false);

    }
    resize(){
        // 默认最小屏幕为 1200*770
        world.closeCanDraw();
        window.removeEventListener("resize", this.resize, false);
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            const c = this.refs.theWorld;
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            world.openCanDraw();
            world.resize();
        }, 50);
    }
    render(){
        return (
            <div className="container-fluid canvas ">
                <canvas ref="theWorld" className="theWorld" />
            </div>
        );
    }
}
module.exports = Canvas;