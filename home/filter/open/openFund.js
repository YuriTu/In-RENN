/**
 * Created by Lever on 16/7/27.
 */
/* nico~nico~ni~ 妮可保佑,永无bug    */
/** ——————基本组件引用———————— **/
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— **/
const ResultList = require("../components/resultList");
const OpenFundToggle = require("../components/openFundToggle");

const FundCompany = require("../box/box-fundCompany");
const FundAchieve = require("../box/box-openFundAchieve");
const FundScale = require("../box/box-fundScale");
const FundType = require("../box/box-fundType");

const FundOpenParam = require("../box/box-fundKama");
const FundRatings = require("../box/box-fundRatings");

const OpenTable = require("./openTable");

// 逻辑层
const CompanyFilter = require("../controller/common/company");
const COF = new CompanyFilter();
const AchieveFilter = require("../controller/open/openAchieve");
const AF = new AchieveFilter();
const ScaleFilter = require("../controller/common/scaleFilter");
const SF = new ScaleFilter();
const TypeFilter = require("../controller/open/openType");
const TF = new TypeFilter();

const RenderFilter = require("../controller/common/renderFilterResultList");
const Render = new RenderFilter();
// 开放四项筛选逻辑
const OpenFilter = require("../controller/open/openFilter");
// 基金一级类型
const OpenFundType = require("../controller/open/openFundType");
const OFT = new OpenFundType();
const OpenType = require("../box/box-fundOpenType");

// 删除逻辑
const Delete = require("../controller/common/delete");
const Clear = new Delete();
// 更新上下文
const UpdateContext = require("../controller/common/updateContext");
const UC = new UpdateContext();
// 请求相关
const Ajax = require("../controller/common/ajax");

const ajax = new Ajax();

require("../../../../css/common.scss");
let paramForSession;
class OpenFund extends Component{
    constructor(props){
        super(props);
        this.state = props.config[0];
        this.ParamForSave = props.config[1];
        this.ParamForAjax = props.config[2];
        this.basicConfig = props.config[3];
    }

    /**
     * 收起展开整个面板
     * @param {object} e event
     * @returns {null} null
     */
    toggleShowFilterList(e){
        e.preventDefault();
        const upHeight = this.state.showFilterList ? 160 : 400;
        this.refs.openTable.refs.dataTable.resizeZeroHeight(upHeight);
        this.setState({
            showFilterList: !this.state.showFilterList
        });
    }

    /**
     * 清除所有
     * @param {object} e event
     * @returns {null} null
     */
    handleClickClearAll(e){
        e.preventDefault();
        Clear.handleClickAny.call(this, 0);
        Clear.handleClickAny.call(this, 1);
        Clear.handleClickAny.call(this, 2);
        Clear.handleClickAny.call(this, 3);
        Clear.handleClickAny.call(this, 4);
        Clear.handleClickAny.call(this, 5);
        Clear.handleClickAny.call(this, 6);
        Clear.handleClickAny.call(this, 7);
        Clear.handleClickAny.call(this, 8);
        this.ParamForSave = paramForSession;
        OFT.handleClickOpenFundType.call(this, { index: 0, typeCode: "" });
        Render.renderFilterResultList.call(this);
    }

    /**
     * 切换开放式的筛选条件
     * @return {null} null
     */
    toggleShowOpenFundParamList(){
        const upHeight = this.state.showOpenFilterList ? 160 : 400;
        this.refs.openTable.refs.dataTable.resizeZeroHeight(upHeight);
        this.setState({
            showOpenFilterList: !this.state.showOpenFilterList
        });
    }

    /**
     * 开放式基金四项的选择
     * @param {string} name 对应展示项
     * @param {object} type 需要的数据
     * @return {null} null
     */
    handleClickOpenParam(name, type){
        switch (name){
            case "波动率:":{
                const Volatility = new OpenFilter(this.state.fundVolatilityParam);
                Volatility.handleClickOpenParam.call(this, type, name, 0, "noteVolatilityActiveItem");
            }
                break;
            case "夏普:":{
                const Shap = new OpenFilter(this.state.fundSharpParam);
                Shap.handleClickOpenParam.call(this, type, name, 1, "noteSharpActiveItem");
            }
                break;
            case "卡玛:":{
                const Kama = new OpenFilter(this.state.fundKamaParam);
                Kama.handleClickOpenParam.call(this, type, name, 1, "noteKamaActiveItem");
            }
                break;
            case "最大回撤:":{
                const Retracement = new OpenFilter(this.state.fundRetracementParam);
                Retracement.handleClickOpenParam.call(this, type, name, 0, "noteRetracementActiveItem");
            }
                break;
            case "评级:":{
                const Rating = new OpenFilter(this.state.fundRatingParam);
                const param = Rating.handleClickRatingsParam.call(this, type);
                this.setState({
                    fundRatingParam: param
                });
            }
        }
    }

    /**
     * 获取数据结果
     * @param {num} len length
     * @return {null} null
     */
    getDataLen(len){
        this.setState({
            dataLen: len
        });
    }
    saveParam(){
        // 保存排序方式
        this.ParamForAjax.sortDirForUnMount = this.state.ajaxParam.sortedDirection;
        this.ParamForAjax.sortForUnMount = this.state.ajaxParam.sortedBy;
        
        const state = [];
        state.push(this.state);
        state.push(this.ParamForSave);
        state.push(this.ParamForAjax);
        state.push(this.basicConfig);
        this.props.saveChildState(0, state);
    }

    componentWillMount(){
        paramForSession = this.ParamForSave;
        // 获得基金公司的各个选项
        COF.getFundCompanyName();
    }
    componentDidMount() {
        // 预加载保持状态
        Render.renderFilterResultList.call(this);
        // 保持事件处理函数更新
        UC.reRenderChildList.call(this);
        // this.refs.fundScale.refs.startSc.value = this.ParamForSave.scaleOptionData.startSc;
        // this.refs.fundScale.refs.endSc.value = this.ParamForSave.scaleOptionData.endSc;

    }
    componentWillUnmount(){
        // 保存用户状态
        this.saveParam();
    }

    render(){
        return (

            <div className="table-filter-container">
                <div className="filter-container">
                    <OpenType
                        openFundParam = {this.state.openFundParam}
                        openFundParamList = {this.state.openFundParamList}
                        changeOpenFundType = {OFT.handleClickOpenFundType.bind(this)}
                    ></OpenType>
                    <ResultList
                        ParamForPanel = {this.state.ParamForPanel}
                        handleClickClearAll = {this.handleClickClearAll.bind(this)}
                        toggleShowFilterList = {this.toggleShowFilterList.bind(this)}
                        showFilterList = {this.state.showFilterList}
                    ></ResultList>
                    <div className={`f-filterlist${this.state.showFilterList ? "" : " hide"}`}>
                        <FundCompany
                            config = {this.basicConfig.company}
                            fundCompanyParam = {this.state.fundCompanyParam}                            
                            handleCilck = {COF.handleCilckCompanyList.bind(this)}
                            handleClickAny={Clear.handleClickAny.bind(this)}
                        ></FundCompany>
                        <FundAchieve
                            ref = "fundAchieve"
                            config = {this.basicConfig.achieve}
                            fundAchieveParam = {this.state.fundAchieveParam}
                            handleCilck = {AF.handleClickAchieveList.bind(this)}
                            handleClickAny={Clear.handleClickAny.bind(this)}
                            warning = {this.state.warningAch}
                        ></FundAchieve>
                        <FundScale
                            ref = "fundScale"
                            config = {this.basicConfig.scale}
                            fundScaleParam = {this.state.fundScaleParam}
                            handleCilck = {SF.handleClickScale.bind(this)}
                            handleClickAny={Clear.handleClickAny.bind(this)}
                            handleShowOption = {SF.handleShowOption.bind(this)}
                            getStartSc = {SF.getStartSc.bind(this)}
                            getEndSc = {SF.getEndSc.bind(this)}
                            sendOptionalData = {SF.handleSendScaleOption.bind(this)}
                            warning = {this.state.warningSc}
                        ></FundScale>
                        <FundType

                            fundTypeParam = {this.state.fundTypeParam}
                            handleCilck = {TF.handleClickType.bind(this)}
                            handleClickAny={Clear.handleClickAny.bind(this)}
                        ></FundType>

                        <div className={`f-open${this.state.showOpenFilterList ? "" : " hide"}`}>
                            <FundOpenParam
                                ref = "fundVolatility"
                                fundOpenParam = {this.state.fundVolatilityParam}
                                handleCilck = {this.handleClickOpenParam.bind(this)}
                                handleClickAny={Clear.handleClickAny.bind(this, 4)}
                                openFundName = "波动率:"></FundOpenParam>
                            <FundOpenParam
                                ref = "fundSharp"
                                fundOpenParam = {this.state.fundSharpParam}
                                handleCilck = {this.handleClickOpenParam.bind(this)}
                                handleClickAny={Clear.handleClickAny.bind(this, 5)}
                                openFundName = "夏普:"></FundOpenParam>
                            <FundOpenParam
                                ref = "fundKama"
                                fundOpenParam = {this.state.fundKamaParam}
                                handleCilck = {this.handleClickOpenParam.bind(this)}
                                handleClickAny={Clear.handleClickAny.bind(this, 6)}
                                openFundName = "卡玛:"></FundOpenParam>
                            <FundOpenParam
                                ref = "fundRetracement"
                                fundOpenParam = {this.state.fundRetracementParam}
                                handleCilck = {this.handleClickOpenParam.bind(this)}
                                handleClickAny={Clear.handleClickAny.bind(this, 7)}
                                openFundName = "最大回撤:"></FundOpenParam>
                            <FundRatings
                                ref = "fundRating"
                                config = {this.basicConfig.ratingParam}
                                fundOpenParam = {this.state.fundRatingParam}
                                handleCilck = {this.handleClickOpenParam.bind(this)}
                                handleClickAny={Clear.handleClickAny.bind(this, 8)}
                                openFundName = "评级:"
                            ></FundRatings>
                        </div>
                        <OpenFundToggle
                            toggleShowOpenFundParamList = {this.toggleShowOpenFundParamList.bind(this)}
                            showOpenFundParamList = {this.state.showOpenFilterList}
                        ></OpenFundToggle>
                    </div>
                    <div className="f-resultPanel">根据筛选条件,共为您找到{this.state.dataLen}条结果</div>
                </div>
                <OpenTable ref="openTable" addCompare={this.props.addCompare} compareList={this.props.compareList} ajaxParam={this.state.ajaxParam} getDataLen={this.getDataLen.bind(this)} getParamUrl={this.props.getParamUrl}></OpenTable>
            </div>
        );
    }
}

module.exports = OpenFund;

