

const React = require("react");

const Component = React.Component;
const FormatObject = require("../../../../common/formatObject/formatObject");
const F = new FormatObject();
require("../basic.scss");


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

const FundCIndex = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive     : props.interactive[1].fundCIndex,
                // 上一次点击是一年还是至今
                activeSuperItem : "all",
                warning         : warningParam,
            };
            this.setStatePromise = (newState) => F.setStatePromise(this, newState);

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
            this.originParam = this.createParam();
            this.paramForRefresh = JSON.parse(JSON.stringify(this.param));


            this.sendData = (configName, typeName, code) => {
                this.changeItem(configName, typeName, code);
            };
            this.sendChildData = (configName, code, superItem) => {
                this.changeChildItem(configName, code, superItem);
            };
            // 项目被点击的参数记录
            this.changeItem = (configName, typeName, code) => {

                const rs = this.state.interactive;
                rs[configName].currentActive = code;
                let nowChangeItem = rs[configName];
                // 目前活动的项目 1year or until
                let nowActiveItem = rs[configName][code];

                const otherItem = code === "1year" ? "untilNow" : "1year";

                // 那一天人们又想起了曾经被 花式交互逻辑 支配的恐惧

                // 不是我要写这么多判断！！！我也有苦衷！！！ TAT   (╯‵□′)╯︵┻━┻

                // 一级菜单改动  不科学啊我拿的是引用啊，为什么还要赋值一遍
                if (code === "all"){
                    nowActiveItem = true;
                    nowChangeItem = JSON.parse(JSON.stringify(returnAll));
                    const origin = this.createParam();
                    this.param[configName] = origin[configName];
                    this.getResultCount(this.param);
                } else {
                    nowChangeItem.all.active = false;
                    // 渲染清空自定义
                    // // 修正option参数
                    const optionValue = this.param[configName][code].option;
                    document.querySelector(`.${configName} .inputOption-first`).value = (!!optionValue || optionValue === 0) ? optionValue : "";
                        // 看是不是已经被点击状态
                    if (nowActiveItem.active){
                            // 关闭---有值-高亮 无值-不高亮
                        if (!!nowActiveItem.child && nowActiveItem.child !== 9999){
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
                            if (nowActiveItem.child === 9999){
                                nowChangeItem.showChild = !nowChangeItem.showChild;
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
                this.setState({
                    interactive     : rs,
                    activeSuperItem : code
                });
            };

            /**
             * 二级选项选中
             * @param {string} configName 对应 项目 卡玛
             * @param {num}code 相对参数
             * @param {string} superItem 父元素是谁
             * @return {null} noreturn
             */
            this.changeChildItem = (configName, code) => {
                const rs = this.state.interactive;
                const superItem = rs[configName].currentActive;
                rs[configName][superItem].child = code;
                this.param[configName][superItem].rank = code;
                // 清楚自定义
                this.fillOption(configName, "", "");

                // 清楚警告
                this.fillWarning(configName, false);
                this.setState({
                    interactive: rs
                });
                this.getResultCount(this.param);
            };
            this.getFirstData = (configName, value) => {
                const superItem = this.state.activeSuperItem;
                const rs = this.state.interactive;
                const warning = this.state.warning;
                const num = Number.parseFloat(value);
                let flag = (isNaN(num) && value !== "");

                // 夏普卡玛负数兼容
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

                    }
                    this.getResultCount(this.param);
                }

                this.setState({
                    interactive : rs,
                    warning     : warning,
                });
            };
            this.fillOption = (configName, min, childParam) => {
                const minDOM = document.querySelector(`.${configName} .inputOption-first`);
                minDOM.value = min;
                // 清除数据
                if (childParam){
                    this.param[configName][childParam].option = null;
                } else if (this.state.activeSuperItem !== "all") {
                    this.param[configName][this.state.activeSuperItem].option = null;
                }

                // if (!!this.param[configName][superItem].min || !!this.param[configName][superItem].max){
                //     if (!!this.param[configName][superItem].min ){
                //         this.param[configName][superItem].min = null;
                //     } else {
                //         this.param[configName][superItem].max = null;
                //     }
                // }
            };
            this.fillWarning = (configName, first) => {
                const warning = this.state.warning;
                warning[configName][this.state.activeSuperItem].first = first;
                this.setState({
                    warning: warning
                });
            };

            this.handleNext = (isSkip) => {
                const param = this.formatData(this.param);
                // 如果什么都不选 则返回false
                // 只有有值的情况，才进行传递，否则直接至空
                if (param && !isSkip){
                    this.props.changeAjaxCacheParam(param, "fundIndicator");
                    this.props.changeInteractive(this.state.interactive, "fundCIndex");
                }
            };

            this.handlePrev = () => {
                this.props.changeHeaderItem(2);
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
        }

        getResultCount(param){
            const str = JSON.stringify(param);
            const newParam = JSON.parse(str);
            const NewParam = this.formatData(newParam);
            this.props.changeAjaxCacheParam(NewParam, "fundIndicator", false, true);
            this.props.getResultCount();
        }

        fillDefault(param){
            for (const type in param){
                for (const child in param[type]){
                    const flag = (param[type][child].min || param[type][child].min === 0);
                    let value;
                    if (flag){
                        value = param[type][child].min;
                    }
                    if (param[type][child].max || param[type][child].max === 0){
                        value = param[type][child].max;
                    }
                    if (value || value === 0){
                        // this.fillOption(type, value, child);
                        this.fillOption(type, value, false);
                    }
                }

            }
        }
        // 默认进入时关闭二级菜单，触发preveacitve，以免请求错误
        fixInteractive(){
            const rs = this.state.interactive;
            for (const child in rs){
                rs[child].showChild = false;
            }
            // rs.showChild = false;
            this.setState({
                interactive: rs
            });
        }
        getDefaultParam(data){

            if (F.isEmpty(data)){
                return;
            }
            F.format(data, this.param);
        }

        fixOption(paramValue){
            const param = paramValue;
            for (const type in param){
                for (const child in param[type]){
                    let value;
                    (param[type][child].min || param[type][child].min === 0 ) && (value = param[type][child].min);
                    (param[type][child].max || param[type][child].max === 0 ) && (value = param[type][child].max);
                    if (value || (value === 0)){
                        param[type][child].option = value;
                        delete param[type][child].max;
                        delete param[type][child].min;

                    }

                }

            }
        }
        updateData(paramFromProps){
            // 1.update param
            this.getDefaultParam(paramFromProps);
            // 2. update inter 默认进入时关闭二级菜单，触发preveacitve，以免请求错误
            this.fixInteractive();
            // 3.fill option
            this.fixOption(this.param);
            this.fillDefault(paramFromProps);

        }
        componentWillReceiveProps(nextProps){
            if (JSON.stringify(this.state.interactive) !== JSON.stringify(nextProps.interactive[1].fundCIndex)) {
                if (F.isEmpty(nextProps.param.fundIndicator)){
                    this.setStatePromise({
                        interactive: nextProps.interactive[1].fundCIndex,
                    }).then((rs) => {
                        let param;
                        if (!!nextProps.param.fundIndicator && !F.isEmpty(nextProps.param.fundIndicator) ){
                            param = nextProps.param.fundIndicator;
                        } else {
                            param = this.createParam();
                            this.param = this.createParam();
                        }
                        this.updateData(param);
                        this.props.getResultCount();
                    });
                }
            }
        }


        componentDidMount(){
            // 每个组价加载时该做的
            // 1.清空当前页之后的数据 2.更新header  3.更新参数 param 与 inter(复现正常的交互)填写自定义4.请求结果数据
            this.updateData(this.props.param.fundIndicator);
            this.props.getResultCount();
        }


        render(){
            const param = {
                config             : this.props.config[1].fundCIndex.config,
                interactive        : this.state.interactive,
                activeSuperItem    : this.state.activeSuperItem,
                resultCount        : this.props.resultCount,
                resultCompanyCount : this.props.resultCompanyCount,
                sendData           : (configName, typeName, code) => this.sendData(configName, typeName, code),
                sendChildData      : (configName, code, superItem) => this.sendChildData(configName, code, superItem),
                getFirstData       : (configName, value) => this.getFirstData(configName, value),
                handleNext         : () => this.handleNext(),
                handlePrev         : () => this.handlePrev(),
                warning            : this.state.warning,
            };
            return (
                <View {...param}></View>
            );
        }
    };
};

module.exports = FundCIndex;
