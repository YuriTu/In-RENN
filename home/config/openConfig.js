/**
 * Created by Yuri on 16/08/17.
 */

module.exports = [
    {
        dataLen          : 0,
        // 给予筛选面板的参数 表.表
        ParamForPanel    : null,
        // 筛选面板的展示
        showFilterList   : true,
        fundCompanyParam : {
            // 不限 是否被点击 ——是否展示二级页面
            isAny       : true,
            // 被点击的公司字母
            activeItem  : -1,
            // 二级页面jsx数据
            companyData : [],
        },
        // 是否有公司项目被选中
        noteCompanyActiveItem : {},
        fundAchieveParam      : {
            // 不限 是否被点击 ——是否展示二级页面
            isAny       : true,
            // 被点击的日期
            activeItem  : -1,
            // 二级页面jsx
            achieveData : [],

            showOption   : false,
            // 是否展示二级页面
            showChild    : false,
            // 是否高亮自定义
            activeOption : false,
            warning      : false,
            param        : {},
        },
        // 是否有业绩项目被选中
        // 记录二级菜单的高亮列表
        noteAchieveChildItem : {},
        fundScaleParam       : {
            // 不限 是否被点击 ——是否展示二级页面
            isAny        : true,
            // 被点击的金额
            activeItem   : -1,
            showOption   : false,
            // 是否高亮自定义
            activeOption : false,

        },
        fundTypeParam: {
            isAny      : true,
            activeItem : -1,
            item       : [{
                name : "长期纯债",
                code : 102008
            }, {
                name : "中短期纯债型",
                code : 102009
            }, {
                name : "混合债券型(一级)",
                code : 102010
            }, {
                name : "混合债券型(二级)",
                code : 102011
            }, {
                name : "可转债",
                code : 105012
            }, {
                name : "定期开放型",
                code : 105016
            }],
            show : true,
            name : "债基类型"
        },
        activeCompany : "",
        activeAchieve : "",

        // 警告提示参数
        warningSc: {
            start : false,
            end   : false,
        },
        showOpenFilterList : false,
        openFundParam      : [{
            index    : 0,
            typeCode : ""
        }],
        openFundParamList: [
            {
                name     : "全部",
                typeCode : "",
            },
            {
                name     : "债券型",
                typeCode : 101003,
            },
            {
                name     : "股票型",
                typeCode : 101001,
            },
            {
                name     : "混合型",
                typeCode : 101002,
            },
            {
                name     : "指数型",
                typeCode : 1020023,
            },
            {
                name     : "保本型",
                typeCode : 102007,
            },
            {
                name     : "QDII",
                typeCode : 101005,
            },

        ],
        // 开放式基金新参数
        // 波动
        fundVolatilityParam: {
            isAny      : true,
            activeItem : -1,
            childData  : [],
            showChild  : false,
            id         : 0,
            warning    : false,
            param      : {},
        },
        // 夏普
        fundSharpParam: {
            isAny      : true,
            activeItem : -1,
            childData  : [],
            showChild  : false,
            id         : 1,
            warning    : false,
            param      : {},
        },
        // 卡玛
        fundKamaParam: {
            isAny      : true,
            activeItem : -1,
            childData  : [],
            showChild  : false,
            id         : 2,
            warning    : false,
            param      : {},
        },
        // 最大回撤
        fundRetracementParam: {
            isAny      : true,
            activeItem : -1,
            childData  : [],
            showChild  : false,
            id         : 3,
            warning    : false,
            param      : {},
        },
        // 评级
        fundRatingParam: {
            isAny          : true,
            activeItem     : -1,
            activeItemName : "",
            childData      : [],
            showChild      : false,
            id             : 4,
        },
        noteVolatilityActiveItem: {
            "year"     : -1,
            "untilNow" : -1
        },
        noteSharpActiveItem: {
            "year"     : -1,
            "untilNow" : -1
        },
        noteKamaActiveItem: {
            "year"     : -1,
            "untilNow" : -1
        },
        noteRetracementActiveItem: {
            "year"     : -1,
            "untilNow" : -1
        },
        noteRatingActiveItem: {
            "海通评级" : [],
            "招商评级" : [],
            "上证评级" : [],
            "济安评级" : [],
        },

        ajaxParam: {
            uid             : window.localStorage.getItem("uid"),
            page            : 1,
            pageSize        : 20,
            sortedBy        : 3,
            sortedDirection : 1,
            // 业绩收益排行 100名
            ranks           : "",
            companyCodes    : "",
            // 业绩收益排行 日期
            yieldRanks      : "",
            // 货基类型
            currencyType    : null,
            // 基金规模
            scaleType       : null,
            // 自定义基金规模 最小值
            sg              : "",
            // 自定义基金规模最大值
            st              : "",

            fundType: "",
        }
    },
    {
        company:
        {
            name : [],
            code : []
        },
        achieve      : [],
        achieveParam : {
            yieldRanks : [],
            ranks      : [],
        },
        achieveOption : [],
        scale         : null,
        scaleOption   : {
            resultForRender : null,
            resultForAjax   : {
                sg : null,
                st : null,
            }
        },
        scaleOptionData: {
            startSc : "",
            endSc   : "",
        },
        type: {
            name : null,
            code : "",
        },
        volatilityParam: {
            forAjax: {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            },
            forRender: [],
        },
        sharpParam: {
            forAjax: {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            },
            forRender: [],
        },
        kamaParam: {
            forAjax: {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            },
            forRender: [],
        },
        retracementParam: {
            forAjax: {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            },
            forRender: [],
        },
        ratingParam: {
            forAjax: {
                haitong    : [],
                zhaoshang  : [],
                shangzheng : [],
                jian       : [],
            },
            forRender: {
                "海通评级" : [],
                "招商评级" : [],
                "上证评级" : [],
                "济安评级" : [],
            },
        },
        // 一级二级基金类型 ajax要求字符串
        fundType: {
            superParamArr     : [], // 保存一级类型
            superParamStr     : "",
            // 保存每个选项的信息
            childParam        : null,
            childBondParamArr : [],
            childBondParamStr : [],
        },
        
        sortID      : 3,
        defaultSort : 3,

        sortList: [],
    },
    {
        sortedDirection   : 1,
        sortForUnMount    : -1,
        sortDirForUnMount : -1,
    },
    {
        
        company: [
            {
                name : "热门",
                code : 19,
            },
            {
                name : "A",
                code : 0,
            },
            {
                name : "B",
                code : 1,
            },
            {
                name : "C",
                code : 2,
            },
            {
                name : "D",
                code : 3,
            },
            {
                name : "F",
                code : 4,
            },
            {
                name : "G",
                code : 5,
            },
            {
                name : "H",
                code : 6,
            },
            {
                name : "J",
                code : 7,
            },
            {
                name : "M",
                code : 8,
            },
            {
                name : "N",
                code : 9,
            },
            {
                name : "P",
                code : 10,
            },
            {
                name : "Q",
                code : 11,
            },
            {
                name : "R",
                code : 12,
            },
            {
                name : "S",
                code : 13,
            },

            {
                name : "T",
                code : 14,
            },
            {
                name : "W",
                code : 15,
            },
            {
                name : "X",
                code : 16,
            },
            {
                name : "Y",
                code : 17,
            },
            {
                name : "Z",
                code : 18,
            },
        ],
        achieve: [
            {
                name   : "近一周",
                code   : "w",
                sortID : 4,
            },
            {
                name   : "近1月",
                code   : "m",
                sortID : 5,
            },
            {
                name   : "近3月",
                code   : "m3",
                sortID : 6,
            },
            {
                name   : "近6月",
                code   : "m6",
                sortID : 7,
            },
            {
                name   : "近1年",
                code   : "y",
                sortID : 8,
            },
            {
                name   : "今年以来",
                code   : "jn",
                sortID : 9,
            },
            {
                name   : "成立至今",
                code   : "zj",
                sortID : 10,
            },
        ],
        achieveSortList: [4, 5, 6, 7, 8, 9, 10],
        
        scale: [
            {
                name : "2亿以上",
                code : 1
            },
            {
                name : "5亿以上",
                code : 2
            },
            {
                name : "10亿以上",
                code : 3
            },
            {
                name : "20亿以上",
                code : 4
            },
            {
                name : "50亿以上",
                code : 5
            },
            {
                name : "100亿以上",
                code : 6
            },
        ],
        scaleSort   : 19,
        ratingParam : [
            {
                name   : "海通评级",
                code   : "haitong",
                sortID : 91,
            },
            {
                name   : "招商评级",
                code   : "zhaoshang",
                sortID : 92,
            },
            {
                name   : "上证评级",
                code   : "shangzheng",
                sortID : 93,
            },
            {
                name   : "济安评级",
                code   : "jian",
                sortID : 94,
            },
        ],
        ratingChild: [
            {
                name : "5星",
                code : 5,
            },
            {
                name : "4星",
                code : 4,
            },
            {
                name : "3星",
                code : 3,
            },
            {
                name : "2星",
                code : 2,
            },
            {
                name : "1星",
                code : 1,
            },
        ],
        openFundParam: [
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
        
        voSortList     : [11, 12],
        shSortList     : [13, 14],
        kaSortList     : [15, 16],
        reSortList     : [17, 18],
        ratingSortList : [91, 92, 93, 94]
    }
];
