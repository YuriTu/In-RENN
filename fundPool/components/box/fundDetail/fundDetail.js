/**
 * 基金池创建 基金概况
 *
 * Author：Yuri 2016/09/22
 */


// TODO:achi的展开，scale的warning效果测试

const React = require("react");

const Component = React.Component;

const FormatObject = require("../../../../common/formatObject/formatObject");
const F = new FormatObject();
const interactive = require("../../../config/param");
require("../basic.scss");


const achieveBasicList = ["m", "m3", "m6", "y", "jn", "zj"];
const createWarningParam = () => {
    "use strict";
    const rs = {
        fundAchieve : {},
        fundScale   : {
            first  : false,
            second : false,
            text   : "*请输入正确的数字"
        },
    };
    achieveBasicList.forEach((item) => {
        rs.fundAchieve[item] = {
            first  : false,
            second : false,
            text   : "*请输入正确的数字"
        };
    });
    return rs;

};
const createParam = () => {
    "use strict";
    const param = {
        fundAchieve: [
            {
                yieldRank : "",
                minyield  : null,
                rank      : null,
            }
        ],
        fundScale: {
            min : null,
            max : null
        }
    };
    return param;
};

const FundDetail = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive     : props.interactive[1].fundDetail,
                prevActiveSuper : null,
                warning         : createWarningParam(),
            };
            this.param = createParam();

            this.paramForRefresh = createParam();
            this.setStatePromise = (newState) => F.setStatePromise(this, newState);
            this.isFirstLoad = true;


            this.sendData = (configName, typeName, code) => {
                if (configName === "fundAchieve"){
                    this.changeAchieve(typeName, code);
                } else {
                    this.changeScale(typeName, code);
                }
            };
            this.changeScale = (typeName, code) => {

                this.param.fundScale.min = code;
                this.param.fundScale.max = null;

                const rs = this.state.interactive;
                rs.fundScale.activeItem = code;
                // 自定义处理
                const warning = this.state.warning;
                warning.fundScale.first = false;
                warning.fundScale.second = false;
                const min = document.querySelector(".fundScale .inputOption-first");
                const max = document.querySelector(".fundScale .inputOption-second");
                min.value = "";
                max.value = "";
                this.setStatePromise({
                    warning     : warning,
                    interactive : rs
                });
                this.getResultCount(this.param);
            };
            // 不是我要嵌套七层...是它的交互真的很复杂....
            this.changeAchieve = (typeName, code) => {

                const rs = this.state.interactive;
                const warning = this.state.warning;
                let showChild = rs.fundAchieve.showChild;

                // 如果是一级类型
                if (typeName === "superParamActiveItem"){
                    // 是否选中以有状态
                    if (code === this.state.prevActiveSuper){

                        if (showChild){
                            // 当处于关闭状态的时候
                            if (!!this.param.fundAchieve[0].rank || !!this.param.fundAchieve[0].minyield){
                                // 有已选
                                // 遍历找出有值的一级选项
                                if (!!this.param.fundAchieve[0].rank){
                                    for (const key in rs.fundAchieve.childActive){
                                        if (rs.fundAchieve.childActive[key] > 0){
                                            rs.fundAchieve.superParamActiveItem = key;
                                        }
                                    }
                                } else {
                                    for (const key in rs.fundAchieve.min){
                                        if (rs.fundAchieve.min[key] > 0){
                                            rs.fundAchieve.superParamActiveItem = key;
                                        }
                                    }
                                }
                                showChild = false;

                            } else {
                                // 无已选
                                showChild = false;
                                this.changeAchieve(typeName, null);
                            }
                        } else {
                            // 当处于被点击状态时，无论之前都高亮最后一次点击的，因为此处为单选
                            rs.fundAchieve[typeName] = code;
                            showChild = true;
                        }

                    } else {
                        // 第一次选中某二级类型  1.因为是一套东西只是改变了inter数据，所以需要清空已有的自定义，除非是已选的
                        showChild = true;
                        rs.fundAchieve[typeName] = code;
                        // 记录一级选项
                        this.param.fundAchieve[0].yieldRank = code;
                        // 如果之前有偶自定义数据就保存，否则清空
                        document.querySelector(".achieveSuper .inputOption-first").value = !!rs.fundAchieve.min[code] ? rs.fundAchieve.min[code] : "";

                        if (code === null){
                            rs.fundAchieve.showChild = false;
                            showChild = false;
                            rs.fundAchieve.childActive = {
                                "m"  : null,
                                "m3" : null,
                                "m6" : null,
                                "y"  : null,
                                "jn" : null,
                                "zj" : null,
                            };
                            this.getResultCount(this.param);
                        }
                        // 记录上一次被选中的一级选项
                        this.setState({
                            prevActiveSuper: code
                        });

                    }
                } else {
                    // 只有选中二级选项后才能记录一级选项
                    this.param.fundAchieve[0].rank = code;
                    // 设置保存对应状态，其他状态清零
                    const list = rs.fundAchieve.childActive;
                    for (const key in list){
                        if (key === this.state.prevActiveSuper){
                            list[key] = code;
                        } else {
                            list[key] = -1;
                        }
                    }
                    // 清空自定义
                    document.querySelector(".achieveSuper .inputOption-first").value = "";

                    warning.fundAchieve.first = false;
                    warning.fundAchieve.second = false;
                    this.getResultCount(this.param);
                }
                rs.fundAchieve.showChild = showChild;
                this.setState({
                    interactive : rs,
                    warning     : warning
                });
            };
            // 设置自定义参数
            // TODO:输入状态的交互
            this.getFirstData = (configName, value) => {
                const inter = this.state.interactive;
                const num = Number.parseFloat(value);
                const warning = this.state.warning;

                if (configName === "fundAchieve"){
                    if (isNaN(num) && value !== "" || num < 0){
                        warning.fundAchieve[this.state.prevActiveSuper].first = true;
                    } else {
                        warning.fundAchieve[this.state.prevActiveSuper].first = false;
                        inter.fundAchieve.childActive[this.state.prevActiveSuper] = null;
                        if (value === ""){
                            this.param.fundAchieve[0].minyield = null;
                            inter.fundAchieve.min[this.state.prevActiveSuper] = null;
                            this.changeAchieve("prevActiveSuper", null);
                        } else {

                            this.param.fundAchieve[0].minyield = value;
                            this.param.fundAchieve[0].rank = null;
                            // 记录当前的自定义值并清空其他的值
                            for (const key in inter.fundAchieve.min){
                                inter.fundAchieve.min[key] = null;
                                if (key === this.state.prevActiveSuper){
                                    inter.fundAchieve.min[this.state.prevActiveSuper] = value;
                                }
                            }
                            this.getResultCount(this.param);
                        }
                    }
                    this.setState({
                        interactive : inter,
                        warning     : warning,
                    });
                } else {

                    this.setOptionData(configName, value, 1);
                }
            };
            this.getSecondData = (configName, value) => {
                // 在输入第二个数值时，先判断是否有第一个数据value，如果有就不清，没有，即为选项造成，清出
                const minDOM = document.querySelector(`.${configName} .inputOption-first`);
                if (!minDOM.value){
                    this.param[configName].min = null;
                }
                this.setOptionData(configName, value, 2);
            };
            this.setOptionData = (configName, value, type) => {
                let inputIndex = "first";
                let inputParam = "min";
                let otherInputIndex = "second";
                let otherInputParam = "max";
                if (type === 2){
                    inputIndex = "second";
                    inputParam = "max";
                    otherInputIndex = "first";
                    otherInputParam = "min";
                }
                const num = Number.parseFloat(value);
                const warning = this.state.warning;

                const rs = this.state.interactive;
                const sendData = () => {
                    this.param[configName][inputParam] = num;
                    rs[configName][inputParam] = num;
                    rs[configName].activeItem = -1;
                    warning[configName].first = false;
                    warning[configName].second = false;
                    this.getResultCount(this.param);
                };
                if (isNaN(num) && value !== ""){

                    warning[configName][inputIndex] = true;
                } else if (value === ""){
                    // 既是删除情况
                    // 1.清除警告 ，回归单值状态
                    // 2.清除警告，无值 回归不限状态
                    // 3.请求一次
                    warning[configName].first = false;
                    warning[configName].second = false;

                    this.param[configName][inputParam] = null;
                    rs[configName][inputParam] = null;

                    if (!!this.param[configName][otherInputParam]){
                        rs[configName].activeItem = -1;
                    } else {
                        rs[configName].activeItem = null;
                    }
                    this.getResultCount(this.param);

                } else if (!!this.param[configName][otherInputParam]) {
                    let flag = num >= this.param[configName][otherInputParam] ;
                    if (type === 2){
                        flag = this.param[configName][otherInputParam] >= num;
                    }
                    if (flag){
                        warning[configName][otherInputIndex] = true;
                    } else {
                        this.param[configName][inputParam] = num;
                        rs[configName][inputParam] = num;
                        rs[configName].activeItem = -1;
                        warning[configName].first = false;
                        warning[configName].second = false;
                        this.getResultCount(this.param);
                    }
                } else {
                    sendData();
                }

                this.setState({
                    warning     : warning,
                    interactive : rs,
                });
            };
            this.filloption = (configName, min, max) => {
                const minDOM = document.querySelector(`.${configName} .inputOption-first`);
                const maxDOM = document.querySelector(`.${configName} .inputOption-second`);
                if (configName === "fundScale"){
                    minDOM.value = min;
                    maxDOM.value = max;
                }
            };
            // this.changeItem = (configName, code) => {
            //     const rs = this.state.interactive;
            //     rs[configName].activeItem = code;
            //     this.setState({
            //         interactive: rs
            //     });
            // };
            this.handleNext = (isSkip, config) => {
                const param = this.formatData(this.param);
                // 如果什么都不选 则返回false
                // 只有有值的情况，才进行传递，否则直接至空
                if (param && !isSkip){
                    this.props.changeAjaxCacheParam(param, "fundGeneral");
                    this.props.changeInteractive(this.state.interactive, "fundDetail");
                }
                this.props.changeHeaderItem(config[0].length - 1);
            };
            this.handlePrev = () => {
                this.props.changeHeaderItem(1);
            };
            this.formatData = (data) => {
                const param = {};
                // 基金收益没选
                if (!!this.param.fundAchieve[0].yieldRank){
                    // 选了一级没选二级
                    // 没选二级选项
                    if (!this.param.fundAchieve[0].rank){
                        // 选自定义了没？

                        if (!!this.param.fundAchieve[0].minyield){
                            param.fundAchieve = [{
                                yieldRank : this.param.fundAchieve[0].yieldRank,
                                minyield  : this.param.fundAchieve[0].minyield,
                            }];
                        }
                    } else {
                        // 选了二级选项
                        param.fundAchieve = [{
                            yieldRank : this.param.fundAchieve[0].yieldRank,
                            rank      : this.param.fundAchieve[0].rank,
                        }];
                    }
                }
                param.fundScale = {
                    min : this.param.fundScale.min,
                    max : this.param.fundScale.max,
                };
                F.deleteEmptyProperty(param);

                return this.isEmptyObject(param) ? false : param;
            };
            // 判断是否为空对象
            this.isEmptyObject = (obj) => {
                for (const i in obj){
                    return !1;
                }
                return !0;
            };
            this.judgeRoute = (config) => {
                let rs = "FundResult";
                if (config[0].length === 4){
                    rs = "FundCIndex";
                }
                return rs;
            };
        }
        getResultCount(param){
            const newParam = JSON.parse(JSON.stringify(this.formatData(param)));
            F.deleteEmptyProperty(newParam);
            this.props.changeAjaxCacheParam(newParam, "fundGeneral", false, true);
            this.props.getResultCount();
        }
        fillDefault(data){
            for (const type in data){
                const min = document.querySelector(`.${type} .inputOption-first`);

                const max = document.querySelector(`.${type} .inputOption-second`);
                const flag = (data[type].min || data[type].min === 0) || (data[type].max || data[type].max === 0);
                if (flag){
                    if (typeof data[type].min === "object"){
                        let hasValue = "";
                        for (const key in data[type].min){
                            if (!!data[type].min[key]){
                                hasValue = key;
                            }
                        }
                        if (hasValue === ""){
                            min.value = "";
                        } else {
                            min.value = data[type].min[hasValue];
                        }
                    } else {
                        min.value = data[type].min;
                    }

                    max.value = data[type].max;
                } else {
                    // 当数据为null时，清空数据
                    min.value = "";
                    max.value = "";
                }

                // ie9兼容 null
                min.value === "null" ? min.value = "" : null;
                max.value === "null" ? max.value = "" : null;
                // }
            }
        }
        setHeader(){
            // 获得以前的参数
            const param = JSON.parse(window.sessionStorage.getItem("param"));
            this.props.setPropsState("param", param);
            const inter = JSON.parse(window.sessionStorage.getItem("interactive"));
            const activeHeader = inter[1].header.type;
            const activeHeaderItem = inter[1].header.active;

            this.props.changeHeader(activeHeader);
            this.props.changeHeaderItem(activeHeaderItem);
        }
        fixInteractive(data){
            // 给予 this.state.prevActiveSuper 一个值
            const pr = data.fundAchieve.superParamActiveItem;
            if (!!pr || pr !== ""){
                this.param.fundAchieve[0].yieldRank = pr;
                this.setState({
                    prevActiveSuper: pr
                });
            }
        }
        getDefaultParam(data){
            if (F.isEmpty(data)) {
                this.param = createParam();
            } else {
                F.format(data, this.param);
            }
        }
        updateData(){
            // 1.update Param
            this.getDefaultParam(this.props.param.fundGeneral);
            // 2.inter  获取高亮一级元素修正inter交互
            this.fixInteractive(this.state.interactive);
            // 3.填充自定义
            this.fillDefault(this.state.interactive);
        }
        componentWillReceiveProps(nextProps){

            if (JSON.stringify(this.state.interactive) !== JSON.stringify(nextProps.interactive[1].fundDetail)) {
                // 刚进来rank是没有值的，如果是选择就有值了
                if (F.isEmpty(nextProps.param.fundGeneral)){
                    this.isFirstLoad = false;
                    this.setStatePromise({
                        interactive: nextProps.interactive[1].fundDetail,
                    }).then((rs) => {
                        this.getDefaultParam(nextProps.param.fundGeneral);
                        this.fixInteractive(this.state.interactive);
                        this.fillDefault(this.state.interactive);
                        this.props.getResultCount();
                    });
                }
            }
        }
        componentDidMount(){
            // 每个组价加载时该做的
            // 1.清空当前页之后的数据 2.更新header  3.更新参数 param 与 inter(复现正常的交互)填写自定义4.请求结果数据
            this.props.cleanAfterData(2);
            this.setHeader();
            this.updateData();
            this.props.getResultCount(this.param);
        }

        render(){
            const param = {
                config             : this.props.config[1].fundDetail.config,
                active             : this.state.active,
                interactive        : this.state.interactive,
                route              : this.judgeRoute(this.props.config), 
                resultCount        : this.props.resultCount,
                resultCompanyCount : this.props.resultCompanyCount,
                prevActiveSuper    : this.state.prevActiveSuper,
                warning            : this.state.warning,
                sendData           : (configName, typeName, code) => this.sendData(configName, typeName, code),
                getFirstData       : (configName, value) => this.getFirstData(configName, value),
                getSecondData      : (configName, value) => this.getSecondData(configName, value),
                handleNext         : (value) => this.handleNext(value, this.props.config),
                handlePrev         : () => this.handlePrev()
            };
            return (
                <View {...param}/>
            );
        }
    };
};


FundDetail.propType = {
    config: React.PropTypes.array
};

module.exports = FundDetail;
