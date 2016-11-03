module.exports = [
    {

    },
    {
        info: {
            fundPoolName : "",
            poolId       : ""
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
        fundType: {
            result: [{ index: "", code: "all" }],
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
                showChild: false,

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
            }

        },
    }
];
