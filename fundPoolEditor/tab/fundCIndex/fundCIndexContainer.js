const React = require("react");

const Component = React.Component;

const Format = require("../../../common/formatObject/formatObject");
const F = new Format();

const createWarning = () => {
    const superList = ["volatility", "sharpe", "karma", "drawdown"];
    const rs = {};
    superList.forEach((item) => {
        rs[item] = {
            "1year": {
                first  : false,
                second : false,
                text   : "*请输入正确的数字"
            },
            "untilNow": {
                first  : false,
                second : false,
                text   : "*请输入正确的数字"
            }
        };
    });
    return rs;
};

const warningParam = createWarning();


const returnAll = {
    all: {
        active: true
    },
    "1year": {
        active : false,
        child  : 0,
    },
    "untilNow": {
        active : false,
        child  : 0,
    },
    showChild: false,
};

const FundCIndexContainer = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super();
            this.state = {
                interactive     : props.interactive[1].fundCIndex,
                // 上一次点击是一年还是至今
                activeSuperItem : "all",
                warning         : warningParam,
            };
            this.createParam = () => {
                const superList = ["volatility", "sharpe", "karma", "drawdown"];
                const rs = {};
                superList.forEach((item) => {
                    rs[item] = {
                        "1year": {
                            rank   : null,
                            option : null,
                        },
                        "untilNow": {
                            rank   : null,
                            option : null,
                        }
                    };
                });
                return rs;
            };
            this.param = this.createParam();
            this.originParam = JSON.parse(JSON.stringify(this.param));
            this.sendData = (configName, typeName, code) => {
                this.changeItem(configName, typeName, code);
            };
            this.sendChildData = (configName, code, superItem) => {
                this.changeChildItem(configName, code, superItem);
            };
            // 项目被点击的参数记录
            this.changeItem = (configName, typeName, code) => {
                const rs = this.state.interactive;
                let nowChangeItem = rs[configName];
                // 目前活动的项目 1year or until
                const nowActiveItem = rs[configName][code];

                const otherItem = code === "1year" ? "untilNow" : "1year";

                // 那一天人们又想起了曾经被 花式交互逻辑 支配的恐惧

                // 不是我要写这么多判断！！！我也有苦衷！！！ TAT   (╯‵□′)╯︵┻━┻

                // 一级菜单改动  不科学啊我拿的是引用啊，为什么还要赋值一遍
                if (code === "all"){
                    nowChangeItem = JSON.parse(JSON.stringify(returnAll));
                    this.param[configName] = JSON.parse(JSON.stringify(this.originParam))[configName];
                    this.setParam();
                } else {
                    nowChangeItem.all.active = false;
                    // 看是不是已经被点击状态
                    // 渲染清空自定义
                    const optionValue = this.param[configName][code].option;
                    // 此处是因为默认关闭所以不用all检测
                    // let optionValue = this.state.activeSuperItem!== "all" && this.param[configName][code].option;
                    document.querySelector(`.${configName} .inputOption-first`).value = (!!optionValue || optionValue === 0) ? optionValue : "";

                    if (nowActiveItem.active){
                        // 关闭---有值-高亮 无值-不高亮

                        if (!!nowActiveItem.child){
                            nowActiveItem.active = true;
                            // 有值 后关闭 再要打开是关闭状态？
                            nowChangeItem.showChild = !nowChangeItem.showChild;
                            // 有值 点击另一个 关闭本身，点回本身，原来的有值吗
                            if (!!nowChangeItem[otherItem].child){
                                nowChangeItem[otherItem].active = true;
                            } else {
                                // 没-不亮
                                nowChangeItem[otherItem].active = false;
                            }
                        } else {
                            nowActiveItem.active = false;
                            nowChangeItem.showChild = false;
                            // 看另外一个被选中了吗  选中-亮
                            if (!!nowChangeItem[otherItem].child){
                                nowChangeItem[otherItem].active = true;
                            } else {
                                // 没-不亮 返回不限
                                nowChangeItem[otherItem].active = false;
                                nowChangeItem = returnAll;
                            }
                        }

                    } else {
                        // 不是被已点击 普通打开
                        nowActiveItem.active = true;
                        nowChangeItem.showChild = true;
                        // 看另外一个被选中了吗  选中-亮
                        if (!!nowChangeItem[otherItem].child){
                            nowChangeItem[otherItem].active = true;
                        } else {
                            // 没-不亮
                            nowChangeItem[otherItem].active = false;
                        }
                    }
                }
                rs[configName][code] = JSON.parse(JSON.stringify(nowActiveItem));
                rs[configName] = JSON.parse(JSON.stringify(nowChangeItem));
                if (code === "all"){
                    this.param[configName] = this.originParam[configName];
                    this.setParam();
                }
                this.setState({
                    interactive     : rs,
                    activeSuperItem : code
                });

            };

            /**
             * 二级菜单选中逻辑
             * @param {string}configName 对应 项目 卡玛
             * @param {num}code 相对参数
             * @param {string}superItem 父元素是谁
             * @return {null} null
             */
            this.changeChildItem = (configName, code, superItem) => {
                const rs = this.state.interactive;
                rs[configName][superItem].child = code;
                this.param[configName][superItem].rank = code;
                // 清楚对应自定义的值
                this.fillOption(configName, "", "");


                // 清楚警告
                this.fillWarning(configName, false);
                this.setState({
                    interactive: rs
                });
                this.setParam();
            };
            this.getFirstData = (configName, value) => {

                const superItem = this.state.activeSuperItem;
                const rs = this.state.interactive;
                const warning = this.state.warning;
                const num = Number.parseFloat(value);
                // 夏普卡玛兼容负数
                let flag = isNaN(num) && (value !== "");
                if (configName !== "sharpe" && configName !== "karma"){
                    flag = flag || (num < 0);
                }
                if (flag){
                    warning[configName][this.state.activeSuperItem].first = true;
                } else {

                    warning[configName][this.state.activeSuperItem].first = false;
                    let newValue = num;
                    if (value === ""){
                        newValue = null;
                    }

                    // 综合指标可复选不清空 为了防止该需求我还是留着吧....
                    this.param[configName][superItem].option = newValue;
                    // 记录当前的自定义值并清空其他的值
                    // let otherItem = superItem == "untilNow"
                    // this.param[configName][otherItem].option = null

                    // 清除对应的param数值
                    this.param[configName][superItem].rank = null;


                    if (value !== ""){
                        // 1.记录 对应参数 2更改交互信息


                        // 为了与子选项混淆，只需要有值即可
                        rs[configName][superItem].child = 9999;
                        this.setParam();
                    }

                }

                this.setState({
                    interactive : rs,
                    warning     : warning,
                });
            };
            this.fillOption = (configName, min) => {
                const minDOM = document.querySelector(`.${configName} .inputOption-first`);
                minDOM.value = min;
                this.param[configName][this.state.activeSuperItem].option = null;
            };
            this.fillWarning = (configName, first) => {
                const warning = this.state.warning;
                warning[configName][this.state.activeSuperItem].first = first;
                this.setState({
                    warning: warning
                });
            };
            this.formatData = (data) => {
                const param = data;
                F.deleteEmptyProperty(param);
                // 修改自定义，将option改为对应min max值
                this.formatOptionData(param);
                const newPram = param;
                return newPram;
            };
            this.formatOptionData = (data) => {
                for (const superKey in data){
                    for (const child in data[superKey]){
                        if (superKey === "volatility" || superKey === "drawdown"){
                            data[superKey][child].max = data[superKey][child].option;
                        } else {
                            data[superKey][child].min = data[superKey][child].option;
                        }
                        delete data[superKey][child].option;
                    }
                }
            };
            this.setParam = () => {
                const str = JSON.stringify(this.param);
                let newParam = JSON.parse(str);
                newParam = this.formatData(newParam);
                this.props.changeParam(newParam, "fundIndicator");
            };
            this.getDefault = (data) => {
                if (F.isEmpty(data)){
                    return;
                }
                const param = JSON.parse(JSON.stringify(data));
                const inter = this.state.interactive;
                for (const key in param){ // sharp
                    for (const child in param[key]){ // "1year"
                        const value = param[key][child];
                        if (!!value || value === 0){ // rank存在
                            inter[key].all.active = false;
                            inter[key][child].active = true;
                            if (!!value.rank){
                                inter[key][child].child = value.rank;
                                // 理论上没改动不加，改动了自然有数据
                                // this.param[key][child] = param[key][child].rank
                            } else {
                                // 填补自定义选项
                                // 填补值，证明有被选中
                                inter[key][child].child = 9999;
                                (value.min || value.min === 0) && (value.option = value.min);
                                (value.max || value.max === 0) && (value.option = value.max);
                                document.querySelector(`.${key} .inputOption-first`).value = value.option;
                            }

                        }
                    }
                }
                this.setState({
                    interactive: inter
                });
            };

            this.getDefaultParam = (data) => {
                if (F.isEmpty(data)){
                    return;
                }
                const param = JSON.parse(JSON.stringify(data));
                F.format(param, this.param);
                for (const superKey in this.param){
                    for (const key in this.param[superKey]){
                        const max = this.param[superKey][key].max;
                        const min = this.param[superKey][key].min;
                        const option = this.param[superKey][key].option;
                        if (max || min || max === 0 || min === 0){
                            (!!min || min === 0) && (this.param[superKey][key].option = min);
                            (!!max || max === 0) && (this.param[superKey][key].option = max);
                            delete this.param[superKey][key].max;
                            delete this.param[superKey][key].min;
                        }
                    }
                }
            };

        }
        componentDidMount(){
            // 设置参数复现
            this.getDefaultParam(this.props.fund.filterConditions.fundIndicator);
            // 设置样式的复现
            this.getDefault(this.props.fund.filterConditions.fundIndicator);

        }
        render(){
            const param = {
                config          : this.props.config.config,
                interactive     : this.state.interactive,
                activeSuperItem : this.state.activeSuperItem,
                sendData        : (configName, typeName, code) => this.sendData(configName, typeName, code),
                sendChildData   : (configName, code, superItem) => this.sendChildData(configName, code, superItem),
                getFirstData    : (configName, value) => this.getFirstData(configName, value),
                warning         : this.state.warning,
            };
            return (
                <View {...param}></View>
            );
        }
    };
};

module.exports = FundCIndexContainer;
