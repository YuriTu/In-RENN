/**
 * 首页筛选逻辑层
 * 
 * 清楚选项与删除
 */

const RenderFilter = require("./renderFilterResultList");
const Render = new RenderFilter();

let that;
export class Delete{
    constructor(){
        that = this;
    }
    handleClickAny(type){
        switch (type){
            case 0:{
                // 1.高亮 2. 收回二级面板  3.消失普通高亮选项
                this.setState({
                    fundCompanyParam: {
                        isAny       : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem  : -1, // 被点击的公司字母
                        companyData : [],
                    }
                });
                // 4. 筛选面板对应选择结果消失 5.对应参数归空 —— 同等于点击了 对应选项的X
                Render.deleteThisFilterListItem.call(this, 0);
            }
                break;
            case 1:{
                // 1.高亮 2. 收回二级面板  3.消失普通高亮选项
                this.setState({
                    fundAchieveParam: {
                        isAny        : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem   : -1, // 被点击的公司字母
                        achieveData  : [],
                        showOption   : false,
                        activeOption : false
                    },
                    noteAchieveChildItem: {},
                });

                this.ParamForSave.achieve = [];
                // 删除业绩排序
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.achieveSortList);
                
                Render.deleteThisFilterListItem.call(this, 1);
            }
                break;
            case 2:{
                // 1.高亮 2. 收回二级面板  3.消失普通高亮选项
                this.setState({
                    fundScaleParam: {
                        isAny        : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem   : -1, // 被点击的公司字母
                        showOption   : false,
                        activeOption : false
                    },
                    warningSc: {// 警告提示参数
                        start : false,
                        end   : false,
                    },
                });
                
                Render.deleteThisFilterListItem.call(this, 2);
            }
                break;
            case 3:{
                // 1.高亮 2. 收回二级面板  3.消失普通高亮选项
                const param = this.state.fundTypeParam;
                param.isAny = true;
                param.activeItem = -1;
                this.setState({
                    fundTypeParam: param
                });
                Render.deleteThisFilterListItem.call(this, 3);
            }
                break;
            // 波动
            case 4:{
                this.setState({
                    fundVolatilityParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        childData  : [],
                        showChild  : false,
                        id         : 0,
                    },
                    noteVolatilityActiveItem: {
                        "year"     : -1,
                        "untilNow" : -1
                    },
                });
                this.ParamForSave.volatilityParam = that.clickOpenAny.call(this, this.ParamForSave.volatilityParam);
                // 删除业绩排序
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.voSortList);
                Render.deleteThisFilterListItem.call(this, 9);
            }
                break;
            // 夏普
            case 5:{
                this.setState({
                    fundSharpParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        childData  : [],
                        showChild  : false,
                        id         : 1,
                    },
                    noteSharpActiveItem: {
                        "year"     : -1,
                        "untilNow" : -1
                    },
                });
                this.ParamForSave.sharpParam = that.clickOpenAny.call(this, this.ParamForSave.sharpParam);
                // 删除业绩排序
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.shSortList);
                Render.deleteThisFilterListItem.call(this, 9);
            }
                break;
            // 卡玛
            case 6:{
                this.setState({
                    fundKamaParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        childData  : [],
                        showChild  : false,
                        id         : 2,
                    },
                    noteKamaActiveItem: {
                        "year"     : -1,
                        "untilNow" : -1
                    },
                });
                this.ParamForSave.kamaParam = that.clickOpenAny.call(this, this.ParamForSave.kamaParam);
                // 删除业绩排序
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.kaSortList);
                Render.deleteThisFilterListItem.call(this, 9);
            }
                break;
            // 最大回撤
            case 7:{
                this.setState({
                    fundRetracementParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        childData  : [],
                        showChild  : false,
                        id         : 3,
                    },
                    noteRetracementActiveItem: {
                        "year"     : -1,
                        "untilNow" : -1
                    },
                });
                this.ParamForSave.retracementParam = that.clickOpenAny.call(this, this.ParamForSave.retracementParam);
                // 删除业绩排序
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.reSortList);
                Render.deleteThisFilterListItem.call(this, 9);
            }
                break;
            // 评级
            case 8:{
                this.setState({
                    fundRatingParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        childData  : [],
                        showChild  : false,
                        id         : 4,
                    },
                    noteRatingActiveItem: {
                        "海通评级" : [],
                        "招商评级" : [],
                        "上证评级" : [],
                        "济安评级" : [],
                    },
                });
                this.ParamForSave.ratingParam = that.clickRatingAny.call(this, this.ParamForSave.ratingParam);
                this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.ratingSortList);
                Render.deleteThisFilterListItem.call(this, 9);
            }
                break;
        }
    }

    clickOpenAny(saveParam){
        saveParam = {
            forAjax: {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            },
            forRender: [],
        };
        return saveParam;
    }
    clickRatingAny(saveParam){
        saveParam = {
            forAjax: {
                haitong    : [],
                zhaoshang  : [],
                shangzheng : [],
                jian       : [],
            },
            forRender: {
                "海通评级" : [],
                "招商评级" : [],
                "上证评级" : [],
                "济安评级" : [],
            },
        };
        return saveParam;
    }
}

module.exports = Delete;
