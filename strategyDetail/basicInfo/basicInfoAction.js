/**
 * Created by Yuri on 16/11/14.
 */
const GET_BASICINFO_DATA = require("../constant").GET_BASICINFO_DATA;

const getBasicInfoData = data => {
    return {
        type          : GET_BASICINFO_DATA,
        basicInfoData : data,
    };
};

module.exports = {
    getBasicInfoData
};