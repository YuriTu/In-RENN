/**
 * Created by Yuri on 17/06/05.
 */
// 请求所得数据
const requestReducer = require("./request");
// 用户填写，预请求数据
const changeFormReducer = require("./form");
// 页面组价控制 （待优化）
const controlFormReducer = require("./control");

module.exports = (state, action) => {
    return {

        request : requestReducer(state.request, action),
        form    : changeFormReducer(state.form, action),
        control : controlFormReducer(state.control, action)
    };
};