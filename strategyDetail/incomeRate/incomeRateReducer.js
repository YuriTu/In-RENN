/**
 * Created by Yuri on 16/11/15.
 */

const Service = require("../../common/service/service");

const S = new Service();
const _ = require("../../common/util/util");
const fid = _.getUrlParam("fid");

// 判断是否是--
const isNull = (data) => {
    return data === "--";
};
// --情况递归取前一天的值
const deleteNullValue = (data, index, prototype) => {
    if (!data[index][prototype]){
        return null;
    }
    let rs = data[index][prototype];
    if (isNull(rs)) {
        rs = data[index - 1][prototype];

        if (isNull(data[index - 1][prototype])) {
            rs = deleteNullValue(data, index - 1, prototype);
        }
    }
    return rs;
};
// 里面是收益，外面是净值
const formatChart = (data) => {
    const combination = {
        name        : "组合收益",
        xAxis       : [],
        yAxis       : [],
        yData       : [],
        yDataForstr : []
    };
    // 300001
    const hs300 = {
        name  : "沪深300",
        xAxis : [],
        yAxis : [],
        yData : [],
    };
    // 101003
    const zq = {
        name  : "债券型基金同类平均",
        xAxis : [],
        yAxis : [],
        yData : [],
    };
    // 102012
    const hb = {
        name  : "货币型基金同类平均",
        xAxis : [],
        yAxis : [],
        yData : [],
    };
    // 300007
    const zz = {
        name  : "中证全债指数",
        xAxis : [],
        yAxis : [],
        yData : [],
    };
    for (let i = 0;i < data.length;i++){

        const item = data[i];
        const index = i;
        combination.xAxis.push(item.date);
        combination.yAxis.push(item["combinationNav"]);
        combination.yData.push(item["combinationYiled"]);
        combination.yDataForstr.push(item.combinationNav);
        zq.yAxis.push(item["101003Nav"]);
        zq.yData.push(item["101003Yiled"]);
        hb.yAxis.push(item["102012Nav"]);
        hb.yData.push(item["102012Yiled"]);

        hs300.yAxis.push(deleteNullValue(data, index, "300001Nav"));
        hs300.yData.push(deleteNullValue(data, index, "300001Yiled"));
        zz.yAxis.push(deleteNullValue(data, index, "300007Nav"));
        zz.yData.push(deleteNullValue(data, index, "300007Yiled"));
    }
    zz.xAxis = hb.xAxis = zq.xAxis = hs300.xAxis = combination.xAxis;
    const rs = [combination, hs300, zq, hb, zz];
    const result = [];
    rs.forEach((item) => {
        if (item.yAxis[0]) {
            result.push(item);
        }
    });
    return result;
};

const generateIncomeRateState = (state = {}, action) => {
    const getList = (ajaxParam) => {
        
        return S.getYiledList(ajaxParam).then(data => {
            console.log(2, data);
            if (data.code === "0000"){
                console.log("修改yield之前", state);
                return {
                    ...state,
                    incomeRateData: {
                        chartData : formatChart(data.yieldRateList),
                        loading   : false,
                    }
                };
            }
        });
    };

    const param = {
        fid          : fid,
        uid          : USER_ID,
        month        : 1,
        compareCodes : "",
    };
    switch (action.type) {
        case "GET_NEW_TIME_RANGE_DATA":
            param.month = action.month;
            return getList(param);
        case "GET_NEW_COMPARING_LIST_DATA":
            param.month = action.month;
            param.compareCodes = action.compareCodes || 300001;
            return getList(param);
        case "GET_INCOMERATE_DATA":{
            return getList(param);
        }
        case "START_LOADING":{
            return {
                ...state,
                incomeRateData: {
                    ...state.incomeRateData,
                    loading: true,
                }
            };
        }
        default:
            return {
                ...state
            };
    }
};



module.exports = generateIncomeRateState;
