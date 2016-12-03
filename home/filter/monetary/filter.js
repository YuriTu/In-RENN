/**
 * Author : yujia.guo Yuri
 *
 * Created by renren on 16/6/2.
 *
 * Component -- filter (基金行情页筛选组件)
 */
/* nico~nico~ni~ 妮可保佑,永无bug */
/** ——————基本组件引用———————— **/
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— **/
const ResultList = require("../components/resultList");

const FundCompany = require("../box/box-fundCompany");
const FundAchieve = require("../box/box-openFundAchieve");
const FundScale = require("../box/box-fundScale");
const FundType = require("../box/box-fundType");
const MonetaryTable = require("./monetaryTable");


// 逻辑层
const CompanyFilter = require("../controller/common/company");
const COF = new CompanyFilter();
const AchieveFilter = require("../controller/open/openAchieve");
const AF = new AchieveFilter();
const ScaleFilter = require("../controller/common/scaleFilter");
const SF = new ScaleFilter();
const TypeFilter = require("../controller/monetary/monetaryType");
const TF = new TypeFilter();


const RenderFilter = require("../controller/common/renderFilterResultList");
const Render = new RenderFilter();

// 删除逻辑
const Delete = require("../controller/common/delete");
const Clear = new Delete();

// 更新上下文
const UpdateContext = require("../controller/common/updateContext");
const UC = new UpdateContext();

// 基金一级类型
const FirstGradeType = require("../box/box-fundOpenType");
const FirstGradeFundType = require("../controller/open/openFundType");
const FGFT = new FirstGradeFundType();

require("./filter.scss");

let paramForSession;

class Filter extends Component{
    constructor(props){
        super(props);
        this.state = props.config[0];
        this.ParamForSave = props.config[1];
        this.ParamForAjax = props.config[2];
        this.basicConfig = props.config[3];
    }
    toggleShowFilterList(e){
        e.preventDefault();
        const upHeight = this.state.showFilterList ? 160 : 400;
        this.refs.monetaryTable.refs.dataTable.resizeZeroHeight(upHeight);
        this.setState({
            showFilterList: !this.state.showFilterList
        });
    }
    // TODO: clearAll 的效果 所有选项的click any
    handleClickClearAll(e){
        e.preventDefault();
        Clear.handleClickAny.call(this, 0);
        Clear.handleClickAny.call(this, 1);
        Clear.handleClickAny.call(this, 2);
        Clear.handleClickAny.call(this, 3);
        this.ParamForSave = paramForSession;
        FGFT.handleClickOpenFundType.call(this, { index: 0, typeCode: "" });
        Render.renderFilterResultList.call(this);
    }

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
        this.props.saveChildState(1, state);
    }
    componentWillMount(){
        paramForSession = this.ParamForSave;
        COF.getFundCompanyName();
    }
    componentDidMount(){
        Render.renderFilterResultList.call(this);
        UC.reRenderMonChildList.call(this);
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
                    <FirstGradeType
                        openFundParam = {this.state.openFundParam}
                        openFundParamList = {this.state.firstGradeFundParamList}
                        changeOpenFundType = {FGFT.handleClickMonetaryFundType.bind(this)}
                    ></FirstGradeType>
                    <ResultList
                        ParamForPanel = {this.state.ParamForPanel}
                        handleClickClearAll = {this.handleClickClearAll.bind(this)}
                        toggleShowFilterList = {this.toggleShowFilterList.bind(this)}
                        showFilterList = {this.state.showFilterList}
                    ></ResultList>

                    <div className={`f-filterlist${( this.state.showFilterList ? " " : " hide")}`}>
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
                    </div>
                    <div className="f-resultPanel">根据筛选条件,共为您找到{this.state.dataLen}条结果</div>
                </div>
                <MonetaryTable ref="monetaryTable" addCompare={this.props.addCompare} compareList={this.props.compareList} ajaxParam={this.state.ajaxParam} getDataLen={this.getDataLen.bind(this)} getParamUrl={this.props.getParamUrl}></MonetaryTable>
            </div>
        );
    }
}


module.exports = Filter;
