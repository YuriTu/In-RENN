// 动画流程逻辑
const React = require("react");
const Component = React.Component;

const HEAD_HEIGHT = 60;

const Animator = require("./animation");
// 动画组件精灵
const Arc = require("./components/circular");
const BasicHalo = require("./components/basicHalo");
const basicUrl = "http://118.186.218.30/static";
// workers 渲染逻辑 timer resizetime
let ws, animator, rafTimer, timeout;
// 动画当前动作的上一个动作的执行时间
let actionLastTime = 0;
// 动画进行状态
let status = 0;
const config = require("./config");

class Main extends Component {
    constructor(){
        super();
        this.canvas = {};
        this.offCanvas = {};
        this.init = () => {
            this.deleteAll();
            this.initUpperScreen();
            this.initOffCanvas();
            this.initWorkers();
            this.initAnimator();
        };
        this.deleteAll = () => {
            this.canvas = {};
            this.offCanvas = {};
            ws = null;
            animator = null;
            rafTimer = null;
            timeout = null;
            actionLastTime = 0;
            status = 0;
            config.haloConfig.haloList = [];
        };
        this.initUpperScreen = () => {
            this.canvas = {
                obj    : this.refs.screen,
                width  : this.getWindowWidth(),
                height : window.innerHeight - HEAD_HEIGHT,
                ctx    : this.refs.screen.getContext("2d"),
                allow  : false,
            };
            this.canvas.obj.width = this.canvas.width;
            this.canvas.obj.height = this.canvas.height;
        };
        this.initOffCanvas = () => {
            const ele = document.createElement("canvas");
            ele.id = "offScreen";
            ele.width = this.canvas.width;
            ele.height = 1202;
            this.offCanvas = {
                obj    : ele,
                width  : ele.width,
                height : ele.height,
                ctx    : ele.getContext("2d"),
                allow  : false,
            };
        };
        this.initWorkers = () => {
            if (this.canUseWorkers()){
                try {
                    ws = new Worker(`${basicUrl}/halo-7de4c0.bundle.js`);
                } catch (e){
                    console.error("Web worker script not found");
                }
                // ws = new Worker("./components/index/canvas/workers/halo.js");
            } else {
                console.error("Your browser does not support eb worker");
            }
        };
        this.stopWorkers = (delay) => {
            setTimeout(() => {
                ws.terminate();
            }, delay);
        };
        this.canUseWorkers = () => {
            return (typeof (Worker) !== "undefined");
        };

        this.initAnimator = () => {
            animator = new Animator(this.canvas, this.offCanvas);
            this.createAllElement();
            animator.init(config.init);
        };
        this.getWindowWidth = () => {
            let rs = window.innerWidth;
            if (rs < 1200){
                rs = 1200;
            }
            return rs;
        };
        this.createAllElement = () => {
            this.createArc();
            this.createInitHalo();
        };

        this.createArc = () => {
            config.secondStep.arcList = config.arcConfig.map((item) => {
                return new Arc(item);
            });
        };
        this.createInitHalo = () => {
            const length = config.haloConfig.haloCount;
            ws.postMessage({
                conf: JSON.parse(JSON.stringify(config.haloConfig)),
            });
            ws.onmessage = (evt) => {
                const data = evt.data;
                for (let i = 0;i < length;i++){
                    config.haloConfig.haloList.push(
                        new BasicHalo(data.halo[i])
                    );
                }
                this.createOffElement();
                // this.stopWorkers(500);
            };
        };
        this.createOffElement = () => {
            animator.drawOffHalo(config.haloConfig);
            animator.drawOffCenter(config.haloConfig.center);
            animator.drawOffShadow(config.haloConfig.shadow);
            animator.createImgElement();
        };
        this.start = () => {
            this.canvas.allow = true;
            this.animate();
        };
        this.animate = () => {
            // 开关关闭停止渲染
            if (!this.canvas.allow){
                return;
            }
            // 此处应该负责流程管理，计算，传参数给底层，底层只负责渲染
            // ，不要负责计算，达到单一数据流的效果，以达到彻底解耦计算与渲染
            // 动画总时间，控制流程
            if (this.baseOnTime(config.basicConfig.basicFps)){
                switch (status){
                    case 0:
                        status = animator.firstStep(config.firstStep);
                        break;
                    case 1:
                        status = animator.secondStep(config.secondStep, config.haloConfig);
                        break;
                    case 2:
                        animator.thirdStep(config.haloConfig, config.titleTextConfig);
                        break;
                }
            }
            rafTimer = window.requestAnimationFrame(this.animate);
        };
        this.baseOnTime = (time) => {
            const curTime = +new Date();
            const passTime = curTime - actionLastTime;
            if (config.basicConfig.baseOnTime){
                if (passTime > time){
                    actionLastTime = curTime;
                    return passTime;
                } else {
                    return false;
                }
            }
            return passTime;
        };
        this.handleResize = () => {
            window.addEventListener("resize", () => this.resize(), false);
        };
        this.resize = () => {
            this.canvas.allow = false;
            window.removeEventListener("resize", this.resize, false);
            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                const screen = document.querySelector(".screen");
                screen.width = `${this.getWindowWidth()}px`;
                screen.height = `${window.innerHeight}px`;
                const bg = document.querySelector(".canvas-bg-container");
                bg && bg.remove();
                this.init();
                this.start();
            }, 200);
        };
    }
    componentDidMount(){
        this.init();
        this.start();
        this.handleResize();
    }
    render(){
        return (
            <div className="container-fluid canvas ">
                <canvas className="screen" ref = "screen"/>
            </div>
        );
    }
}


module.exports = Main;