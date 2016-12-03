/**
 * Created by Yuri on 16/11/14.
 */
const GET_INCOMERATE_DATA = require("../constant").GET_INCOMERATE_DATA;

const GET_NEW_TIME_RANGE_DATA = require("../constant").GET_NEW_COMPARING_LIST_DATA;

const GET_NEW_COMPARING_LIST_DATA = require("../constant").GET_NEW_COMPARING_LIST_DATA;
const getIncomeData = data => {
    return {
        type           : GET_INCOMERATE_DATA,
        incomeRateData : data,
    };
};

const changeTimeRange = data => {
    return {
        type  : GET_NEW_TIME_RANGE_DATA,
        month : data,

    };
};

const changeComparingList = (data, index) => {
    return {
        type         : GET_NEW_COMPARING_LIST_DATA,
        compareCodes : data,
        month        : index
    };
};
const startLoading = () => {

    return {
        type: "START_LOADING",
    };
};

module.exports = {
    getIncomeData,
    changeTimeRange,
    changeComparingList,
    startLoading

};