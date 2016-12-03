/**
 * 首页筛选逻辑层
 *
 * 路由切换后更新已经被渲染的组件的事件处理函数以规避setState on unmounted component 错误
 *
 */

const RenderFilter = require("../common/renderFilterResultList");
const Render = new RenderFilter();


// 开放四项筛选逻辑
const OpenFilter = require("../open/openFilter");

const AchieveFilter = require("../open/openAchieve");
const AF = new AchieveFilter();

const CompanyFilter = require("../common/company");
const COF = new CompanyFilter();

let that;
export class UpdateContext{
    constructor(){
        that = this;
    }
    // 更换路由后更新this
    reRenderChildList(){
        that.reRenderCompanyParam.call(this);
        that.reRenderAchieveParam.call(this);
        that.reRenderOpenParam.call(this, "fundVolatilityParam", "波动率:", 0, "noteVolatilityActiveItem");
        that.reRenderOpenParam.call(this, "fundSharpParam", "夏普:", 1, "noteSharpActiveItem");
        that.reRenderOpenParam.call(this, "fundKamaParam", "卡玛:", 1, "noteKamaActiveItem");
        that.reRenderOpenParam.call(this, "fundRetracementParam", "最大回撤:", 0, "noteRetracementActiveItem");
        that.reRenderRating.call(this);
    }
    reRenderMonChildList(){
        that.reRenderCompanyParam.call(this);
        that.reRenderAchieveParam.call(this);
    }
    reRenderRating(){
        if (this.state.fundRatingParam.activeItemName !== ""){
            const Rating = new OpenFilter(this.state.fundRatingParam);
            const param = {
                code : this.state.fundRatingParam.activeItem,
                name : this.state.fundRatingParam.activeItemName,
            };

            this.setState({
                fundRatingParam: Rating.renderRatingList.call(this, param)
            });
        }
    }
    reRenderOpenParam(stateName, panelName, symbol, noteName){
        if (this.state[stateName].activeItem !== -1){
            const Open = new OpenFilter();
            const param = this.state[stateName].param;
            Open.renderOpenParamList.call(this, param, panelName, symbol, noteName);
        }
    }
    reRenderAchieveParam(){
        if (this.state.fundAchieveParam.activeItem !== -1){
            const param = this.state.fundAchieveParam.param;
            AF.renderAchieveList.call(this, param);
        }
    }
    reRenderCompanyParam(){
        const param = this.state.fundCompanyParam.activeItem;
        if (param !== -1){
            COF.handleCilckCompanyList.call(this, param);
        }
    }
}

module.exports = UpdateContext;
