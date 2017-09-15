const Service = require("../common/service/service");
const S = new Service();
const renderApp = require("../common/appContainer/appContainer");
const initGFRequest = (Store,createRoute,app) => {
    const info = S.getAccountInfo(window.CUR_FUND, {
        matrixID: window.uid,
        // matrixID: 528,
    });
    const fundList = S.getAllFund(window.CUR_FUND, {});

    const infoID = S.getInfoID(window.CUR_FUND, {
        matrixID: window.uid,
        // matrixID: 528,
    });
    // 我真是无力吐槽这个请求的方式，后端就这么设计的就这样吧
    Promise.all([fundList, infoID, info]).then((rs) => {
        const listrs = rs[0], infoIDrs = rs[1], infors = rs[2];
        // 渲染可申购列表
        Store.dispatch({
            type : "REQUEST_FUND_indexList",
            data : (
                listrs.data.map((item) => {
                    return ({
                        fundCode : item.fundCode,
                        fundName : item.fundName,
                    });
                })
            )
        });
        // 渲染信息
        // custName：客户姓名
        // instreprname：法人姓名
        // instreprtype：法人证件类型
        // instreprno：法人证件号码
        // bankAccount：银行卡号
        // bankBranch：银行卡开户支行
        // bankbranchno：联行号
        // bankName：银行名称
        // contact：经办人姓名
        // conttype：经办人证件类型
        // contno：经办人号码
        // contphone：经办人手机号
        // contemail：经办人邮箱
        // name：写死的广发收款名
        // account：写死的广发收款账号
        // branch：写死的广发收款支行名
        // diffPayNo：跨行大额支付号
        // samePayNo：同行大额支付号
        if (+infors.resultCode === 0) {
            Store.dispatch({
                type : "REQUEST_FUND_accountInfo",
                data : { ...infors }
            });
        }
        // 渲染一般证件类型信息
        Store.dispatch({
            type : "CHANGE_FORM_MANAGE_company_legalNumber_type",
            data : +infors.instreprtype
        });
        Store.dispatch({
            type : "CHANGE_FORM_MANAGE_contact_managerNumber_type",
            data : +infors.conttype
        });
        // 获得数据库表ID
        if (+infoIDrs.code === 0) {
            Store.dispatch({
                type : "REQUEST_FUND_infoID",
                data : infoIDrs.infoID,
            });

            S.getRedeemAmount(window.CUR_FUND, {
                thirdPartId : infoIDrs.infoID,
                fundCode    : listrs.data[0].fundCode,
            }).then((res) => {
                let am = 0;
                if (+res.code === 0) {
                    try {
                        am = res.sharelist[0].availableshare;
                    } catch (er){
                        // process.env.NODE_ENV === "production" ? "":console.error("未返回可赎回份额");
                        am = 0;
                    }
                }
                Store.dispatch({
                    type : "CHANGE_FORM_FUND_redeem_availableAmount",
                    data : am
                });
                Store.dispatch({
                    type : "CHANGE_FORM_FUND_trans_availableAmount",
                    data : am
                });
            });
            // 查询文件信息
            S.getFileName(window.CUR_FUND, {
                thirdPartId: infoIDrs.infoID,
            }).then(result => {
                const getFileName = (str) => {
                    const arr = str.split("/");
                    const length = arr.length;
                    return arr[length - 1];
                };
                if (+result.code === 0){
                    Store.dispatch({
                        type : "REQUEST_MANAGE_file",
                        data : result.data,
                    });
                    Store.dispatch({
                        type : "REQUEST_MANAGE_company_legalFile",
                        data : getFileName(result.data.legalIdentity),
                    });
                    Store.dispatch({
                        type : "REQUEST_MANAGE_bank_bankFile",
                        data : getFileName(result.data.bankAccountProof)
                    });
                    Store.dispatch({
                        type : "REQUEST_MANAGE_contact_managerFile",
                        data : getFileName(result.data.contactIdentity)
                    });
                }
            });
            renderApp({
                AppChild   : app(Store),
                indexRoute : createRoute[0].component,
                route      : createRoute,
            }, true);
        } else {
            // 没有拿到id证明没有开户
            location.href = `/${window.CUR_FUND}/register#/1`;
        }
    });
};
const initZR = (Store,createRoute,app) => {
    // 1.可申购列表
    // S.getAllFund(window.CUR_FUND, {}).then()
    const fundList = {
        data: [{
            fundCode : "003075",
            fundName : "中融货币E",
        },{
            fundCode : "000846",
            fundName : "中融货币C"
        }]
    };
    Store.dispatch({
        type : "REQUEST_FUND_indexList",
        data : (
            fundList.data.map((item) => {
                return ({
                    fundCode : item.fundCode,
                    fundName : item.fundName,
                });
            })
        )
    });
    // 2.申购信息
    const info = S.getAccountInfo(window.CUR_FUND, {
        matrixID: window.uid,
        // matrixID: 528,
    }).then(rs => {
        if (+rs.code === 0){
            // backend can't return same key value
            // custName：客户姓名
            // instreprname：法人姓名
            // instreprtype：法人证件类型
            // instreprno：法人证件号码
            // bankAccount：银行卡号
            // bankBranch：银行卡开户支行
            // bankbranchno：联行号
            // bankName：银行名称
            // contact：经办人姓名
            // conttype：经办人证件类型
            // contno：经办人号码
            // contphone：经办人手机号
            // contemail：经办人邮箱
            // name：写死的广发收款名
            // account：写死的广发收款账号
            // branch：写死的广发收款支行名
            // diffPayNo：跨行大额支付号
            // samePayNo：同行大额支付号
            const data = {...rs.data}
            Store.dispatch({
                type : "REQUEST_FUND_accountInfo",
                data : {
                    custName:data.investorName,
                    instreprname:data.instReprName,
                    instreprtype:data.instReprIDType,
                    instreprno:data.instReprIDCode,

                    bankAccount:data.accountNo,
                    // bankBranch:银行卡开户支行
                    bankbranchno:data.branchCode,
                    bankName:data.bankName,

                    contact:data.transactorName,
                    conttype:data.transactorCertType,
                    contno:data.transactorCertNo,
                    contphone:data.transactorTelNo,
                    // contemail:经办人邮箱
                    name:"中融基金管理有限公司",
                    account:"0200 0034 1902 7305 242",
                    branch:"中国工商银行股份有限公司北京朝阳支行",
                    diffPayNo:"102100000345",
                    // samePayNo:同行大额支付号
                }
            });
        }
    })


    renderApp({
        AppChild   : app(Store),
        indexRoute : createRoute[0].component,
        route      : createRoute,
    }, true);
}


module.exports = (type,store,route,root) => {
    switch (type){
        case "guangfa":
            return initGFRequest(store,route,root);
        case "zhongrong":
            return initZR(store,route,root);
    }
}