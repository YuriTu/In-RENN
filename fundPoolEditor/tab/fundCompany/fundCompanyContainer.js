const React = require("react");

const Component = React.Component;

const Format = require("../../../common/formatObject/formatObject");
const F = new Format();

const basicList = ["scale", "foundTime", "managerCount", "productCount"];
const creatWarningParam = () => {
    "use strict";

    const rs = {};
    basicList.forEach((item) => {
        rs[item] = {
            first  : false,
            second : false,
            text   : "*请输入正确的数字"
        };
    });
    return rs;
};
const creatParam = () => {
    "use strict";

    const rs = {};
    basicList.forEach((item) => {
        rs[item] = {
            min : null,
            max : null,
        };
    });
    return rs;
};




const FundCompanyContainer = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive : props.interactive[1].fundCompany,
                warning     : creatWarningParam(),
            };
            this.param = creatParam();
            this.sendData = (configName, code) => {
                this.changeItem(configName, code);
                this.setCacheParam(configName, code);
            };
            this.changeItem = (configName, code) => {
                const rs = this.state.interactive;
                rs[configName].activeItem = code;
                this.setState({
                    interactive: rs
                });
            };
            // 设置选项参数
            this.setCacheParam = (configName, code) => {

                this.param[configName].min = code;
                // 清空自定义
                this.param[configName].max = null;
                document.querySelector(`.fpe-fundCompany .${configName} .inputOption-first`).value = "";
                document.querySelector(`.fpe-fundCompany .${configName} .inputOption-second`).value = "";
                this.setInterOption(configName, null, null);
                this.setParam();
            };
            // 设置自定义参数
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
                    // 不能直接就清掉，如果是之前的选项才清理，如果没有选项不能清
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
                            this.setParam();
                        }

                    } else {
                        rs[configName].activeItem = -1;
                        this.param[configName][inputParam] = num;
                        this.setParam();
                    }
                }
                this.setState({
                    warning     : warning,
                    interactive : rs,
                });
            };
            this.getFirstData = (configName, value) => {
                this.setOptionData(configName, value, 1);
            };
            this.getSecondData = (configName, value) => {
                this.setOptionData(configName, value, 2);
            };
            this.setInterOption = (configName, min, max) => {
                const inter = this.state.interactive;
                inter[configName].min = min;
                inter[configName].max = max;
                this.setState({
                    interactive: inter
                });
            };
            // 失焦清空一类选项
            this.handleBlur = (configName, value) => {
                if (!!value){
                    this.changeItem(configName, -1);
                }
            };
            this.formatData = (data) => {

                const param = {};
                for (const key in data){
                    const flag = data[key].min && data[key].max;
                    if (!flag){
                        param[key] = data[key];
                    }
                }
                return this.isEmptyObject(param) ? false : param;
            };
            // 判断是否为空对象
            this.isEmptyObject = (obj) => {
                for (const i in obj){
                    return !1;
                }
                return !0;
            };
            this.setParam = () => {
                const str = JSON.stringify(this.param);
                const newParam = JSON.parse(str);
                // F.deleteEmptyProperty(newParam);
                this.props.changeParam(newParam, "fundCompany");
            };
            this.fillOptionDefault = (data, filter) => {
                F.format(filter.fundCompany, data);
                for (const type in data){
                    if ( ((!!data[type].min || data[type].min === 0) || (!!data[type].max || data[type].max === 0)) && data[type].activeItem < 0){
                        const min = document.querySelector(`.${type} .inputOption-first`);
                        const max = document.querySelector(`.${type} .inputOption-second`);
                        min.value = data[type].min;
                        max.value = data[type].max;
                    }
                }
            };
            this.formatToParam = (data) => {
                const newParam = this.param;
                for (const key in data){
                    if (data[key].activeItem && data[key].activeItem > 0){
                        newParam[key].min = data[key].activeItem;
                    } else {
                        newParam[key].min = data[key].min;
                        newParam[key].max = data[key].max;
                    }
                }
                return newParam;
            };
            this.getDefault = (data, filter) => {
                if (F.isEmpty(data)){
                    return;
                }
                const param = JSON.parse(data).fundCompany;
                // 根据原参数修改现参数
                this.param = this.formatToParam(param);
                const inter = this.state.interactive;
                F.format(param, inter);
                // 填补默认自定义数字
                this.fillOptionDefault(inter, filter);
                this.setState({
                    interactive: inter
                });
            };
            this.getDefaultParam = (data) => {
                F.format(data, this.param);
            };
        }
        componentDidMount(){
            this.getDefault(this.props.fund.fundInteractive, this.props.fund.filterConditions);
            this.getDefaultParam(this.props.fund.filterConditions.fundCompany);
        }
        render(){
            const param = {
                config        : this.props.config.config,
                interactive   : this.state.interactive,
                sendData      : (configName, code) => this.sendData(configName, code),
                getFirstData  : (configName, value) => this.getFirstData(configName, value),
                getSecondData : (configName, value) => this.getSecondData(configName, value),
                handleBlur    : (configName, value) => this.handleBlur(configName, value),
                warning       : this.state.warning,
            };
            return (
                <View {...param}/>
            );
        }
    };
};

module.exports = FundCompanyContainer;
