/**
 * 基金池交互 与 请求参数参数
 */


module.exports = [
    // 请求参数

    {
        cache: {
            fundPoolName : "",
            mailAddr     : "",
            noticeTime   : "",
            noticeType   : "",
            userId       : "",
            fundType     : {
                superFundType : "",
                firstFundType : "",
            },
            fundCompany: {
            },
        },
    },
    // 交互参数
    {
        header: {
            type   : 0,
            active : 0,
        },

        fundChildTypeParam: {
            active : -1,
            result : [
                {
                    index : 0,
                    code  : "",
                    name  : "all"
                }
            ],
        },
        fundCompany: {
            scale: {
                activeItem : null,
                min        : null,
                max        : null,
            },
            // 成立时间
            foundTime:
            {
                activeItem : null,
                min        : null,
                max        : null,
            },
            // 基金经理人数
            managerCount:
            {
                activeItem : null,
                min        : null,
                max        : null,
            },
            // 发行产品数量
            productCount:
            {
                activeItem : null,
                min        : null,
                max        : null,
            }
        },
        fundDetail: {
            fundAchieve: {
                superParamActiveItem : null,
                // null可以关闭子选项
                childActive          : {
                    "m"  : null,
                    "m3" : null,
                    "m6" : null,
                    "y"  : null,
                    "jn" : null,
                    "zj" : null,
                },
                showChild : false,
                min       : {
                    "m"  : null,
                    "m3" : null,
                    "m6" : null,
                    "y"  : null,
                    "jn" : null,
                    "zj" : null,
                },
            },
            fundScale: {
                activeItem : null,
                min        : null,
                max        : null,
            }
        },
        fundCIndex: {
            volatility: {
                all: {
                    active: true
                },
                "1year": {
                    active : false,
                    child  : null,
                },
                "untilNow": {
                    active : false,
                    child  : null,
                },
                showChild     : false,
                currentActive : "all"

            },
            sharpe: {
                all: {
                    active: true
                },
                "1year": {
                    active : false,
                    child  : 0,
                },
                "untilNow": {
                    active : false,
                    child  : 0,
                },
                showChild: false,

                currentActive: "all"
            },
            karma: {
                all: {
                    active: true
                },
                "1year": {
                    active : false,
                    child  : 0,
                },
                "untilNow": {
                    active : false,
                    child  : 0,
                },
                showChild: false,

                currentActive: "all"
            },
            drawdown: {
                all: {
                    active: true
                },
                "1year": {
                    active : false,
                    child  : 0,
                },
                "untilNow": {
                    active : false,
                    child  : 0,
                },
                showChild: false,

                currentActive: "all"
            }

        },
        fundResult: {},


    }
];
