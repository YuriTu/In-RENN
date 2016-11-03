

module.exports = {
    renderList: {
        0 : ["fundName", "fundCompany", "fundType", "fundDetail", "fundCIndex", "mail"],
        1 : ["fundName", "fundCompany", "fundType", "fundDetail", "mail"]
    },
    leftNav: {
        config: {
            0: [
                {
                    name     : "基金池管理",
                    add      : "fundName",
                    distance : 10,
                },
                {
                    name     : "基金公司",
                    add      : "fundCompany",
                    distance : 141,
                },
                {
                    name     : "基金类型",
                    add      : "fundType",
                    distance : 433,
                },
                {
                    name     : "基金概况",
                    add      : "fundDetail",
                    distance : 613,
                },
                {
                    name     : "综合指标",
                    add      : "fundCIndex",
                    distance : 791,
                },
                {
                    name     : "订阅管理",
                    add      : "mail",
                    distance : 916,
                },
            ],
            1: [
                {
                    name     : "基金池管理",
                    add      : "fundName",
                    distance : 10,
                },
                {
                    name     : "基金公司",
                    add      : "fundCompany",
                    distance : 140,
                },
                {
                    name     : "基金类型",
                    add      : "fundType",
                    distance : 432,
                },
                {
                    name     : "基金概况",
                    add      : "fundDetail",
                    distance : 612,
                },
                {
                    name     : "订阅管理",
                    add      : "mail",
                    distance : 790,
                },
            ]
        }

    },
    fundCompany: {
        name   : "基金公司",
        config : [
            {
                name           : "管理规模:",
                code           : "scale",
                superParamList : [
                    {
                        name : "不限",
                        code : null
                    },
                    {
                        name : "50亿以上",
                        code : 50
                    },
                    {
                        name : "100亿以上",
                        code : 100
                    },
                    {
                        name : "200亿以上",
                        code : 200
                    },
                    {
                        name : "500亿以上",
                        code : 500
                    },
                    {
                        name : "1000亿以上",
                        code : 1000
                    },

                ],
                option: {
                    name      : "自定义规模: ",
                    linkWords : " - ",
                    endWords  : " 亿",
                }
            },
            {
                name           : "成立时间:",
                code           : "foundTime",
                superParamList : [
                    {
                        name : "不限",
                        code : null
                    },
                    {
                        name : "1年以上",
                        code : 1
                    },
                    {
                        name : "2年以上",
                        code : 2
                    },
                    {
                        name : "5年以上",
                        code : 5
                    },
                    {
                        name : "10年以上",
                        code : 10
                    },
                ],
                option: {
                    name      : "自定义时间: ",
                    linkWords : " - ",
                    endWords  : " 年",
                }
            },
            {
                name           : "基金经理:",
                code           : "managerCount",
                superParamList : [
                    {
                        name : "不限",
                        code : null
                    },
                    {
                        name : "5人以上",
                        code : 5
                    },
                    {
                        name : "10人以上",
                        code : 10
                    },
                    {
                        name : "20人以上",
                        code : 20
                    },
                    {
                        name : "30人以上",
                        code : 30
                    },
                ],
                option: {
                    name      : "自定义人数: ",
                    linkWords : " - ",
                    endWords  : " 人",
                }
            },
            {
                name           : "产品数量:",
                code           : "productCount",
                superParamList : [
                    {
                        name : "不限",
                        code : null
                    },
                    {
                        name : "10个以上",
                        code : 10
                    },
                    {
                        name : "20个以上",
                        code : 20
                    },
                    {
                        name : "50个以上",
                        code : 50
                    },
                    {
                        name : "100个以上",
                        code : 100
                    },
                ],
                option: {
                    name      : "自定义数量: ",
                    linkWords : " - ",
                    endWords  : " 个",
                }
            },
        ]
    },
    fundDetail: {
        name   : "基金概况",
        config : {
            0: [
                {
                    name           : "基金收益",
                    code           : "fundAchieve",
                    superParamList : [
                        {
                            name : "不限",
                            code : null,
                        },
                        {
                            name  : "近1个月",
                            code  : "m",
                            caret : true,
                        },
                        {
                            name  : "近3个月",
                            code  : "m3",
                            caret : true,
                        },
                        {
                            name  : "近6个月",
                            code  : "m6",
                            caret : true,
                        },
                        {
                            name  : "近一年",
                            code  : "y",
                            caret : true,
                        },
                        {
                            name  : "今年以来",
                            code  : "jn",
                            caret : true,
                        },
                        {
                            name  : "成立至今",
                            code  : "zj",
                            caret : true,
                        }
                    ],
                    childParamList: [
                        {
                            name : "前10名",
                            code : 10,
                        },
                        {
                            name : "前20名",
                            code : 20,
                        },
                        {
                            name : "前50名",
                            code : 50,
                        },
                    ],
                    option: {
                        name      : "收益率≥:",
                        hasSecond : false,
                        width     : "120px",
                        endWords  : " %",
                    }
                },
                {
                    name           : "基金规模",
                    code           : "fundScale",
                    superParamList : [
                        {
                            name : "不限",
                            code : null,
                        },
                        {
                            name : "2亿以上",
                            code : 2
                        },
                        {
                            name : "5亿以上",
                            code : 5
                        },
                        {
                            name : "10亿以上",
                            code : 10
                        },
                        {
                            name : "20亿以上",
                            code : 20
                        },
                        {
                            name : "50亿以上",
                            code : 50
                        },
                    ],
                    option: {
                        name      : "自定义规模: ",
                        linkWords : " - ",
                        endWords  : " 亿",
                    }
                },
            ],
            1: [
                {
                    name           : "基金收益",
                    code           : "fundAchieve",
                    superParamList : [
                        {
                            name : "不限",
                            code : null,
                        },
                        {
                            name  : "近1个月",
                            code  : "m",
                            caret : true,
                        },
                        {
                            name  : "近3个月",
                            code  : "m3",
                            caret : true,
                        },
                        {
                            name  : "近6个月",
                            code  : "m6",
                            caret : true,
                        },
                        {
                            name  : "近一年",
                            code  : "y",
                            caret : true,
                        },
                        {
                            name  : "今年以来",
                            code  : "jn",
                            caret : true,
                        },
                        {
                            name  : "成立至今",
                            code  : "zj",
                            caret : true,
                        }
                    ],
                    childParamList: [
                        {
                            name : "前10名",
                            code : 10,
                        },
                        {
                            name : "前20名",
                            code : 20,
                        },
                        {
                            name : "前50名",
                            code : 50,
                        },
                    ],
                    option: {
                        name      : "收益率≥:",
                        hasSecond : false,
                        width     : "120px",
                        endWords  : " %",
                    }
                },
                {
                    name           : "基金规模",
                    code           : "fundScale",
                    superParamList : [
                        {
                            name : "不限",
                            code : null,
                        },
                        {
                            name : "50亿以上",
                            code : 50
                        },
                        {
                            name : "100亿以上",
                            code : 100
                        },
                        {
                            name : "500亿以上",
                            code : 500
                        },
                        {
                            name : "1000亿以上",
                            code : 1000
                        },
                    ],
                    option: {
                        name      : "自定义规模: ",
                        linkWords : " - ",
                        endWords  : " 亿",
                    }
                },
            ]
        }
    },
    fundType: {
        0: [
            {
                name : "全部",
                code : "all",
            },
            {
                name : "债券型",
                code : 101003,
            },
            {
                name : "股票型",
                code : 101001,
            },
            {
                name : "混合型",
                code : 101002,
            },
            {
                name : "指数型",
                code : 1020023,
            },
            {
                name : "保本型",
                code : 102007,
            },
            {
                name : "QDII",
                code : 101005,
            },
        ],
        1: [
            {
                name : "全部",
                code : "all",
            },
            {
                name : "货币型",
                code : 101004,
            },
            {
                name : "短期型",
                code : 101006,
            },
        ]
    },
    fundCIndex: {
        name   : "综合指标",
        config : [
            {
                name           : "波动率:",
                code           : "volatility",
                superParamList : [
                    {
                        name : "不限",
                        code : "all"
                    },
                    {
                        name  : "近一年",
                        code  : "1year",
                        caret : true,
                    },
                    {
                        name  : "成立至今",
                        code  : "untilNow",
                        caret : true,
                    }
                ],
                childParamList: [
                    {
                        name : "前10名",
                        code : 10,
                    },
                    {
                        name : "前20名",
                        code : 20,
                    },
                    {
                        name : "前50名",
                        code : 50,
                    },
                    {
                        name : "前100名",
                        code : 100,
                    },
                ],
                option: {
                    name      : "波动率≤:",
                    hasSecond : false,
                    width     : "120px",
                    endWords  : " %",
                }
            },
            {
                name           : "夏普:",
                code           : "sharpe",
                superParamList : [
                    {
                        name : "不限",
                        code : "all"
                    },
                    {
                        name  : "近一年",
                        code  : "1year",
                        caret : true,
                    },
                    {
                        name  : "成立至今",
                        code  : "untilNow",
                        caret : true,
                    }
                ],
                childParamList: [
                    {
                        name : "前10名",
                        code : 10,
                    },
                    {
                        name : "前20名",
                        code : 20,
                    },
                    {
                        name : "前50名",
                        code : 50,
                    },
                    {
                        name : "前100名",
                        code : 100,
                    },
                ],
                option: {
                    name      : "夏普≥:",
                    hasSecond : false,
                    width     : "120px",
                    endWords  : "",
                }
            },
            {
                name           : "卡玛:",
                code           : "karma",
                superParamList : [
                    {
                        name : "不限",
                        code : "all"
                    },
                    {
                        name  : "近一年",
                        code  : "1year",
                        caret : true,
                    },
                    {
                        name  : "成立至今",
                        code  : "untilNow",
                        caret : true,
                    }
                ],
                childParamList: [
                    {
                        name : "前10名",
                        code : 10,
                    },
                    {
                        name : "前20名",
                        code : 20,
                    },
                    {
                        name : "前50名",
                        code : 50,
                    },
                    {
                        name : "前100名",
                        code : 100,
                    },
                ],
                option: {
                    name      : "卡玛≥:",
                    hasSecond : false,
                    width     : "120px",
                    endWords  : "",
                }
            },
            {
                name           : "最大回撤:",
                code           : "drawdown",
                superParamList : [
                    {
                        name : "不限",
                        code : "all"
                    },
                    {
                        name  : "近一年",
                        code  : "1year",
                        caret : true,
                    },
                    {
                        name  : "成立至今",
                        code  : "untilNow",
                        caret : true,
                    }
                ],
                childParamList: [
                    {
                        name : "前10名",
                        code : 10,
                    },
                    {
                        name : "前20名",
                        code : 20,
                    },
                    {
                        name : "前50名",
                        code : 50,
                    },
                    {
                        name : "前100名",
                        code : 100,
                    },
                ],
                option: {
                    name      : "最大回撤≤:",
                    hasSecond : false,
                    width     : "120px",
                    endWords  : " %",
                }
            }
        ]
    },
    mail: {}

};
