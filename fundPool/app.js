/**
 * 基金池创建页
 *
 * Author:Yuri
 */

const renderApp = require("../common/appContainer/appContainer");

const React = require("react");

const Component = React.Component;

const $ = require("jquery");

const GuideView = require("../common/guideView/guideView");


const HeaderIndex = require("./components/header/header");

const FundPoolType = require("./components/box/fundType/fundPoolType");


const fundCompanyContainer = require("./components/box/fundCompany/fundCompanyContainer");
const fundCompanyView = require("./components/box/fundCompany/fundCompanyView");
const FundCompany = fundCompanyContainer(fundCompanyView);

const fundDetailContainer = require("./components/box/fundDetail/fundDetail");
const fundDetailView = require("./components/box/fundDetail/fundDetailView");
const FundDetail = fundDetailContainer(fundDetailView);

const fundCIndexContainer = require("./components/box/fundComprehensiveIndex/fundComprehensiveIndex");
const fundCIndexView = require("./components/box/fundComprehensiveIndex/fundCIndexView");
const FundCIndex = fundCIndexContainer(fundCIndexView);

const fundResultContainer = require("./components/box/fundResult/fundResult");
const fundResultView = require("./components/box/fundResult/fundResultView");
const FundResult = fundResultContainer(fundResultView);

const monetaryConfig = require("./config/monetary");
const openConfig = require("./config/open");

const interactive = require("./config/param");

const FormatObject = require("../common/formatObject/formatObject");
const F = new FormatObject();

require("./app.scss");

require("../../css/common.scss");

require("babel-polyfill");

window.BASE_STATIC_URL = "http://static.sofund.com/matrix/";

const Service = require("../common/service/service");
const S = new Service();

// 初始化参数
const initInter = () => {
    return JSON.parse(JSON.stringify(interactive));
};
const initParam = () => {
    return JSON.parse(JSON.stringify(interactive[0].cache));
};

class App extends Component{
    constructor(){
        super();
        this.state = {
            basicConfig        : openConfig,
            interactive        : initInter(),
            // param              : initParam(),
            resultCount        : 0,
            resultCompanyCount : 0,
            guideShow          : false
        };
        this.monetaryConfig = monetaryConfig;
        this.openConfig = openConfig;
        this.originParam = JSON.parse(JSON.stringify(interactive[0].cache));
        this.originInteractive = JSON.parse(JSON.stringify(interactive));
        this.setStatePromise = (newState) => F.setStatePromise(this, newState);

        this.tempParam = initParam();

    }
    renderComponent(){
        const config = this.state.basicConfig;
        const typeConfig = [this.openConfig, this.monetaryConfig];
        const content = React.Children.map(this.props.children,
            (child) => {
                return React.cloneElement(child, {
                    // 渲染配置
                    config               : config,
                    // header区分配置
                    typeConfig           : typeConfig,
                    // 交互配置
                    interactive          : this.state.interactive,
                    // 预请求参数
                    // param                : this.state.param,
                    param                : this.tempParam,
                    // 请求结果数
                    resultCount          : this.state.resultCount,
                    resultCompanyCount   : this.state.resultCompanyCount,
                    // 改变头部 3 || 4
                    changeHeader         : (value) => this.changeHeader(value),
                    // 改变头部高亮项目
                    changeHeaderItem     : (value) => this.changeHeaderItem(value),
                    // 改变预请求参数
                    changeAjaxCacheParam : (value, superKey, childKey, isGetCount) => this.changeAjaxCacheParam(value, superKey, childKey, isGetCount),
                    // 改变交互参数
                    changeInteractive    : (value, type) => this.changeInteractive(value, type),
                    // 获取结果数
                    getResultCount       : () => this.getResultCount(),
                    // 设置父级state
                    setPropsState        : (key, value) => this.setPropsState(key, value),
                    // 创建操作
                    finish               : () => this.finish(),
                    // 初始化相关数据
                    initParam            : (childParam) => this.initParam(childParam),
                    // 清理index页之后的数据
                    cleanAfterData       : (index) => this.cleanAfterData(index)
                });
            }
        );
        return content;
    }

    /**
     * 业务逻辑
     */

    // 更改顶部header样式
    changeHeader(type){
        const inter = this.state.interactive;
        inter[1].header.type = type;
        this.setState({
            basicConfig : !!type ? this.monetaryConfig : this.openConfig,
            interactive : inter
        });
        window.sessionStorage.setItem("interactive", JSON.stringify(inter) );
    }
    changeHeaderItem(type){
        const inter = this.state.interactive;
        inter[1].header.active = type;
        this.setState({
            interactive: inter
        });
        window.sessionStorage.setItem("interactive", JSON.stringify(inter) );
    }
    changeAjaxCacheParam(value, superKey, childKey, isGetCount){
        // const param = this.state.param;
        const param = this.tempParam;
        if (!!childKey){
            param[superKey][childKey] = value;
        } else {
            param[superKey] = value;
        }
        // this.setState({
        //     param: param
        // });
        // 是临时请求数量则不改变
        if (!isGetCount){
            window.sessionStorage.setItem("param", JSON.stringify(param));
        }

    }
    changeInteractive(value, type){
        const rs = this.state.interactive;
        rs[1][type] = value;
        this.setState({
            interactive: rs
        });
        window.sessionStorage.setItem("interactive", JSON.stringify(rs) );
    }

    getResultCount(){
        // 不要污染源参数
        let param = this.formatParam(this.tempParam);
        if (this.tempParam.fundType.superFundType === ""){
            param = this.formatParam (JSON.parse(window.sessionStorage.getItem("param")));
        }

        const newParam = new Object();
        for (const i in param){
            newParam[i] = param[i];
        }
        F.deleteEmptyProperty(newParam);
        newParam.userId = window.USER_ID;
        newParam.pageNum = 1;
        newParam.pageSize = 20;
        this.queryCountForCreatPool && this.queryCountForCreatPool.abort("fail");
        this.queryCountForCreatPool = S.queryCountForCreatPool(newParam);
        this.queryCountForCreatPool.then((rs) => {
            this.setState({
                resultCount: rs.data.count
            });
        });


        const companyParam = JSON.parse(JSON.stringify(newParam));
        if (!!JSON.parse(newParam.filterConditions).fundCompany){
            companyParam.companyJson = JSON.stringify(JSON.parse(newParam.filterConditions).fundCompany);
        } else {
            companyParam.companyJson = "";
        }

        companyParam.fundPoolId = 0;
        this.getFilterCompany && this.getFilterCompany.abort("fail");
        this.getFilterCompany = S.getFilterCompany(companyParam);
        this.getFilterCompany.then( (rs) => {
            let result;
            if (F.isEmpty(rs.data)){
                result = 0;
            } else {
                result = rs.data.count;
            }
            this.setState({
                resultCompanyCount: result,
            });
        });

    }

    setPropsState(key, value){
        this.setState({
            [key]: value
        });
    }


    finish(){
        let isInAjax = true;
        const param = this.formatParam(this.tempParam);
        let inter = JSON.stringify(this.state.interactive);
        inter = JSON.parse(inter);
        F.deleteEmptyProperty(inter);
        delete inter[1].fundCIndex;
        param.fundInteractive = JSON.stringify(inter[1]);
        if (isInAjax) {
            isInAjax = false;
            S.creatFundPool({ ...param }).then((rs) => {
                isInAjax = true;
                this.clearStorage();
                window.location.href = "/web/fundpool/pool";
            });
        }
    }
    formatParam(value){
        const cache = value;
        const param = {
            filterConditions: {},
        };
        const rs = {};
        // 去重
        for (const key in cache){
            if (!F.isEmpty(cache[key])){
                if (key === "basicInfo"){
                    param[key] = cache[key];
                } else {
                    param.filterConditions[key] = cache[key];
                }

            }
        }
        rs.filterConditions = JSON.stringify(param.filterConditions);
        for (const key in param.basicInfo){
            rs[key] = param.basicInfo[key];
        }
        return rs;
    }

    /**
     * 读取刷新修改时使用的初始化函数
     * @param {string} childParam fundCompany fundDetail |which type of data you wanna change
     * @return {null} null
     */
    initParam(childParam){
        let child = childParam;
        const param = this.tempParam;
        // const param = this.state.param;
        const originParam = initParam();
        param[child] = originParam[child];

        if (child === "fundGeneral") {
            child = "fundDetail";
        }
        if (child === "fundIndicator") {
            child = "fundCIndex";
        }
        const inter = this.state.interactive;
        const originInter = initInter();
        inter[1][child] = originInter[1][child];
        this.setStatePromise({
            interactive: inter,
            // param       : param
        });
        window.sessionStorage.setItem("param", JSON.stringify(param));
        window.sessionStorage.setItem("interactive", JSON.stringify(inter) );
    }

    cleanAfterData(startParam){
        let start = startParam;
        // 即使是是上一步过来的
        const type = this.tempParam.fundType.superFundType;
        // const type = this.state.param.fundType.superFundType;
        const list = ["fundCompany", "fundGeneral", "fundIndicator"];
        if (type !== ""){
            if (type === 1){
                list.pop();
            }
            while (start > 0){
                list.shift();
                start--;
            }
            list.forEach((item) => {
                this.initParam(item);
            });
        }
    }

    /**
     * 生命周期逻辑
     */


    guideView(){
        S.guideView({
            userId : window.localStorage.getItem("uid"),
            flag   : "fundPool"
        }).then(rs => {
            if (rs.data) {
                this.setState({
                    guideShow: !rs.data.status
                }, () => {
                    if (this.state.guideShow) {
                        this.guideViewFunc();
                    }
                });
            }
        });
    }

    guideViewFunc() {
        const header = $("header"), step1 = $(".pool-guide-step1"), manager = $(".manager-list"),
            tab = $(".main-content"), step2 = $(".pool-guide-step2");
        manager.css("display", "block");
        step1.css("display", "block");
        header.css("position", "static");
        tab.css("margin-top", "0px");
        step1.hover( (e) => {
            const events = e || event;
            events.stopPropagation();
        });
        $(".pool-guide-step1-confirm").on("click", (e) => {
            const events = e || event;
            events.stopPropagation();
            step1.css("display", "none");
            manager.css("display", "none");
            // step2.css("display", "block");
            this.setState({
                guideShow: false
            });
            header.css("position", "fixed");
            tab.css("margin-top", "60px");
        });

        // 暂时去掉第二部引导
        // $(".pool-guide-step2-confirm").on("click", (e) => {
        //     const events = e || event;
        //     events.stopPropagation();
        //     step2.css("display", "none");
        //     this.setState({
        //         guideShow: false
        //     });
        //     header.css("position", "fixed");
        //      tab.css("margin-top", "60px");
        // });
    }
    // 对刷新情况进行判断，如果是刷新情况，清楚当前页
    isRefresh(){
        // 清楚当前页与之后
        const hash = window.location.hash;
        const name = hash.substring(2, hash.indexOf("?"));
        const list = {
            ""             : 0,
            "FundPoolType" : 0,
            "FundCompany"  : 1,
            "FundDetail"   : 2,
            "FundCIndex"   : 3,
            "FundResult"   : 4,
        };
        const index = list[name];
        if (index === 0){
            this.clearStorage();
        } else {
            // 非首页刷新，读取session的数据 清空当前页及后续页
            this.tempParam = JSON.parse(window.sessionStorage.getItem("param"));
            this.setStatePromise({
                interactive: JSON.parse(window.sessionStorage.getItem("interactive")),
                // param       : JSON.parse(window.sessionStorage.getItem("param"))
            }).then((rs) => {
                if (index !== 4 ){
                    this.cleanAfterData(index - 1);
                }

            });
        }
    }
    // 清除storage数据，防止直接跳出时没有清理sessionstorage
    clearStorage(){
        window.sessionStorage.clear("param");
        window.sessionStorage.clear("interactive");
        this.setState({
            interactive : initInter(),
            param       : initParam(),
        });
    }

    componentWillMount(){
        this.isRefresh();
    }
    componentDidMount(){
        this.guideView();

    }
    render(){
        return (
            <div>
                <HeaderIndex
                    config = {this.state.basicConfig[0]}
                    interactive = {this.state.interactive[1]}
                ></HeaderIndex>
                <GuideView showIsNot={this.state.guideShow}/>
                {this.renderComponent()}
            </div>
        );
    }
}

renderApp({
    AppChild   : App,
    indexRoute : FundPoolType,
    route      : [
        {
            path      : "FundPoolType",
            component : FundPoolType,
        },
        {
            path      : "FundCompany",
            component : FundCompany,
        },
        {
            path      : "FundDetail",
            component : FundDetail,
        },
        {
            path      : "FundCIndex",
            component : FundCIndex,
        },
        {
            path      : "FundResult",
            component : FundResult,
        }
    ]
}, true);
