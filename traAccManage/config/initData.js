/**
 * Created by renren on 2017/6/16.
 */
const purSecIndex = [{
    name : "基金购买",
    href : "/fund/order/indexList"
}, {
    name : "基金赎回",
    href : "/fund/redeem/start"
}, {
    name : "基金转换",
    href : "/fund/transform/start"
}];
const transIndex = [{
    name : "企业信息",
    href : "/manage/company/start"
}, {
    name : "银行资料",
    href : "/manage/bank/start"
}, {
    name : "经办人",
    href : "/manage/contact/start"
}];
const orderProcess = [{
    name  : "现在下单",
    route : "fund/order/start"
}, {
    name  : "预计份额确认",
    route : "fund/order/success"
}];
const redeemProcess = [{
    name  : "现在下单",
    route : "fund/redeem/start"
}, {
    name  : "预计份额确认",
    route : "fund/redeem/success"
}];
const clientCard = [
    "身份证",
    "中国护照",
    "军官证",
    "士兵证",
    "港澳居民来往内地通行证",
    "户口本",
    "外国护照",
    "其他",
    "文职",
    "警官",
    "台胞证"
];

const bankList = [
    {
        "bankCode" : "002",
        "bankName" : "中国工商银行",
        "id"       : 1
    },
    {
        "bankCode" : "003",
        "bankName" : "中国农业银行",
        "id"       : 2
    },
    {
        "bankCode" : "004",
        "bankName" : "中国银行",
        "id"       : 3
    },
    {
        "bankCode" : "005",
        "bankName" : "中国建设银行",
        "id"       : 4
    },
    {
        "bankCode" : "006",
        "bankName" : "中国交通银行",
        "id"       : 5
    },
    {
        "bankCode" : "007",
        "bankName" : "中国招商银行",
        "id"       : 6
    },
    {
        "bankCode" : "008",
        "bankName" : "中信实业银行",
        "id"       : 7
    },
    {
        "bankCode" : "009",
        "bankName" : "上海浦东发展银行",
        "id"       : 8
    },
    {
        "bankCode" : "010",
        "bankName" : "深圳发展银行",
        "id"       : 9
    },
    {
        "bankCode" : "011",
        "bankName" : "福建兴业银行",
        "id"       : 10
    },
    {
        "bankCode" : "012",
        "bankName" : "中国光大银行",
        "id"       : 11
    },
    {
        "bankCode" : "014",
        "bankName" : "中国民生银行",
        "id"       : 12
    },
    {
        "bankCode" : "015",
        "bankName" : "广东发展银行",
        "id"       : 13
    },
    {
        "bankCode" : "016",
        "bankName" : "北京银行",
        "id"       : 14
    },
    {
        "bankCode" : "017",
        "bankName" : "上海银行",
        "id"       : 15
    },
    {
        "bankCode" : "021",
        "bankName" : "南京银行卡",
        "id"       : 16
    },
    {
        "bankCode" : "022",
        "bankName" : "深圳平安银行",
        "id"       : 17
    },
    {
        "bankCode" : "025",
        "bankName" : "广州商业银行",
        "id"       : 18
    },
    {
        "bankCode" : "026",
        "bankName" : "东莞农信卡",
        "id"       : 19
    },
    {
        "bankCode" : "027",
        "bankName" : "东莞商业银行",
        "id"       : 20
    },
    {
        "bankCode" : "028",
        "bankName" : "广州农信卡",
        "id"       : 21
    },
    {
        "bankCode" : "034",
        "bankName" : "邮政储蓄",
        "id"       : 22
    },
    {
        "bankCode" : "036",
        "bankName" : "深圳农村商业银行",
        "id"       : 23
    },
    {
        "bankCode" : "038",
        "bankName" : "汇付天下",
        "id"       : 24
    },
    {
        "bankCode" : "039",
        "bankName" : "支付宝",
        "id"       : 25
    },
    {
        "bankCode" : "040",
        "bankName" : "通联支付",
        "id"       : 26
    },
    {
        "bankCode" : "044",
        "bankName" : "重庆银行",
        "id"       : 27
    },
    {
        "bankCode" : "048",
        "bankName" : "河北银行",
        "id"       : 28
    },
    {
        "bankCode" : "050",
        "bankName" : "华夏银行",
        "id"       : 29
    },
    {
        "bankCode" : "051",
        "bankName" : "汇丰银行",
        "id"       : 30
    },
    {
        "bankCode" : "800",
        "bankName" : "德州银行",
        "id"       : 31
    },
    {
        "bankCode" : "803",
        "bankName" : "齐鲁银行",
        "id"       : 32
    },
    {
        "bankCode" : "804",
        "bankName" : "鄞州银行",
        "id"       : 33
    },
    {
        "bankCode" : "805",
        "bankName" : "烟台银行",
        "id"       : 34
    },
    {
        "bankCode" : "901",
        "bankName" : "长沙商行",
        "id"       : 35
    },
    {
        "bankCode" : "903",
        "bankName" : "上海农村商业银行",
        "id"       : 36
    },
    {
        "bankCode" : "905",
        "bankName" : "金华商业银行",
        "id"       : 37
    },
    {
        "bankCode" : "906",
        "bankName" : "顺德农信社",
        "id"       : 38
    },
    {
        "bankCode" : "907",
        "bankName" : "温州银行",
        "id"       : 39
    },
    {
        "bankCode" : "908",
        "bankName" : "济南商业银行",
        "id"       : 40
    },
    {
        "bankCode" : "911",
        "bankName" : "杭州商行",
        "id"       : 41
    },
    {
        "bankCode" : "919",
        "bankName" : "富滇银行",
        "id"       : 42
    },
    {
        "bankCode" : "920",
        "bankName" : "浙商银行卡",
        "id"       : 43
    },
    {
        "bankCode" : "921",
        "bankName" : "汉口银行卡",
        "id"       : 44
    },
    {
        "bankCode" : "930",
        "bankName" : "渣打银行",
        "id"       : 45
    },
    {
        "bankCode" : "998",
        "bankName" : "地方商行",
        "id"       : 46
    },
    {
        "bankCode" : "999",
        "bankName" : "其他",
        "id"       : 47
    }
];
const uploadTypes = ["png", "PNG", "jpg", "JPG", "jpeg", "JPEG", "gif", "GIF", "bmp", "BMP", "tif", "TIF", "tiff", "TIFF", "psd", "PSD", "pdf", "PDF", "rar", "RAR", "zip", "ZIP"];
const canQuickRedeem = {
    "000509" : true,
    "270014" : true,
    "270004" : true
};
// fundCode "270004"
// fundName"广发货币A"
// fundCode "000509"
// fundName "广发钱袋子货币"
// fundCode "000475"
// fundName "广发天天利货币A"
// fundCode "000389"
// fundName "广发天天红货币"
// 生产银行对应code ： name 键值对
const bankListDir = bankList.reduce((obj, cur) => {
    obj[cur.bankName] = cur.bankCode;
    return obj;
}, {});
// 天天红不支持转换，清洗数组
const shiftAntiTrans = (arr) => {
    if (!arr) return;
    const rs = [];
    arr.forEach(item => {
        if (item.fundName !== "广发天天红货币"){
            rs.push(item);
        }
    });
    return rs;
};
// 通过select的选择的index根据list来获取 参数object
const getFundInfo = (props, index, isTrans) => {
    const rs = {};
    const state = props.store.getState();
    let list = state.request.FUND_indexList;
    if (!!isTrans){
        list = shiftAntiTrans(state.request.FUND_indexList);
    }
    if (!!list){
        rs.fundName = !!state.form[index] ?
            list[state.form[index]].fundName :
            list[0].fundName;
        rs.fundCode = !!state.form[index] ?
            list[state.form[index]].fundCode :
            list[0].fundCode;
    }
    return rs;
};
const getTransFundInfo = (props, index) => getFundInfo(props, index, true);
// 数字校检判断标准
const isEmpty = (error) =>
    (value) =>
    (value !== "" && value !== undefined && value !== null) || error;


const affTitle = (fundName, amount, type) => (
    <span>尊敬的客户，您好<br/>
        <span>您将{type ? "赎回" : "申购"}{fundName}
            <span className="affirm-info">{amount}</span>{type ? "份" : "元"}，请确认该操作
        </span>
    </span>
);
const manageAffTitle = (type) => (
    <span>尊敬的客户，您好<br/>
        <span>您将要进行
            <span className="affirm-info">{type}</span>变更，请确认该操作
        </span>
    </span>
);
// 后端文件上传路径，
const url2path = (url) => {
    return url.replace(/http:\/\/static\.sofund\.com/, "/data/nginx/static");
};

module.exports = {
    purSecIndex,
    transIndex,
    orderProcess,
    redeemProcess,
    clientCard,
    bankList,
    uploadTypes,
    canQuickRedeem,
    bankListDir,
    affTitle,
    manageAffTitle,
    getFundInfo,
    isEmpty,
    url2path,
    shiftAntiTrans,
    getTransFundInfo

};
