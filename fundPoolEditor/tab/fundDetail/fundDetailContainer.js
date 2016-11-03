/**
 * 基金池编辑- 详情
 */
const React = require("react");

const Component = React.Component;
const FormatObject = require("../../../common/formatObject/formatObject");
const F = new FormatObject();

const achieveBasicList = ["m", "m3", "m6", "y", "jn", "zj"];
const creatWarningParam = () => {
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
const originInteractive = {
    fundAchieve: {
        superParamActiveItem : null,
        // null可以关闭子选项
        childActive          : {
            "m"  : null,
            "m3" : null,
            "m6" : null,
            "y"  : null,
            "jn" : null,
            "zj" : null,
        },
        showChild : false,
        min       : {
            "m"  : null,
            "m3" : null,
            "m6" : null,
            "y"  : null,
            "jn" : null,
            "zj" : null,
        },
    },
    fundScale: {
        activeItem : null,
        min        : null,
        max        : null,
    }
};


const FundDetailContainer = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive     : props.interactive[1].fundDetail,
                prevActiveSuper : null,
                warning         : creatWarningParam(),
            };
            this.param = {
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
                },

            };
            this.paramForRefresh = JSON.parse(JSON.stringify(this.param));

            this.sendData = (configName, typeName, code) => {
                if (configName === "fundAchieve"){
                    this.changeAchieve(typeName, code);
                }
                else {
                    this.changeScale(typeName, code);
                }
            };
            this.changeScale = (typeName, code) => {
                const rs = this.state.interactive;

                rs.fundScale.activeItem = code;

                const warning = this.state.warning;

                // 清除自定义
                warning.fundScale.first = false;
                warning.fundScale.second = false;
                const min = document.querySelector(".fundScale .inputOption-first");
                const max = document.querySelector(".fundScale .inputOption-second");
                min.value = "";
                max.value = "";
                this.param.fundScale.max = null;
                this.setState({
                    warning     : warning,
                    interactive : rs
                });
                this.param.fundScale.min = code;

                this.setParam();
            };
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
                            // 子菜单关闭也可能是初次进来
                            if (code === null){
                                showChild = false;
                                // this.changeAchieve(typeName, null);
                                this.param.fundAchieve = JSON.parse(JSON.stringify(this.paramForRefresh.fundAchieve));
                                rs.fundAchieve = originInteractive.fundAchieve;
                                this.setParam();
                            } else {
                                showChild = true;
                            }

                        }

                    } else {
                        // 第一次选中某二级类型
                        showChild = true;
                        rs.fundAchieve[typeName] = code;
                        // 记录一级选项
                        this.param.fundAchieve[0].yieldRank = code;
                        // 如果之前有偶自定义数据就保存，否则清空
                        const minOption = rs.fundAchieve.min[code];
                        document.querySelector(".achieveSuper .inputOption-first").value = (!!minOption || minOption === 0) ? minOption : "";
                        if (code === null){
                            rs.fundAchieve.showChild = false;
                            rs.fundAchieve.childActive = {
                                "m"  : null,
                                "m3" : null,
                                "m6" : null,
                                "y"  : null,
                                "jn" : null,
                                "zj" : null,
                            };
                            this.setParam();
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
                    this.param.fundAchieve[0].minyield = null;
                    for (const key in rs.fundAchieve.min){
                        rs.fundAchieve.min[key] = null;
                    }
                    document.querySelector(".achieveSuper .inputOption-first").value = "";

                    warning.fundAchieve.first = false;
                    warning.fundAchieve.second = false;
                    this.setParam();
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
                    if ( (isNaN(num) && value !== "" ) || num < 0){
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
                            // 清空选项
                            this.param.fundAchieve[0].rank = null;
                            // 记录当前的自定义值并清空其他的值
                            for (const key in inter.fundAchieve.min){
                                inter.fundAchieve.min[key] = null;
                                if (key === this.state.prevActiveSuper){
                                    inter.fundAchieve.min[this.state.prevActiveSuper] = value;
                                }
                            }
                            this.setParam();
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
                this.setOptionData(configName, value, 2);
            };
            this.setOptionData = (configName, value, type) => {
                const num = Number.parseFloat(value);
                const warning = this.state.warning;
                const rs = this.state.interactive;

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

                if ((isNaN(num) || num < 0) && value !== ""){
                    warning[configName][inputIndex] = true;
                } else {
                    // 清楚之前的选项选中的效果与参数
                    if (!(rs[configName].activeItem < 0)){
                        this.param[configName][otherInputParam] = null;
                    }
                    if (value === ""){
                        // 既是删除情况
                        // 1.清除警告 ，回归单值状态



                        // 2.清除警告，无值 回归不限状态

                        warning[configName].first = false;
                        warning[configName].second = false;

                        this.param[configName][inputParam] = null;
                        rs[configName][inputParam] = null;

                        if (!!this.param[configName][otherInputParam]){
                            rs[configName].activeItem = -1;
                            this.setParam();
                        } else {
                            rs[configName].activeItem = null;
                            this.changeItem(configName, null);
                        }

                    } else if (!!this.param[configName][otherInputParam])
                    // 是否是双选
                    {
                        rs[configName].activeItem = -1;
                        let flag = num >= this.param[configName][otherInputParam] ;
                        if (type === 2){
                            flag = this.param[configName][otherInputParam] >= num;
                        }
                        // 是否有错误
                        if (flag){
                            warning[configName][otherInputIndex] = true;
                        } else {
                            warning[configName][otherInputIndex] = false;
                            this.param[configName][inputParam] = num;
                            rs[configName][inputParam] = num;
                            this.setParam();

                        }

                    } else {
                        rs[configName].activeItem = -1;
                        this.param[configName][inputParam] = num;
                        rs[configName][inputParam] = num;
                        this.setParam();
                    }
                }
                this.setState({
                    warning     : warning,
                    interactive : rs,
                });
            };
            // 失焦清空一类选项
            this.handleBlur = (configName, value) => {
                // this.changeItem(configName, -1);
            };
            this.changeItem = (configName, code) => {
                const rs = this.state.interactive;
                rs[configName].activeItem = code;
                this.setState({
                    interactive: rs
                });
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
                // 如果也没选scale
                const flagScale = this.param.fundScale.min && this.param.fundScale.max;
                param.fundScale = {
                    min : this.param.fundScale.min,
                    max : this.param.fundScale.max,
                };
                F.deleteEmptyProperty(param);

                return F.isEmpty(param) ? false : param;
            };

            this.setParam = () => {
                const str = JSON.stringify(this.param);
                let newParam = JSON.parse(str);
                newParam = this.formatData(newParam);
                if (newParam){
                    this.props.changeParam(newParam, "fundGeneral");
                } else {
                    this.props.changeParam(this.paramForRefresh, "fundGeneral");
                }
                this.props.changeInteractive(this.state.interactive, "fundGeneral");

            };
            this.getDefaultInteractive = (data) => {
                if (F.isEmpty(data)){
                    return;
                }
                const param = JSON.parse(data).fundDetail;
                const inter = this.state.interactive;
                F.format(param, inter);
                this.fillDefaultOption(param);
                inter.fundAchieve.showChild = false;
                if (inter.fundScale.activeItem === 0){
                    inter.fundScale.activeItem = null;
                }

                this.setState({
                    interactive: inter
                });
            };
            this.getDefaultParam = (data) => {

                if (F.isEmpty(data)){
                    return;
                }
                if (!!data.fundAchieve){
                    for (const key in data.fundAchieve[0]){
                        this.param.fundAchieve[0][key] = data.fundAchieve[0][key];
                    }
                }
                if (!!data.fundScale){
                    for (const key in data.fundScale){
                        this.param.fundScale[key] = data.fundScale[key];
                    }
                }
            };
            this.fillDefaultOption = (data) => {
                const min = document.querySelector(".fundScale .inputOption-first");
                const max = document.querySelector(".fundScale .inputOption-second");
                if (!!data.fundScale){
                    const dataMin = data.fundScale.min;
                    const dataMax = data.fundScale.max;
                    if (!F.isEmpty(data.fundScale)){
                        if ((!!data.fundScale.activeItem && data.fundScale.activeItem < 0 ) && (dataMax || dataMax === 0 || dataMin || dataMin === 0)) {
                            (dataMin || dataMin === 0) && (min.value = data.fundScale.min);
                            (dataMax || dataMax === 0) && (max.value = data.fundScale.max);
                        }
                    }

                }
            };
        }
        componentDidMount(){
            this.getDefaultInteractive(this.props.fund.fundInteractive);
            this.getDefaultParam(this.props.fund.filterConditions.fundGeneral);
            this.fillDefaultOption(this.props.fund.fundInteractive);

        }
        render(){
            const param = {
                config          : this.props.config.config[this.props.fundType],
                active          : this.state.active,
                interactive     : this.state.interactive,
                prevActiveSuper : this.state.prevActiveSuper,
                warning         : this.state.warning,
                sendData        : (configName, typeName, code) => this.sendData(configName, typeName, code),
                getFirstData    : (configName, value) => this.getFirstData(configName, value),
                getSecondData   : (configName, value) => this.getSecondData(configName, value),
                handleBlur      : (configName, value) => this.handleBlur(configName, value),
            };
            return (
                <View {...param}/>
            );
        }
    };
};

module.exports = FundDetailContainer;
