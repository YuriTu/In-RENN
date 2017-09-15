const React = require("react");
const Service = require("../../common/service/service");
const S = new Service();
const hashHistory = require("react-router").hashHistory;

const helper = require("../../common/christina/christina");
const _ = require("../../common/util/util");
const FundIndexList = require("../components/fund/indexList/indexList");
const OrderSc = require("../components/fund/success/order");
const RedSc = require("../components/fund/success/redem");
const TranSc = require("../components/fund/success/trans");
const ManSc = require("../components/fund/success/manage");
// 基础组件
// const Form =
const Input = require("../components/common/form/input");
const InputWithBtn = require("../components/common/form/inputWithBtn");
const InputWithDropdown = require("../components/common/form/inputWithDropdown");
const Upload = require("../components/common/upload/upload");
const Span = require("../components/common/form/span");
// 下拉单选
const RadioSelect = require("../components/common/form/radioSelect");
const initData = require("./initData");
const { transIndex, orderProcess, redeemProcess,
    clientCard, bankList, uploadTypes,bankListDir,
    affTitle, manageAffTitle,getFundInfo,isEmpty,url2path,shiftAntiTrans,getTransFundInfo
} = { ...initData };
const purSecIndex = [{
    name : "基金购买",
    href : "/fund/order/indexList"
}, {
    name : "基金赎回",
    href : "/fund/redeem/start"
// }, {
//     name : "基金转换",
//     href : "/fund/transform/start"
}];
const canQuickRedeem = {
    "003075":true,
}
let isFetching = false;

const companyDocType = ["营业执照","营业执照"];

class Alter {
    constructor(){
        this.enable = true;
        this.enableFn = () => {
            this.enable = true;
        }
        this.offBefore = () => {
            this.enable = false;
            setTimeout(this.enableFn, 500);
        }
        this.disableFn = () => {
            this.enable = false;
        };
    }
    fn(event){
        if(this.enable){
            const e = event || window.event, info = "你还有数据未保存，确定离开当前页吗?";
            e && (e.returnValue = info);
            return info;
        }
    }
    onBefore(){
        !!USER_ID && (window.onbeforeunload = () => this.fn());
    }
}

const alter = new Alter();

module.exports = (store) => (
    {
        name   : "中融基金",
        nameEn : "zhongrong",
        tabs   : [{
            // FUND
            route : "fund/order/indexList",
            name  : "基金交易",
            // }, {
            //     route : "record",
            //     name  : "交易记录",
            // }, {
            //     route : "manage/company/start",
            //     name  : "账户管理",
        }],
        components:[
            {
                label     : "可申购基金表格",
                href      : "fund/order/indexList",
                isForm    : false,
                component : props => <FundIndexList
                    {...props}
                    navConfig = {purSecIndex}
                    thead = {["基金代码", "基金名称", "操作"]}
                    indexList = {props.store.getState().request.FUND_indexList}
                />,
            },
            {
                label     : "基金购买页",
                href      : "fund/order/start",
                className : "order-start",
                isForm    : true,
                // 二级导航
                navConfig : purSecIndex,
                // 过程进度
                process   : orderProcess,
                // 表单组件, 包裹在className为form-line的div中
                // 底部的用户提示
                pageInfo  : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
                btns      : [{
                    name      : "确认申购",
                    checkRule : true,
                    className : "features-submit",
                    onClick   : function (form, check, props) {
                        props.store.dispatch({
                            type : "CONTROL_orderDialog",
                            data : true,
                        });
                    }
                }],
                onEnter:() => {
                    // 这里加set的原因是didmount生命周期
                    setTimeout(() => {
                        alter.enableFn();
                        alter.onBefore();
                    })
                },
                onLeave:() => {
                    alter.disableFn();
                },
                // 购买订单页
                components: [{
                    label     : "基金名称",
                    field     : "FUND-order-fundname",
                    component : props => <Span
                        {...props}
                        className="fund-order-fundname"
                        setNewValue = {helper.getUrlParam("fundName")}
                    />
                }, {
                    label           : "基金购买金额",
                    field           : "FUND_order_amount",
                    isAutoCheckRule : true,
                    component       : props => <Input
                        {...props}
                        type = "number"
                        className="fund-order-amount"
                        field = "FUND_order_amount"
                        isAutoCheckRule = {true}
                    />,
                    rule: [
                        value => isEmpty("请输入正确的数字")(value),
                        value => +value < (10 ** 12) || "请输入正确的数字",
                        value => +value > 0 || "请输入正确的数字",
                    ]

                }, {
                    label     : "基金购买金额大写",
                    field     : "orderAmountUpper",
                    component : props => <Span
                        {...props}
                        className="fund-order-amountUpper anti-change-input"
                        setNewValue = {
                            props.store.getState().form.FUND_order_amount === "" ? "" :
                                _.num2Money(props.store.getState().form.FUND_order_amount, true)}
                    />,
                }, {
                    label     : "支付银行",
                    component : props => {
                        const info = props.store.getState().request.FUND_accountInfo;
                        return (<RadioSelect
                            {...props}
                            cur = {!!info ? info.bankName : ""}
                            list = {!!info ? [info.bankName] : [""]}
                        />);
                    }
                }, {
                    label     : "经办人",
                    component : props => {
                        const info = props.store.getState().request.FUND_accountInfo;
                        return (
                            <RadioSelect
                                {...props}
                                cur = {!!info ? info.contact : ""}
                                list = {!!info ? [info.contact] : [""]}
                            />
                        );
                    }
                }],
                affirm: props => ({
                    title    : "确认申购",
                    subTitle : affTitle(
                        helper.getUrlParam("fundName"),
                        props.store.getState().form.FUND_order_amount,
                        false
                    ),
                    sure: () => {
                        if (isFetching){
                            return;
                        }
                        isFetching = true;
                        const state = props.store.getState();
                        /**
                         * 注意此处后端接口与广发不同！！
                         */
                        S.getTrans(window.CUR_FUND, {
                            matrixID    : window.uid,
                            fundCode    : helper.getUrlParam("fundCode"),
                            fundName    : helper.getUrlParam("fundName"),
                            logic       : "buy",
                            applicationAmount : state.form.FUND_order_amount,
                        }).then(rs => {
                            isFetching = false;
                            if (+rs.code === 0){
                                hashHistory.push(`fund/order/success?&fundName=${encodeURIComponent(helper.getUrlParam("fundName"))}&amount=${encodeURIComponent(state.form.FUND_order_amount)}`);
                            } else {
                                props.store.dispatch({
                                    type : "CONTROL_orderWaring_content",
                                    data : rs.msg,
                                });
                                props.store.dispatch({
                                    type : "CONTROL_orderWaring_show",
                                    data : true,
                                });
                            }
                            props.store.dispatch({
                                type : "CONTROL_orderDialog",
                                data : false,
                            });
                        });
                    },
                    close: () => props.store.dispatch({
                        type : "CONTROL_orderDialog",
                        data : false,
                    }),
                    customizeHead : false,
                    isShow        : !!props.store.getState().control.orderDialog,
                }),
                dialog: props => {
                    return {
                        customizeHead : false,
                        title         : "提示：",
                        content       : props.store.getState().control.orderWaring_content || "未知错误",
                        isShow        : !!props.store.getState().control.orderWaring_show,
                        close         : () => props.store.dispatch({
                            type : "CONTROL_orderWaring_show",
                            data : false,
                        }),
                    };
                }
            },
            {
                label     : "基金购买成功页",
                href      : "fund/order/success",
                component : props => <OrderSc
                    {...props}
                    navConfig = {purSecIndex}
                    process = {orderProcess}
                />
            },
            {
                label     : "基金赎回页",
                href      : "fund/redeem/start",
                className : "redeem-start",
                isForm    : true,
                navConfig : purSecIndex,
                process   : redeemProcess,
                pageInfo  : "*银行大额支付通道开通时间为交易日09：00-17：00，如有大额快速赎回需求，建议在此段时间内进行。",
                btns      : [{
                    name      : "确认赎回",
                    checkRule : true,
                    className : "features-submit",
                    onClick   : function (form, check, props) {
                        props.store.dispatch({
                            type : "CONTROL_redeemDialog",
                            data : true,
                        });
                    }
                }],
                onEnter:() => {
                    // 这里加set的原因是didmount生命周期
                    setTimeout(() => {
                        alter.enableFn();
                        alter.onBefore();
                    })
                },
                onLeave:() => {
                    alter.disableFn();
                },
                // 赎回订单页
                components: [{
                    label     : "选择基金",
                    field     : "FUND_redeem_fundName",
                    component : props => {
                        const list = props.store.getState().request.FUND_indexList;
                        return (
                            <RadioSelect
                                {...props}
                                field = "FUND_redeem_fundName"
                                showField = "fundName"
                                cur = {!!list ? list[0].fundName : " "}
                                list = {!!list ? list.map(item => item.fundName) : []}
                                propsUpdate = {true}
                                didMountChange = {true}
                                changeRequest = {
                                    (index) => {
                                        const request = props.store.getState().request;
                                        S.getRedeemAmount(window.CUR_FUND, {
                                            matrixID    : window.uid,
                                            thirdPartId : request.FUND_infoID,
                                            fundCode    : request.FUND_indexList[index].fundCode,
                                        }).then(rs => {
                                            if(+rs.code === 0){
                                                props.store.dispatch({
                                                    type : "CHANGE_FORM_FUND_redeem_availableAmount",
                                                    data : rs.data.availableVol || 0
                                                });
                                                // 每次更新基金刷新份额
                                                props.store.dispatch({
                                                    type : "CHANGE_FORM_FUND_redeem_amount",
                                                    data : 0
                                                });
                                                document.querySelector(".fund-redeem-amount").value = "";
                                                props.store.dispatch({
                                                    type : "CLEAR_ERROR_FUND_redeem_amount",
                                                });
                                            }
                                        });
                                    }

                                }
                            />
                        );
                    }
                }, {
                    label     : "可用份额",
                    field     : "FUND_redeem_availableAmount",
                    component : props => {
                        const request = props.store.getState().request;
                        const redeemValue = props.store.getState().form.FUND_redeem_availableAmount ?
                            props.store.getState().form.FUND_redeem_availableAmount :
                            S.getRedeemAmount(window.CUR_FUND, {
                                matrixID    : window.uid,
                                fundCode    : request.FUND_indexList[0].fundCode,
                            }).then(rs => {
                                if(+rs.code === 0){
                                    props.store.dispatch({
                                        type : "CHANGE_FORM_FUND_redeem_availableAmount",
                                        data : rs.data.availableVol || 0
                                    });
                                    // 每次更新基金刷新份额
                                    props.store.dispatch({
                                        type : "CHANGE_FORM_FUND_redeem_amount",
                                        data : 0
                                    });
                                    document.querySelector(".fund-redeem-amount").value = "";
                                    props.store.dispatch({
                                        type : "CLEAR_ERROR_FUND_redeem_amount",
                                    });
                                }
                            }) && [];
                        return (<Span
                            {...props}
                            className="fund-redeem-availableAmount anti-change-input"
                            field = "FUND_redeem_availableAmount"
                            setNewValue = {redeemValue}
                        />); },
                }, {
                    label           : "赎回份额",
                    field           : "FUND_redeem_amount",
                    isAutoCheckRule : true,
                    component       : props => <InputWithBtn
                        {...props}
                        type = "number"
                        className="fund-redeem-amount"
                        field = "FUND_redeem_amount"
                        isAutoCheckRule = {true}
                    />,
                    rule: [
                        value => isEmpty("请输入正确的数字")(value),
                        value => +value < (10 ** 12) || "请输入正确的数字",
                        value => +value <= +store.getState().form.FUND_redeem_availableAmount || "请输入正确的数字",
                        value => +value > 0 || "请输入正确的数字",

                    ]
                }, {
                    label     : "赎回份额大写",
                    field     : "orderAmountUpper",
                    component : props => <Span
                        {...props}
                        className="fund-redeem-amountUpper anti-change-input"
                        field = "FUND_redeem_amountUpper"
                        setNewValue = {
                            props.store.getState().form.FUND_redeem_amount === "" ? "" :
                                _.numToCapital(props.store.getState().form.FUND_redeem_amount, false)}
                    />,
                }, {
                    label     : "赎回方式",
                    component : props => {
                        const state = props.store.getState();
                        let fundCode = getFundInfo(props, "FUND_redeem_fundName").fundCode;
                        if (state.request.FUND_indexList){
                            fundCode = !!state.form.FUND_redeem_fundName ?
                                state.request.FUND_indexList[state.form.FUND_redeem_fundName].fundCode :
                                state.request.FUND_indexList[0].fundCode;
                        }
                        // 条件为 1. 填写了联行号 2.基本本身可以快赎
                        // if (canQuickRedeem[fundCode] && state.request.FUND_accountInfo.bankbranchno ) {
                        if (canQuickRedeem[fundCode]) {
                            return (<RadioSelect
                                {...props}
                                cur={"普通赎回"}
                                list={["普通赎回", "快速赎回"]}
                                field="FUND_redeem_type"
                            />);
                        }
                        return (<Span
                            {...props}
                            className="FUND_redeem_type anti-change-input"
                            field="FUND_redeem_type"
                            setNewValue={"普通赎回"}
                        />);
                    }
                }, {
                    label     : "支付银行",
                    component : props => {
                        const info = props.store.getState().request.FUND_accountInfo;
                        return (<RadioSelect
                            {...props}
                            cur = {!!info ? info.bankName : ""}
                            list = {!!info ? [info.bankName] : [""]}
                        />);
                    }
                }, {
                    label     : "经办人",
                    field     : "manager",
                    component : props => {
                        const info = props.store.getState().request.FUND_accountInfo;
                        return (
                            <RadioSelect
                                {...props}
                                cur = {!!info ? info.contact : ""}
                                list = {!!info ? [info.contact] : [""]}
                            />
                        );
                    }
                }],
                affirm: props => {
                    const state = props.store.getState();
                    const fundInfo = getFundInfo(props, "FUND_redeem_fundName")
                    return ({
                        title    : "确认赎回",
                        subTitle : affTitle(
                            fundInfo.fundName,
                            state.form.FUND_redeem_amount,
                            true
                        ),
                        sure: () => {
                            if (isFetching){
                                return;
                            }
                            isFetching = true;
                            S.getTrans(window.CUR_FUND, {
                                matrixID    : window.uid,
                                fundCode    : fundInfo.fundCode,
                                fundName    : fundInfo.fundName,
                                logic       : "redeem",
                                applicationVol: state.form.FUND_redeem_amount,
                                type        : canQuickRedeem[fundInfo.fundCode] ? (!!state.form.FUND_redeem_type ? 0 : 1) : 1,

                            }).then(rs => {
                                isFetching = false;
                                if (+rs.code === 0){
                                    hashHistory.push(`fund/redeem/success?&fundName=${encodeURIComponent(fundInfo.fundName)}&amount=${encodeURIComponent(state.form.FUND_redeem_amount)}`);
                                } else {
                                    props.store.dispatch({
                                        type : "CONTROL_redeemWaring_content",
                                        data : rs.msg,
                                    });
                                    props.store.dispatch({
                                        type : "CONTROL_redeemWaring_show",
                                        data : true,
                                    });
                                }
                                props.store.dispatch({
                                    type : "CONTROL_redeemDialog",
                                    data : false,
                                });
                            });
                        },
                        close: () => props.store.dispatch({
                            type : "CONTROL_redeemDialog",
                            data : false,
                        }),
                        customizeHead : false,
                        isShow        : !!props.store.getState().control.redeemDialog,
                    });
                },
                dialog: props => {
                    return {
                        customizeHead : false,
                        title         : "提示：",
                        content       : props.store.getState().control.redeemWaring_content || "未知错误",
                        isShow        : !!props.store.getState().control.redeemWaring_show,
                        close         : () => props.store.dispatch({
                            type : "CONTROL_redeemWaring_show",
                            data : false,
                        }),
                    };
                }
            },
            {
                label     : "基金赎回成功页",
                href      : "fund/redeem/success",
                component : props => <RedSc
                    {...props}
                    navConfig = {purSecIndex}
                    process = {orderProcess}
                />
            },
        ]
    }
)