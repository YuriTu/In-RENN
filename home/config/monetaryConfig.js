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
            isAny        : true,
            // 被点击的日期
            activeItem   : -1,
            // 二级页面jsx
            achieveData  : [],
            showOption   : false,
            // 是否展示二级页面
            showChild    : false,
            // 是否高亮自定义
            activeOption : false,
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
            warning      : {
                start : false,
                end   : false,
            }
        },
        fundTypeParam: {
            isAny      : true, // 不限 是否被点击 ——是否展示二级页面
            activeItem : -1, // 被点击的类型
            item       : [{
                name : "A类",
                code : 1
            }, {
                name : "B类",
                code : 3
            }, {
                name : "其他类",
                code : 2
            }],
            show : true,
            name : "货基类型",
        },
        activeCompany : "",
        activeAchieve : "",

        // 警告提示参数
        warningSc: {
            start : false,
            end   : false,
        },
        // 一级类型参数
        openFundParam: [{
            index    : 0,
            typeCode : "both"
        }],
        // 一级类型渲染参数
        firstGradeFundParamList: [
            {
                name     : "全部",
                typeCode : "",
            },
            {
                name     : "货币型",
                typeCode : 101004,
            },
            {
                name     : "短期理财型",
                typeCode : 101006,
            },
        ],
        ajaxParam: {
            uid             : window.localStorage.getItem("uid"),
            page            : 1,
            pageSize        : 20,
            sortedBy        : 2,
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
            fundType        : "both"
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
            forAjax   : [],
            forRender : [],
            sort      : 0,
        },
        sharpParam: {
            forAjax   : [],
            forRender : [],
            sort      : 0,
        },
        kamaParam: {
            forAjax   : [],
            forRender : [],
            sort      : 0,
        },
        retracementParam: {
            forAjax   : [],
            forRender : [],
            sort      : 0,
        },
        ratingParam: {
            forAjax: {
                haitong    : [],
                zhaoshang  : [],
                shangzheng : [],
                jian       : [],
            },
            forAjaxF: {
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
        sortID      : 2,
        defaultSort : 2,
        sortList    : [],
    },
    {
        superFundType     : "",
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
                sortID : 11,
            },
            {
                name   : "近1月",
                code   : "m",
                sortID : 4,
            },
            {
                name   : "近3月",
                code   : "m3",
                sortID : 5,
            },
            {
                name   : "近6月",
                code   : "m6",
                sortID : 6,
            },
            {
                name   : "近1年",
                code   : "y",
                sortID : 7,
            },
            {
                name   : "今年以来",
                code   : "jn",
                sortID : 10,
            },
            {
                name   : "成立至今",
                code   : "zj",
                sortID : 8,
            },
        ],
        achieveSortList : [11, 4, 5, 6, 7, 10, 8],
        scale           : [
            {
                name : "50亿以上",
                code : 1
            },
            {
                name : "100亿以上",
                code : 2
            },
            {
                name : "200亿以上",
                code : 3
            },
            {
                name : "500亿以上",
                code : 4
            },
            {
                name : "1000亿以上",
                code : 5
            },
        ],
        scaleSort     : 9,
        openFundParam : [
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
    }
];
