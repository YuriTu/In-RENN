/**
 *  交易页 赎回组件
 *  Author Yuri 2016/03/02
 */

const React = require("react");
const Component = React.Component;

const config = require("./config")[window.CUR_FUND];
const _ = require("../../common/christina/christina");

const Service = require("../../common/service/service");
const S = new Service();
const hashHistory = require("react-router").hashHistory;
require("./../redeem/redeem.scss");

const redeem = (View) => {
    return class extends Component{
        constructor(){
            super();
            this.state = {
                config: config,
                warningDia : {
                    title:"赎回失败",
                    children:<span>赎回失败</span>,
                    isShow:false,
                    useCloseIcon:true,
                    close:() =>this.closeWarning(),
                }
            };
            this.fundCompany = window.CUR_FUND;
            this.fundNameList = [];
            this.fundCodeMap = {};
            this.infoID = null;
            this.config = this.state.config;
            this.isFetching = false;
            this.param = {
                type        : 1,
                thirdPartId : null,
                amount      : null,
                fundCode    : null,
                fundName    : null,
                redeemtype  : 0,
            };
            this.closeWarning = () => {
                this.setState({
                    warningDia: {
                        ...this.state.warningDia,
                        isShow:false,
                    }
                });
            };
            // 此处为选择列表的回调，返回 在第type个选择框汇中，选择了第index项，
            this.onSelect = (index, type) => {
                // .log(`你选择了第${type}个列表的第${index}项`);
                switch (type){
                    // 第一类，选择基金，获得对应可赎回份额，提供code
                    case 0:{
                        this.getFundAmount(this.getFundCode(index));
                        break;
                    }
                    case 4:{
                        this.param.redeemtype = index;
                    }
                }
                return ;
            };
            this.getFundCode = (index) => {
                // 他的fundName是
                const thisFund = this.fundNameList[index];
                const thisCode = this.fundCodeMap[thisFund];
                this.param.fundCode = thisCode;
                this.param.fundName = thisFund;
                return {
                    fundName : thisFund,
                    fundCode : thisCode,
                };
            };
            const formateValue = (string) => {
                let rs = string;
                if (rs[rs.length - 1] === "零"){
                    rs = rs.substring(0, rs.length - 1);
                }
                return `${rs}份`;
            };
            this.onChange = (e) => {
                // 我觉得没必要检查那么严格。。。，应该有一定容忍度，毕竟可能用户误触，
                // 输入框3判断 1.数字 2. >0 3.<最大值
                const nums = parseFloat(e.target.value);
                if (isNaN(nums) || nums <= 0
                    || nums > parseFloat(this.config.list[1].text)) {
                    this.config.list[2].input.value = e.target.value;
                    this.config.list[3].text = "";
                    this.config.list[2].input.showWarning = true;
                    this.param.amount = null;
                    this.setState({
                        config: this.config
                    });
                } else {
                    // 当数字多余2位时，截取
                    let value = e.target.value;
                    const posi = value.indexOf(".");
                    if ((posi > 0) && value.length - (posi) > 2){
                        value = Math.floor((+value * 100)) / 100;
                    }
                    this.config.list[2].input.value = value;
                    this.config.list[2].input.showWarning = false;

                    this.config.list[3].text = formateValue(_.numToCapital(value, false));
                    this.param.amount = value;

                    this.setState({
                        config: this.config
                    });
                }
            };
            // 点击全部逻辑，完成
            this.onClick = (index) => {

                if (+this.config.list[1].text === 0){
                    // process.env.NODE_ENV === "production" ? "" : console.error("可赎回份额为0");
                    return;
                }
                this.config.list[3].text = formateValue(_.numToCapital(this.config.list[1].text, false) );
                this.config.list[2].input.value = this.config.list[1].text;
                this.config.list[2].input.showWarning = false;
                this.param.amount = this.config.list[2].input.value;
                this.setState({
                    config: this.config
                });
            };
            this.callback = {
                onSelect  : (index, type) => this.onSelect(index, type),
                onChange  : (e) => this.onChange(e),
                onClick   : (index) => this.onClick(index),
                finish    : () => this.finish(),
                isShowAff : () => this.isShowAff()
            };
            this.finish = () => {
                if (this.isFetching){
                    return ;
                }
                this.isFetching = true;
                S.getTrans(this.fundCompany, this.param).then((rs) => {
                    if (+rs.code === 0){
                        this.isFetching = false;
                        hashHistory.push(`redeem/uspekh?&fundName=${encodeURIComponent(this.param.fundName)}&amount=${encodeURIComponent(this.param.amount)}`);
                        return true;
                    } else {
                        this.isFetching = false;
                        this.setState({
                            warningDia:{
                                ...this.state.warningDia,
                                isShow:true,
                                children:<div style={{"lineHeight":"40px"}}>{rs.msg}</div>,
                            }
                        })

                        return false;
                    }
                });
            };
            this.isShowAff = () => {
                if (!this.param.amount){
                    this.config.list[2].input.showWarning = true;
                    this.setState({
                        config: this.config
                    });
                }
                return this.param;
            };
            this.getParamID = () => {
                S.getInfoID(this.fundCompany, {
                    matrixID: window.uid,
                }).then((item) => {
                    if (+item.resultCode === 0){
                        this.param.thirdPartId = this.infoID = item.infoID;
                        this.getFundList();
                    }
                });
            };
            this.getFundList = () => {
                S.getAllFund(config.nameEn, {}).then((rs) => {
                    if (+rs.code === 0){
                        rs.data.forEach((item) => {
                            this.fundNameList.push(item.fundName);
                            this.fundCodeMap[item.fundName] = item.fundCode;
                        });
                        this.config.list[0].option.list = this.fundNameList;
                        this.config.list[0].option.cur = this.fundNameList[0];
                    }
                    // 请求第一个基金的默认 可用份额
                    this.getFundAmount({
                        fundName : this.fundNameList[0],
                        fundCode : this.fundCodeMap[this.fundNameList[0]]
                    });
                });
            };
            // 获得对应fund的可赎回份额
            this.getFundAmount = (fundInfo) => {
                S.getRedeemAmount(this.fundCompany, {
                    thirdPartId : this.infoID,
                    fundCode    : fundInfo.fundCode,
                }).then((rs) => {
                    let am = 0;
                    if (rs.code === "0000") {
                        try {
                            am = rs.sharelist[0].availableshare;
                        } catch (er){
                            // process.env.NODE_ENV === "production" ? "":console.error("未返回可赎回份额");
                            am = 0;
                        }
                    }
                    // 当为0事，按钮不可点击
                    this.config.isDisableBtn = !am;

                    this.config.list[1].text = (+am).toFixed(2);
                    // 每次选择新的基金是初花赎回份额的input
                    this.config.list[2].input = {
                        ...this.config.list[2].input,
                        value       : "",
                        showWarning : false,
                        isClick     : false,
                    };
                    this.config.list[3].text = "";
                    // 查询是否支持快速赎回

                    if (this.canQuickRedeem(fundInfo.fundCode)){
                        this.config.list[4].option.isDisabled = false;
                    } else {
                        this.config.list[4].option.isDisabled = true;
                    }
                    this.param.fundCode = fundInfo.fundCode;
                    this.param.fundName = fundInfo.fundName;
                    // 请求经办人与账户信息
                    this.amountInfo();
                });
            };

            // 获取收款账户和经办人的基本信息
            this.amountInfo = () => {
                S.getAccountInfo(config.nameEn, {
                    matrixID: window.uid,
                }).then((rs) => {
                    if (+rs.code === 0){
                        this.config.list[6].option.cur = rs.contact;
                        this.config.list[6].option.list = [rs.contact];
                        this.config.list[5].option.cur = rs.bankName;
                        this.config.list[5].option.list = [rs.bankName];

                        this.setState({
                            config: this.config
                        });
                    }
                });
            };
            this.canQuickRedeem = (code) => {
                return !!(config.canQuickRedeem.indexOf(code) >= 0);
            };
        }
        componentWillMount(){
            this.getParamID();
        }
        componentWillUnmount(){
            this.param = {
                type        : 1,
                thirdPartId : null,
                amount      : null,
                fundCode    : null,
                fundName    : null,
                redeemtype  : 0,
            };
            this.config.list[2].input.value = "";
            this.config.list[3].text = "";
            this.state = {
                config: this.config,
            };
        }
        render(){
            // 当接口很慢时，需要做零态处理
            return <View
                {...this.state.config}
                {...this.callback}
                warningDia = {this.state.warningDia}
            />;
        }
    };
};

module.exports = redeem;