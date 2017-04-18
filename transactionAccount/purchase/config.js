module.exports = {
    guangfa: {
        name         : "广发基金",
        nameEn       : "guangfa",
        info         : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
        affirmTitle  : "确认申购",
        basicSuccess : "您已成功提交12000份基金A赎回操作。预计T+1日17：00前，基金金额将赎回至指定账户个别银行可能存在延迟，具体以银行到账时间为准",
        list         : [{
            index : 0,
            label : "基金名称",
            input : {
                className : "anti-change-input",
                hasBtn    : false,
                disabled  : true,
                value     : "",
            },
        }, {
            index : 1,
            label : "基金购买金额",
            input : {
                className   : "amount-value-input",
                hasBtn      : false,
                warningText : "*请输入正确的购买金额",
                value       : "",
            },
        }, {
            index : 2,
            label : "大写金额",
            text  : "",
        }, {
            index  : 4,
            label  : "支付银行",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test1"],
            }
        }, {
            index  : 5,
            label  : "经办人",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test1"],
            },
        }]
    },
    yinhua: {
        name         : "银华基金",
        nameEn       : "yinhua",
        info         : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
        affirmTitle  : "确认申购",
        basicSuccess : "您已成功提交12000份基金A赎回操作。预计T+1日17：00前，基金金额将赎回至指定账户个别银行可能存在延迟，具体以银行到账时间为准",
        list         : [{
            index : 0,
            label : "基金名称",
            input : {
                className : "anti-change-input",
                hasBtn    : false,
            },
        }, {
            index : 1,
            label : "基金购买金额",
            input : {
                className   : "amount-value-input",
                hasBtn      : false,
                warningText : "*请输入正确的赎回金额",
            },
        }, {
            index : 3,
            label : "大写金额"
        }, {
            index  : 4,
            label  : "支付银行",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test1"],
            }
        }, {
            index  : 5,
            label  : "经办人",
            option : {
                index : 0,
                cur   : "test",
                list  : ["test1"],
            },
        }]
    }
};