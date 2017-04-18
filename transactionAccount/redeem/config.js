// 赎回配置
module.exports = {
    guangfa: {
        name           : "广发",
        nameEn         : "guangfa",
        info           : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
        affirmTitle    : "确认赎回",
        canQuickRedeem : ["000509", "270014", "270004"],
        isDisableBtn   : false,
        list           : [{
            index  : 0,
            label  : "选择基金",
            option : {
                index : 0,
                cur   : "", // 默认基金显示
                list  : [], //后端返回的基金列表
            },
        }, {
            index : 1,
            label : "可用份额",
            text  : ""// 后端返回,
        }, {
            index : 2,
            label : "赎回份额",
            input : {
                className   : "check-box-container",
                hasBtn      : true,
                btnText     : "全部",
                warningText : "*请输入正确的赎回份额"
            }
        }, {
            index : 3,
            label : "赎回份额大写",
        }, {
            index  : 4,
            label  : "赎回方式",
            option : {
                index      : 0,
                cur        : "普通赎回", // 默认基金显示
                list       : ["普通赎回", "快速赎回"], // 后端返回的基金列表
                isDisabled : false,
            },
        }, {
            index  : 5,
            label  : "收款账户",
            option : {
                index : 0,
                cur   : "",
                list  : [],
            },
        }, {
            index  : 6,
            label  : "经办人",
            option : {
                index : 0,
                cur   : "",
                list  : [],
            },
        }]
    },
    yinhua: {
        name         : "银华",
        nameEn       : "yinhua",
        info         : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
        affirmTitle  : "确认赎回",
        basicSuccess : "您已成功提交12000份基金A赎回操作。预计T+1日17：00前，基金金额将赎回至指定账户个别银行可能存在延迟，具体以银行到账时间为准",
        param        : {
            fundName    : "",
            fundCode    : null,
            type        : 1,
            thirdPartId : null,
            amount      : null,
        },
        list: [{
            index  : 0,
            label  : "选择基金",
            option : {
                index : 0,
                cur   : "test", // 默认基金显示
                list  : ["test1"], //后端返回的基金列表
            },
        }, {
            index : 1,
            label : "可用份额",
            text  : "test"// 后端返回,
        }, {
            index : 2,
            label : "赎回份额",
            input : {
                className   : "check-box-container",
                hasBtn      : true,
                btnText     : "全部",
                showWarning : false,
                warningText : "*请输入正确的赎回份额",
            }
        }, {
            index : 3,
            label : "赎回份额大写",
            text  : "",
        }, {
            // index : 4,
            // label : "快速赎回",
            // option : {
            //     index : 0,
            //     cur   : "快速赎回", // 默认基金显示
            //     list  : ["快速赎回","普通赎回"], //后端返回的基金列表
            // },
        }, {
            index  : 5,
            label  : "收款账户",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test"],
            },
        }, {
            index  : 6,
            label  : "经办人",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test1"],
            },
        }]
    },


};