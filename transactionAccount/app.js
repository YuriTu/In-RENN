/**
 * 基金交易页
 * Author：Yuri
 * Date：2017.03.30
 */
window.CUR_FUND = "guangfa";
const renderApp = require("../common/appContainer/appContainer");

const React = require("react");

const Component = React.Component;

const $ = require("jquery");

const Service = require("../common/service/service");
const S = new Service();
const _ = require("../common/util/util");

const ReactTabs = require("../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const ReactRouter = require("react-router");

const Link = ReactRouter.Link;

const IndexLink = ReactRouter.IndexLink;


/** 基础配置加载完成 **/

const purConfig = require("./common/purchaseConfig");
const redConfig = require("./common/redeemConfig");

const routeHeaderContainer = require("./common/components/routeHeader");

const Form = require("./common/components/from");

// 申购页前置表格
const Purchase = require("./purchase/purchase");
// 申赎逻辑页
const orderContainer = require("./purchase/order");
const Order = orderContainer(Form);
const redeemContainer = require("./redeem/redeemControl");
const Redeem = redeemContainer(Form);
// 申赎成功页
const ConfirmOrder = require("./purchase/confirmOrder");
const Uspekh = require("./redeem/success");

const CheckObject = require("../common/accountCheckUrl/accountCheckUrl");
const Check = new CheckObject(window.CUR_FUND);

Check.redirectAction = (status, index, replace, callback) => {
    const href = location.href;
    if (status !== 1) {
        // 判断是不是在第一页，不是的话重定向到第一页
        location.href = `/${window.CUR_FUND}/register`;
    } else {
        if (window.location.href.indexOf("uspekh") >= 0){
            replace("/redeem/start");
            callback();
        } else if (href.indexOf("confirmOrder") >= 0){
            replace("/");
            callback();
        }
        // return true;
    }

    return false;
};

require("./basic.scss");

require("../../css/common.scss");

window.BASE_STATIC_URL = "http://static.sofund.com/matrix/";
window.uid = window.localStorage.getItem("uid");
window.TEMP_COMPANY = window.CUR_FUND;

class App extends Component{
    constructor(){
        super();
        this.renderTabContent = () => {
            const tabContent = React.Children.map(this.props.children,
                (child) => {
                    return React.cloneElement(child, {
                        innerHeight : window.innerHeight,
                        purConfig   : purConfig,
                        redConfig   : redConfig,
                    });
                }
            );
            return tabContent;
        };
    }
    componentDidMount(){
        if (_.isIE()){
            $(".react-tab-content").css("minHeight", `${window.innerHeight - 135}px`);
        } else {
            $(".react-tab-content").css("minHeight", `${window.innerHeight - 122}px`);
        }
    }
    render(){
        return (
            <div className="main-container transactionAccount">
                <div className="tabs-content">
                    <Tabs>
                        <div>
                            <IndexLink to="/" activeClassName="active" className={window.location.href.indexOf("purchase") >= 0 ? "active" : ""} component={Purchase} ><Tab>基金购买</Tab></IndexLink>
                            <a href="#/redeem/start" className={window.location.href.indexOf("redeem") >= 0 ? "active" : ""}><Tab>基金赎回</Tab></a>
                            <TabBody>{this.renderTabContent()}</TabBody>
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    }
}

let enable = true;

const enableFn = () => {
    enable = true;
};
const offBefore = () => {
    enable = false;
    setTimeout(enableFn, 500);
};

const disableFn = () => {
    enable = false;
};
const fn = (event) => {
    if (enable){
        const e = event || window.event, info = "你还有数据未保存，确定离开当前页吗?";
        e && (e.returnValue = info);
        offBefore();
        return info;
    }
};
const onBefore = () => {
    !!USER_ID && (window.onbeforeunload = fn);

};

const checkUrl = Check.checkUrl;

renderApp({
    AppChild   : App,
    indexRoute : Purchase,
    onEnter    : checkUrl,
    route      : [
        {
            path       : "/",
            component  : Purchase,
            indexRoute : Purchase,
        },
        {
            path       : "purchase",
            component  : routeHeaderContainer,
            indexRoute : Order,
            subset     : [{
                path      : "order",
                component : Order,
                onEnter   : (...args) => {
                    setTimeout(() => {
                        enableFn();
                        onBefore();
                    });
                    checkUrl(...args);
                },
                onLeave: disableFn,
            }, {
                path      : "confirmOrder",
                component : ConfirmOrder,
                onEnter   : checkUrl,
            }]
        },
        {
            path       : "redeem",
            component  : routeHeaderContainer,
            indexRoute : Redeem,
            onEnter    : checkUrl,
            subset     : [{
                path      : "start",
                component : Redeem,
                onEnter   : (...args) => {
                    setTimeout(() => {
                        enableFn();
                        onBefore();
                    });
                    checkUrl(...args);
                },
                onLeave: disableFn,
            }, {
                path      : "uspekh",
                component : Uspekh,
                onEnter   : checkUrl,
            }]
        },
    ]
}, true);