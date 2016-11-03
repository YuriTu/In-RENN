/**
 * 基金池创建 - 基金公司
 *
 * Author： Yuri 2016/10/11
 */

const React = require("react");

const Component = React.Component;
const FormatObject = require("../../../../common/formatObject/formatObject");
const F = new FormatObject();
const basicList = ["scale", "foundTime", "managerCount", "productCount"];

const interactive = require("../../../config/param");

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
require("../basic.scss");
// TODo: 只有在点击下一步后，inter与param一样才能被传递
// 所以刷新的情况与header
// 是类似的，需要读取存放在本地的上一次的数据的结果
const FundCompany = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive : props.interactive[1].fundCompany,
                warning     : creatWarningParam(),
            };
            this.param = creatParam();
            this.paramForRefresh = creatParam();
            this.setStatePromise = (newState) => F.setStatePromise(this, newState);

        }

        // 用于请求筛选结果
        getResultCount(param){
            const str = JSON.stringify(param);
            const newParam = JSON.parse(str);
            F.deleteEmptyProperty(newParam);
            this.props.changeAjaxCacheParam(newParam, "fundCompany", false, true);
            this.props.getResultCount();
        }
        // componentdid
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
        // view层所用逻辑
        handleNext(){
            F.deleteEmptyProperty(this.param);
            const param = this.param;
            // 如果什么都不选 则返回false
            // 只有有值的情况，才进行传递，否则直接至空
            if (!F.isEmpty(param)){
                this.props.changeAjaxCacheParam(param, "fundCompany");
                this.props.changeInteractive(this.state.interactive, "fundCompany");
            }
            this.props.changeHeaderItem(2);
        }
        handlePrev(){
            this.props.changeHeaderItem(0);
        }
        // 设置自定义参数
        getFirstData(configName, value){
            this.setOptionData(configName, value, 1);
        }
        setOptionData(configName, value, type){
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

            } else if (!!this.param[configName][otherInputParam]){
                let flag = num >= this.param[configName][otherInputParam] ;
                if (type === 2){
                    flag = this.param[configName][otherInputParam] >= num;
                }
                if (flag){
                    warning[configName][otherInputIndex] = true;
                } else {
                    warning[configName][otherInputIndex] = false;
                    this.param[configName][inputParam] = num;
                    rs[configName][inputParam] = num;
                    this.getResultCount(this.param);
                }
            } else {
                this.param[configName][inputParam] = num;
                rs[configName][inputParam] = num;
                rs[configName].activeItem = -1;
                warning[configName].first = false;
                warning[configName].second = false;
                this.getResultCount(this.param);
            }

            this.setState({
                warning     : warning,
                interactive : rs,
            });
        }
        getSecondData(configName, value){
            this.setOptionData(configName, value, 2);
        }

        fillOption(configName, min, max){
            const minDOM = document.querySelector(`.${configName} .inputOption-first`);
            const maxDOM = document.querySelector(`.${configName} .inputOption-second`);
            minDOM.value = min;
            maxDOM.value = max;
        }
        sendData(configName, code){
            this.changeItem(configName, code);
            // TODO
            this.setCacheParam(configName, code);
        }
        changeItem(configName, code){

            const rs = this.state.interactive;
            rs[configName].activeItem = code;
            this.setState({
                interactive: rs
            });
        }
        // 设置选项参数
        setCacheParam(configName, code){
            this.param[configName].min = code;
            // // 清空自定义
            this.param[configName].max = null;
            const min = document.querySelector(`.${configName} .inputOption-first`);
            const max = document.querySelector(`.${configName} .inputOption-second`);
            min.value = "";
            max.value = "";
            // 清除警告
            const warning = this.state.warning;
            warning[configName].first = false;
            warning[configName].second = false;
            // 清空inter中的记录
            const inter = this.state.interactive;
            inter[configName].min = null;
            inter[configName].max = null;
            this.setState({
                warning     : warning,
                interactive : inter
            });
            this.getResultCount(this.param);
        }

        fillDefault(data){
            for (const type in data){
                const min = document.querySelector(`.${type} .inputOption-first`);
                const max = document.querySelector(`.${type} .inputOption-second`);
                const flag = (data[type].min || data[type].min === 0) || (data[type].max || data[type].max === 0);
                if (flag){
                    min.value = data[type].min;
                    max.value = data[type].max;
                } else {
                    min.value = "";
                    max.value = "";
                }
                // ie9兼容
                min.value === "null" ? min.value = "" : null;
                max.value === "null" ? max.value = "" : null;
            }

        }

        getDefaultParam(data){
            // 如果是重置参数，则直接生成
            if (F.isEmpty(data)) {
                this.param = creatParam();
            } else {
                F.format(data, this.param);
            }

        }
        updateData(){
            // 1.update param
            this.getDefaultParam(this.props.param.fundCompany);
            // 2.update inter  inter从父组件灌入，子组件不要操作
            this.fillDefault(this.state.interactive);
        }
        componentWillReceiveProps(nextProps){
            if (JSON.stringify(this.state.interactive) !== JSON.stringify(nextProps.interactive[1].fundCompany)) {
                if (F.isEmpty(nextProps.param.fundCompany)){
                    this.setStatePromise({
                        interactive: nextProps.interactive[1].fundCompany,
                    }).then((rs) => {
                        this.getDefaultParam(nextProps.param.fundCompany);

                        this.fillDefault(this.state.interactive);
                        this.props.getResultCount();
                    });

                }

            }
        }

        componentDidMount(){
            // 每个组价加载时该做的
            // 1.清空当前页之后的数据 2.更新header  3.更新参数 param 与 inter(复现正常的交互)填写自定义4.请求结果数据
            this.props.cleanAfterData(1);
            this.setHeader();
            this.updateData();
            this.props.getResultCount();
        }
        render(){
            const param = {
                handleNext         : () => this.handleNext(),
                handlePrev         : () => this.handlePrev(),
                resultCount        : this.props.resultCount,
                resultCompanyCount : this.props.resultCompanyCount,
                config             : this.props.config[1].fundCompanyFilterList.config,
                getFirstData       : (configName, value) => this.getFirstData(configName, value),
                getSecondData      : (configName, value) => this.getSecondData(configName, value),
                sendData           : (configName, code) => this.sendData(configName, code),
                interactive        : this.state.interactive,
                warning            : this.state.warning,
            };
            return (
                <View {...param}/>
            );
        }
    };
};

module.exports = FundCompany;
