

const React = require("react");

const config = require("./config")[window.CUR_FUND];
const _ = require("../../common/christina/christina");
const until = require("../../common/util/util");
const Service = require("../../common/service/service");
const S = new Service();
const hashHistory = require("react-router").hashHistory;
require("./purchase.scss");
// TODO:把主表ID 改了 fundcode

const Order = (View) => {
    return class extends React.Component{
        constructor(){
            super();
            this.state = {
                config: config,
            };
            this.config = this.state.config;

            this.param = {
                type        : 0,
                thirdPartId : null,
                amount      : null,
                fundCode    : null,
                fundName    : null,
            };
            this.fundCompany = config.nameEn;
            // 是否正在请求，多次点击请求无效
            this.isFetching = false;
            // 此处为选择列表的回调，返回 在第type个选择框汇中，选择了第index项，
            this.onSelect = (index, type) => {
                // .log(`你选择了第${type}个列表的第${index}项`);
                switch (type){
                    // 第一类，选择基金，获得对应可赎回份额，提供code
                    case 0:{
                        this.getFundAmount(this.getFundCode(index));
                        break;
                    }
                }
                return ;
            };
            // 输入框回调，逻辑完成，缺失请求接口的逻辑
            this.onChange = (e, index) => {
                // 输入框3判断 1.数字 2. >0 3.<最大值
                // IE FIX IE会把一次value初始化赋值当做onchange，导致触发
                if (index === 0){
                    return;
                }
                let value = e.target.value;
                const nums = parseFloat(value);

                if (isNaN(nums) || nums <= 0
                    || nums > 999999999999) {
                    this.config.list[1].input.value = value;
                    this.config.list[2].text = "";
                    this.config.list[1].input.showWarning = true;
                    this.param.amount = null;
                    this.setState({
                        config: this.config
                    });
                } else {
                    // 当数字多余2位时，截取
                    const posi = value.indexOf(".");
                    if ((posi > 0) && value.length - (posi) > 2){
                        value = Math.floor((+value * 100)) / 100;
                    }

                    this.config.list[1].input.value = value;
                    this.config.list[1].input.showWarning = false;

                    this.config.list[2].text = (+value < 1 ? "零" : "") + _.numToCapital(value, true);
                    this.param.amount = value;

                    this.setState({
                        config: this.config
                    });
                }
            };
            this.finish = () => {
                if (this.isFetching){
                    return ;
                }
                this.isFetching = true;
                S.getTrans(this.fundCompany, this.param).then((rs) => {

                    if (rs.code === "0"){
                        this.isFetching = false;
                        hashHistory.push(`purchase/confirmOrder?&fundName=${encodeURIComponent(this.param.fundName)}&amount=${encodeURIComponent(this.param.amount)}`);
                        return true;
                    }
                });
            };
            this.callback = {
                onSelect  : (index, type) => this.onSelect(index, type),
                onChange  : (e, index) => this.onChange(e, index),
                onClick   : (index) => this.onClick(index),
                finish    : () => this.finish(),
                isShowAff : () => this.isShowAff()
            };
            this.isShowAff = () => {
                if (!this.param.amount){
                    this.config.list[1].input.showWarning = true;
                    this.setState({
                        config: this.config
                    });
                }
                return this.param;
            };
            this.getFundName = () => {
                const name = _.getUrlParam("fundName");
                const code = _.getUrlParam("fundCode");
                this.config.list[0].input.value = name;
                // IE下会出现1页出现名称的问题
                this.config.list[1].input.value = "";
                this.param.fundCode = code;
                this.param.fundName = name;
                this.amountInfo();
            };
            this.getParamID = () => {
                S.getInfoID(this.fundCompany, {
                    matrixID: window.localStorage.getItem("uid")
                }).then((item) => {
                    if (+item.resultCode === 0){
                        this.param.thirdPartId = this.infoID = item.infoID;
                    }
                });
            };
            this.amountInfo = () => {
                S.getAccountInfo(this.fundCompany, {
                    matrixID: window.uid,
                }).then((rs) => {
                    if (rs.code === 0){
                        this.config.list[4].option.cur = rs.contact;
                        this.config.list[4].option.list = [rs.contact];
                        this.config.list[3].option.cur = rs.bankName;
                        this.config.list[3].option.list = [rs.bankName];
                        this.setState({
                            config: this.config,
                        });
                    }
                });
            };
        }
        componentWillMount(){
            this.getParamID();
            this.getFundName();
        }
        componentWillUnmount(){
            this.param = {
                type        : 0,
                thirdPartId : null,
                amount      : null,
                fundCode    : null,
                fundName    : null,
            };
            this.config.list[0].input.value = "";
            this.config.list[1].input.value = "";
            this.config.list[2].text = "";
            this.state = {
                config: this.config,
            };
        }
        render(){
            return (
                <View
                    {...this.state.config}
                    {...this.callback}
                />
            );
        }
    };
};

module.exports = Order;