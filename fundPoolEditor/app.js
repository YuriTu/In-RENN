/**
 * 基金池编辑页
 *
 * Author:Yuri
 *
 */

const renderApp = require("../common/appContainer/appContainer");

const React = require("react");

const Component = React.Component;

/** ------各部分组件------**/

const LeftNav = require("./leftNav/leftNav");

const fundNameContainer = require("./tab/fundName/fundNameContainer");
const fundNameView = require("./tab/fundName/fundNameView");
const FundName = fundNameContainer(fundNameView);

const fundCompanyContainer = require("./tab/fundCompany/fundCompanyContainer");
const fundCompanyView = require("./tab/fundCompany/fundCompanyView");
const FundCompany = fundCompanyContainer(fundCompanyView);

const fundDetailContainer = require("./tab/fundDetail/fundDetailContainer");
const fundDetailView = require("./tab/fundDetail/fundDetailView");
const FundDetail = fundDetailContainer(fundDetailView);

const fundCIC = require("./tab/fundCIndex/fundCIndexContainer");
const fundCIV = require("./tab/fundCIndex/fundCIndexView");
const FundComprehensiveIndex = fundCIC(fundCIV);

const fundTypeContainer = require("./tab/fundType/fundTypeContainer");
const fundTypeView = require("./tab/fundType/fundTypeView");
const FundType = fundTypeContainer(fundTypeView);

const mailContainer = require("./tab/mail/mailContainer");
const mailView = require("./tab/mail/mailView");
const Mail = mailContainer(mailView);

const Affirm = require("../common/react-dialog/affirm");


const Service = require("../common/service/service");
const S = new Service();

const FormatObject = require("../common/formatObject/formatObject");
const F = new FormatObject();
const $ = require("jquery");
require("../../css/common.scss");

require("babel-polyfill");

require("./app.scss");

require("./tab/basic.scss");

const openConfig = require("./config/openConfig");

const interactive = require("./config/param");

window.BASE_STATIC_URL = "http://static.sofund.com/matrix/";

class App extends Component{
    constructor(){
        super();
        this.state = {
            interactive : interactive,
            fund        : {},
            affirmTitle : "确定删除该基金？",
            showAffirm  : false,
            fundPoolId  : "",
            mailWarning : false,
        };
        this.info = {
            userId: window.USER_ID,
        };
        this.param = {
            filterConditions: {
                fundCompany   : {},
                fundGeneral   : {},
                fundIndicator : {},
            }
        };
        this.mailParam = {
            userId     : null,
            fundPoolId : null,
            mailSubStr : ""
        };
        this.dealList = [];
        this.getPoolId = () => {
            const path = window.location.href;
            const index = path.indexOf("poolId=");
            this.info.poolId = path.substring(index + 7, path.length);
        };
        this.getFundInfo = () => {

            S.getPoolList({
                userId: this.info.userId
            }).then((rs) => {
                if (rs.code === "0000"){
                    let param = {};
                    rs.data.forEach((item) => {
                        if (item.poolId === this.info.poolId){
                            param = item;
                            param.filterConditions = JSON.parse(item.filterConditions);
                            this.param.filterConditions = param.filterConditions;
                        }
                    });

                    this.setState({
                        fund: param,
                    });
                }
            });
        };

        this.renderTabContent = (data) => {
            if (F.isEmpty(data)){
                return;
            }
            const component = {
                0 : [FundName, FundCompany, FundType, FundDetail, FundComprehensiveIndex, Mail],
                1 : [FundName, FundCompany, FundType, FundDetail, Mail]
            };
            const fundType = data.filterConditions.fundType.superFundType;
            this.param.filterConditions = data.filterConditions;
            const jsx = [];
            const copList = component[fundType];
            const configList = openConfig.renderList[fundType];
            copList.forEach((Item, index) => {
                jsx.push(
                    <Item
                        key = {configList[index]}
                        config = {openConfig[configList[index]]}
                        interactive = {this.state.interactive}
                        changeParam = {(value, type) => this.changeParam(value, type)}
                        changeInteractive = {(value, type) => this.changeInteractive(value, type)}
                        changeBasicParam = {(value, type) => this.changeBasicParam(value, type)}
                        changeMailParam = {(value, dealList) => this.changeMailParam(value, dealList)}
                        handleDelete = {(fundid) => this.handleDelete(fundid)}
                        fund = {this.state.fund}
                        info = {this.info}
                        mailWarning = {this.state.mailWarning}
                        fundType = {fundType}
                    />
                );
            });
            return jsx;
        };
        this.renderLeft = (data) => {
            if (F.isEmpty(data)){
                return;
            }
            const fundType = data.filterConditions.fundType.superFundType;
            return (
                <LeftNav
                    key = {"leftNav"}
                    config = {openConfig.leftNav.config[fundType]}
                />
            );
        };
        // 显示确认窗口
        this.handleDelete = (fundId) => {
            this.fundPoolId = fundId;
            this.setState({
                affirmTitle : "确定删除该基金池？",
                showAffirm  : true
            });
            this.handleAffirmClick = type => this.deleteConfirm(type);
        };
        this.deleteConfirm = (type) => {
            if (!type){
                S.deleteFundPool({
                    userId     : window.USER_ID,
                    fundPoolId : this.fundPoolId,
                }).then((rs) => {
                    window.location.href = "/web/fundpool/pool";
                });
            }
            this.setState({
                showAffirm: false
            });
        };
        this.changeParam = (value, type) => {
            this.param.filterConditions[type] = value;
        };
        this.changeInteractive = (value, type) => {
            const rs = this.state.interactive;
            rs[type] = value;
            this.setState({
                interactive: rs
            });
        };
        this.changeBasicParam = (value, type) => {
            this.param[type] = value;
        };
        this.changeMailParam = (value, dealList) => {
            this.mailParam.mailSubStr = value;
            this.mailParam.origin = value;
            this.dealList = dealList;
            // 清楚邮箱的提示
            this.setState({
                mailWarning: false
            });
        };
        this.submit = () => {
            const isMailNotEmpty = this.mailParam.mailSubStr.some(item => !!item.mailAddr);
            if (!isMailNotEmpty) {
                this.setState({
                    mailWarning: true
                });

                return;
            }
            const isMailError = this.mailParam.mailSubStr.some(item => !!item.error);
            if (!isMailError) {
                this.setState({
                    affirmTitle : "提交编辑基金池结果？",
                    showAffirm  : true
                });
                this.handleAffirmClick = type => this.submitConfirm(type);
            }

        };
        this.submitConfirm = (type) => {
            if (!type) {
                const editParam = this.formatEditAjaxParam(this.param);
                S.editPool(editParam).then((rs) => {
                    return rs;
                }).then(() => {
                    const mailParam = this.formatMaillParam(this.mailParam);
                    S.editMailSub(mailParam).then(() => {
                        this.unsubscribeMail && this.unsubscribeMail.then(result => result.code === "0000" && (location.href = `/web/fundpool/pool?poolId=${this.info.poolId}`));
                        location.href = `/web/fundpool/pool?poolId=${this.info.poolId}`;
                    });

                    this.unsubscribeMail = this.dealList.length > 0 && S.unsubscribeMail({
                        fundPoolId : this.info.poolId,
                        subIdArr   : this.dealList.join(",")
                    });
                });


            }
            this.setState({
                showAffirm: false
            });
        };
        this.formatEditAjaxParam = (data) => {

            const param = JSON.parse(JSON.stringify(data));
            const inter = JSON.parse(JSON.stringify(this.state.interactive[1]));

            const origin = this.state.fund;
            const condition = param.filterConditions;
            F.deleteEmptyProperty(condition);
            if (!param.fundPoolName){
                param.fundPoolName = origin.fundPoolName;
            }
            param.fundPoolId = this.info.poolId;
            param.userId = this.info.userId;
            param.pageNum = 1;
            param.pageSize = 20;
            F.deleteEmptyProperty(inter);
            delete inter.fundCIndex;
            param.fundInteractive = JSON.stringify(inter);
            param.filterConditions = JSON.stringify(condition);
            return param;
        };
        this.formatMaillParam = (data) => {
            const param = JSON.parse(JSON.stringify(data));
            param.userId = this.info.userId;
            param.fundPoolId = this.info.poolId;
            const paramList = param.mailSubStr.map((item) => {
                const ob = {
                    subId      : item.subId,
                    mailAddr   : item.mailAddr,
                    noticeTime : item.noticeTime,
                    noticeType : item.noticeType,
                };
                return ob;
            });
            param.mailSubStr = JSON.stringify(paramList);

            return param;

        };
        this.cancel = () => {
            this.setState({
                affirmTitle : "取消编辑基金池结果？",
                showAffirm  : true
            });
            this.handleAffirmClick = type => this.cancelConfirm(type);
        };
        this.cancelConfirm = (type) => {
            if (!type) {
                window.location.href = `/web/fundpool/pool?poolId=${this.info.poolId}`;
            }
            this.setState({
                showAffirm: false
            });
        };
        this.closeAffirm = () => this.handleAffirmClick(1);
        this.sureAffirm = () => this.handleAffirmClick(0);
    }

    componentWillMount(){
        this.getPoolId();
        this.getFundInfo();
    }
    componentDidMount(){
        $("#js-download-target").attr("href", "#");
    }
    render(){
        return (
            <div className="fpe clearfix">
                <div className="left">
                    {this.renderLeft(this.state.fund)}
                </div>
                <div className="right active">
                    {this.renderTabContent(this.state.fund)}
                    <div className="btnList">
                        <div className="btn btn-can" onClick={() => this.cancel()}>取消</div>
                        <div className="btn btn-sub" onClick={() => this.submit()}>提交</div>
                    </div>
                </div>
                <Affirm
                    title={this.state.affirmTitle}
                    isShow={this.state.showAffirm}
                    close={() => this.closeAffirm()}
                    sure={() => this.sureAffirm()}
                />
            </div>
        );
    }
}





renderApp({
    AppChild: App,
});
