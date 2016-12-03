const React = require("react");

let ParamForSave;
export class Ajax{


    /**
     *  /filter/web/sc 筛选页面接口
     *  @uid int 用户id
     *  @page number当前页面
     *  @pageSize number分页数量
     *  @sortedBy number 按字段排序： 月收益率：1、波动率：2、基金规模：3
     *      @wanpernav      (1  , "万份收益"   )
     *      @yield7day      (2  , "七日年化"   )
     *      @yield28day     (3  , "28日年化"   )
     *      @yieldMoth1     (4  , "近1月收益"  )
     *      @yieldMoth3     (5  , "近3月收益"  )
     *      @yieldMoth12    (6  , "近1年收益"  )
     *      @establishment  (7  , "成立至今"   )
     *  @sortedDirection number 倒序：1、正序：0
     *
     *  @rank number  排行前（10，20，50，100）名
     *  @companyCodes string 基金公司代码
     *  @yieldRanks: string  近（1周，1月，3月，1年）收益排行 ；如：w,m,m3,y
     *  @currencyType: number // 货其类型 (1,2,3)如     A类： 1， 其他类型：2，B类: 3
     *  @scaleType:number //基金规模 (1,2,3,4,5)如   少于100亿：1，100～200：2， 200～500：3，500~1000： 4， 大于1000亿: 5
     *  默认按照7日年化从高到低排序
     */

    setParamForAjax(data){
        ParamForSave = data;
        const param = this.init();
        this.setCompanyParamForAjax(param);
        this.setAchieveParamForAjax(param);
        
        this.setTypeParamForAjax(param);
        this.setSuperTypeParamForAjax(param);
        this.setOpenFundTypeParamForAjax(param);
        this.setAchieveOptionParamForAjax(param);

        if (typeof ParamForSave.scale === "number"){
            this.setScaleParamForAjax(param);
        } else {
            this.setScaleOptionParamForAjax(param);
        }
        
        this.setOpenParamForAjax(param);
        this.setRatingParamForAjax(param);
        param.page = 1;// 防止页数记录导致新选项的不出现
        // 在默认情况下读取传参的id值,在指定后的情况下,使用指定值
        
        param.sortedBy = this.defineSortBy(data);
        param.sortedDirection = this.defineSortDir([11, 12, 17, 18], param.sortedBy);
        return param;
    }


    /**
     * 创建新对象
     * @returns {Param} 生成的
     */
    init(){
        const param = new Object();
        param.uid = window.localStorage.getItem("uid"),
        param.page = 1,
        param.pageSize = 20,
        param.sortedBy = 2,
        param.sortedDirection = 1,

        param.yieldScope = [],
        param.ranks = "", // 业绩收益排行 100名
        param.companyCodes = "",
        param.yieldRanks = "", // 业绩收益排行 日期
        param.currencyType = null, // 货基类型
        param.scaleType = null, // 基金规模

        param.yield7Date = "", // 业绩自定义日期
        param.yield7sg = "", // 业绩自定义最大值
        param.yield7sl = "", // 业绩自定义最小值

        param.sg = "", // 自定义基金规模 最小值
        param.st = "", // 自定义基金规模最大值

        param.volatility = "",
        param.fundGrade = [],
        param.fundType = "";
        param.bond_subFundType = "";

        return param;
    }
    // 传入参数为 ParamForSave
    defineSortBy(param){
        let rs = param.defaultSort;
        const length = param.sortList.length;
        if (length > 0){
            rs = param.sortList[length - 1];
        }
        return rs;
    }
    defineSortDir(arr, sort){


        let rs = 1;
        arr.forEach( (item) => {

            if (sort === item){

                rs = 0;
            }
        });

        return rs;
    }


    setCompanyParamForAjax(param){
        param.companyCodes = ParamForSave.company.code.join(",");
    }
    setAchieveParamForAjax(param){

        const trueParam = JSON.stringify(ParamForSave.achieveParam);
        param.yieldScope = trueParam;
    }
    setScaleParamForAjax(param){
        param.scaleType = ParamForSave.scale;
        param.sg = "";// 至空排斥选项
        param.st = "";
    }
    setTypeParamForAjax(param){
        param.currencyType = ParamForSave.type.code;
    }
    setSuperTypeParamForAjax(param){
        param.fundType = ParamForSave.fundType.superParamArr.join(",");

        if (window.location.href.indexOf("monetary") >= 0){
            if (ParamForSave.fundType.superParamArr.length === 0) {
                param.fundType = "both";
            }
        }

    }
    setOpenFundTypeParamForAjax(param){
        param.bond_subFundType = ParamForSave.fundType.childBondParamArr.join(",");
    }

    setOpenParamForAjax(param){
        param.volatility = JSON.stringify(ParamForSave.volatilityParam.forAjax);
        param.sharpe = JSON.stringify(ParamForSave.sharpParam.forAjax);
        param.karma = JSON.stringify(ParamForSave.kamaParam.forAjax);
        param.drawdown = JSON.stringify(ParamForSave.retracementParam.forAjax);
    }
    setRatingParamForAjax(param){
        // 数组改对象...先留着万一又双叒叕改了呢~
        // const tempArr = [];
        // for (const x in ParamForSave.ratingParam.forAjax){
        //     const pa = {};
        //     pa[x] = ParamForSave.ratingParam.forAjax[x].join(",");
        //     tempArr.push(pa);
        // }
        // param.fundGrade = JSON.stringify(tempArr);
        // 传参改为字符串形式
        // ParamForSave.ratingParam.forAjax[superParam.code] = saveParam.forAjax[superParam.code].join(",")
        const be = {};
        for (const x in ParamForSave.ratingParam.forAjax){
            // 深复制
            be[x] = ParamForSave.ratingParam.forAjax[x];
            if (be[x].length === 0){
                be[x] = be[x].toString();
            } else {
                be[x] = be[x].join(",");
            }
        }
        param.fundGrade = JSON.stringify(be);
    }
    setAchieveOptionParamForAjax(param){
        if (!!ParamForSave.achieveOption && !!ParamForSave.achieveOption.resultForAjax && !!ParamForSave.achieveOption.resultForAjax.yield7Date){

            param.yield7Date = ParamForSave.achieveOption.resultForAjax.yield7Date;
            param.yield7sg = ParamForSave.achieveOption.resultForAjax.yield7sg;
            param.yield7sl = ParamForSave.achieveOption.resultForAjax.yield7sl;
        } else {
            param.yield7Date = "";
            param.yield7sg = "";
            param.yield7sl = "";
        }
    }
    setScaleOptionParamForAjax(param){
        if (!!ParamForSave.scale && !!ParamForSave.scale.resultForAjax){
            param.sg = ParamForSave.scale.resultForAjax.sg;
            param.st = ParamForSave.scale.resultForAjax.st;
            param.scaleType = "";// 至空排斥选项
        } else {
            param.scaleType = "";// 至空排斥选项
            param.sg = "";// 至空排斥选项
            param.st = "";
        }
    }
    defineMonetaryFundType(data){
        let rs = "";
        try {
            rs = data.monetaryFundType;
        } catch (error){

        }
        
        
        return rs;
    }
}

module.exports = Ajax;
