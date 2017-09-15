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
const { purSecIndex, transIndex, orderProcess, redeemProcess,
    clientCard, bankList, uploadTypes, canQuickRedeem,bankListDir,
    affTitle, manageAffTitle,getFundInfo,isEmpty,url2path,shiftAntiTrans,getTransFundInfo
} = { ...initData };
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

module.exports = (store) =>( {
    name   : "广发基金",
        nameEn : "guangfa",
        tabs   : [{
        // FUND
        route : "fund/order/indexList",
        name  : "基金交易",
    }, {
        route : "record",
        name  : "交易记录",
    }, {
        route : "manage/company/start",
        name  : "账户管理",
    }],
        components: [
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
                    S.getTrans(window.CUR_FUND, {
                        type        : 0,
                        thirdPartId : state.request.FUND_infoID,
                        amount      : state.form.FUND_order_amount,
                        fundCode    : helper.getUrlParam("fundCode"),
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
                                        thirdPartId : request.FUND_infoID,
                                        fundCode    : request.FUND_indexList[index].fundCode,
                                    }).then(rs => {
                                        props.store.dispatch({
                                            type : "CHANGE_FORM_FUND_redeem_availableAmount",
                                            data : rs.sharelist[0] ? rs.sharelist[0].availableshare : 0
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
                    const redeemValue = props.store.getState().form.FUND_redeem_availableAmount;

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
                    let fundCode = "000509";
                    if (state.request.FUND_indexList){
                        fundCode = !!state.form.FUND_redeem_fundName ?
                            state.request.FUND_indexList[state.form.FUND_redeem_fundName].fundCode :
                            state.request.FUND_indexList[0].fundCode;
                    }
                    // 条件为 1. 填写了联行号 2.基本本身可以快赎
                    if (canQuickRedeem[fundCode] && state.request.FUND_accountInfo.bankbranchno ) {
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
                            type        : 1,
                            thirdPartId : state.request.FUND_infoID,
                            amount      : state.form.FUND_redeem_amount,
                            fundCode    : fundInfo.fundCode,
                            redeemtype  : canQuickRedeem[fundInfo.fundCode] ? (!!state.form.FUND_redeem_type ? 1 : 0) : 0
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
        {
            label     : "基金转换页",
            href      : "fund/transform/start",
            className : "transform-start",
            isForm    : true,
            navConfig : purSecIndex,
            // process   : orderProcess,
            btns      : [{
                name      : "确认转换",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form, check, props) {
                    props.store.dispatch({
                        type : "CONTROL_transDialog",
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
            // 基金转换页
            components: [{
                label     : "选择转出基金",
                field     : "FUND_trans_out",
                component : props => {
                    let list = shiftAntiTrans(props.store.getState().request.FUND_indexList)
                    // 第一个为天天红，不支持转换
                    return (<RadioSelect
                        {...props}
                        field = {"FUND_trans_out"}
                        cur = {!!list ? list[0].fundName : " "}
                        list = {!!list ? list.map(item => item.fundName) : []}
                        style = {{"zIndex":11}}
                        className = {"FUND_trans_out"}
                        changeRequest = {
                            // 任意一个基金改变，清楚之前的同基金报错问题
                            (index) => {
                                props.store.dispatch({
                                    type: `CLEAR_ERROR_FUND_trans_in`
                                });
                                const request = props.store.getState().request;
                                S.getRedeemAmount(window.CUR_FUND, {
                                    thirdPartId : request.FUND_infoID,
                                    fundCode    : list[index].fundCode,
                                }).then(rs => {
                                    props.store.dispatch({
                                        type : "CHANGE_FORM_FUND_trans_availableAmount",
                                        data : rs.sharelist[0] ? rs.sharelist[0].availableshare : 0
                                    });
                                    props.store.dispatch({
                                        type : "CHANGE_FORM_FUND_trans_amount",
                                        data : 0
                                    });
                                    document.querySelector(".fund-trans-amount").value = "";
                                    props.store.dispatch({
                                        type : "CLEAR_ERROR_FUND_trans_amount",
                                        // data : rs.sharelist[0] ? rs.sharelist[0].availableshare : 0
                                    });
                                });
                            }

                        }
                        didMountChange = {true}
                    />); }
            }, {
                label     : "选择转入基金",
                field     : "FUND_trans_in",
                component : props => {
                    let list = shiftAntiTrans(props.store.getState().request.FUND_indexList)
                    return (
                        <RadioSelect
                            {...props}
                            field = {"FUND_trans_in"}
                            className = {"FUND_trans_int"}
                            cur = {!!list ? list[0].fundName : " "}
                            list = {!!list ? list.map(item => item.fundName) : []}
                            didMountChange = {true}
                        />
                    );
                },
                rule: [
                    value => {
                        let rs = "同基金不可转换";
                        const transin = store.getState().form.FUND_trans_in;
                        const transout = store.getState().form.FUND_trans_out;
                        if(transin !== transout){
                            rs = true
                        }
                        return rs;
                    }
                ],
            }, {
                label     : "可用份额",
                field     : "FUND_trans_availableAmount",
                component : props => <Span
                    {...props}
                    className="fund-trans-availableAmount anti-change-input"
                    field = "FUND_trans_availableAmount"
                    setNewValue={props.store.getState().form.FUND_trans_availableAmount}
                />,
            }, {
                label           : "转换份额",
                field           : "FUND_trans_amount",
                isAutoCheckRule : true,
                component       : props => <InputWithBtn
                    {...props}
                    type = "number"
                    isAutoCheckRule = {true}
                    className="fund-trans-amount"
                    field = "FUND_trans_amount"
                />,
                rule: [
                    value => isEmpty("请输入正确的数字")(value),
                    value => +value < 1000000 || "请输入正确的数字",
                    value => +value <= store.getState().form.FUND_trans_availableAmount || "请输入正确的数字",
                    value => +value > 0 || "请输入正确的数字",
                ]
            }, {
                label     : "转换份额大写",
                field     : "FUND_trans_amountUpper",
                component : props => <Span
                    {...props}
                    type = "text"
                    className="fund-trans-amountUpper anti-change-input"
                    field = "FUND_trans_amountUpper"
                    disabled = {true}
                    setNewValue = {
                        props.store.getState().form.FUND_trans_amount === "" ? "" :
                            _.numToCapital(props.store.getState().form.FUND_trans_amount, false)}
                />,
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
                const transout = getTransFundInfo(props, "FUND_trans_out");
                const transin = getTransFundInfo(props, "FUND_trans_in");
                return ({
                    title    : "确认转换",
                    subTitle : (<span>尊敬的客户，您好<br/>
                                        <span>{`您将从 ${transout.fundName}(${transout.fundCode})转出`}
                                            <span className="affirm-info">{state.form.FUND_trans_amount}份</span>
                                            至{`${transin.fundName}(${transin.fundCode})`}，请确认该操作
                                        </span>
                                    </span>),
                    sure: () => {
                        if (isFetching){
                            return;
                        }
                        isFetching = true;

                        S.getFundTrans(window.CUR_FUND, {
                            thirdPartId   : state.request.FUND_infoID,
                            amount        : state.form.FUND_trans_amount,
                            fundCode      : transout.fundCode,
                            otherfundcode : transin.fundCode
                        }).then(rs => {
                            // if (+rs.code === 0){
                            isFetching = false;
                            window.sessionStorage.setItem("transSuccess", JSON.stringify({
                                transout    : transout,
                                transin     : transin,
                                amount      : state.form.FUND_trans_amount,
                                transDate   : rs.fundrequestdate,
                                confirmDate : rs.arrivedate,
                                status      : rs.msg
                            }));
                            hashHistory.push("fund/transform/success");
                            // }
                            props.store.dispatch({
                                type : "CONTROL_transDialog",
                                data : false,
                            });
                        });
                    },
                    close: () => props.store.dispatch({
                        type : "CONTROL_transDialog",
                        data : false,
                    }),
                    customizeHead : false,
                    isShow        : !!props.store.getState().control.transDialog,
                });
            }
        },
        {
            label     : "基金转换成功页",
            href      : "fund/transform/success",
            component : props => <TranSc
                {...props}
                navConfig = {purSecIndex}
                process = {orderProcess}
            />
        },
        {
            label     : "账户管理-企业信息展示页",
            href      : "manage/company/start",
            className : "company-start",
            isForm    : true,
            navConfig : transIndex,
            // 表单组件, 包裹在className为form-line的div中
            // 底部的用户提示
            btns      : [{
                name      : "修改企业信息",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/company/edit");
                }
            }],
            // 企业信息页
            components: [{
                label     : "客户名称:",
                component : props => <Span
                    {...props}
                    className="trans-company-custName anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.custName :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "证件类型:",
                component : props => <Span
                    {...props}
                    className="trans-company-type anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        companyDocType[props.store.getState().request.FUND_accountInfo.identityType]||"营业执照" :
                        "营业执照"
                    }
                    disabled = {true}
                />
            }, {
                label     : "证件号码:",
                component : props => <Span
                    {...props}
                    className="trans-company-license anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.identityNo :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "法人:",
                component : props => <Span
                    {...props}
                    className="trans-company-legalPerson anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.instreprname :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "法人证件号码:",
                component : props => <Span
                    {...props}
                    className="trans-company-instreprno anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.instreprno :
                        "test"
                    }
                    disabled = {true}
                />
            }],
        },
        {
            label     : "账户管理-企业信息修改页",
            href      : "manage/company/edit",
            className : "company-edit",
            isForm    : true,
            navConfig : transIndex,
            // 表单组件, 包裹在className为form-line的div中
            // 底部的用户提示
            btns      : [{
                name      : "提交",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form, check, props) {
                    props.store.dispatch({
                        type : "CONTROL_companyDialog",
                        data : true,
                    });
                }
            }, {
                name      : "取消",
                checkRule : false,
                className : "cancel-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/company/start");
                }
            }],
            onEnter:() => {
                setTimeout(() => {
                    alter.enableFn();
                    alter.onBefore();
                })
            },
            onLeave:() => {
                alter.disableFn();
            },
            // 企业信息页
            components: [{
                label     : "客户名称:",
                component : props => <Span
                    {...props}
                    className="trans-company-custName anti-change-input"
                    field = "MANAGE_company_clientName"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.custName :
                        "test"
                    }
                />
            }, {
                label     : "法人:",
                field     : "MANAGE_company_legal",
                component : props => <Input
                    {...props}
                    className="trans-company-instreprname"
                    field = "MANAGE_company_legal"
                    type = "text"
                    defaultValue= {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.instreprname :
                        "test"
                    }
                />,
                rule: [
                    value => {
                        if (/^(?!·)(?!.*?·$)[a-zA-Z\s·]+$/.test(value)) {
                            return true;
                        } else if (/^(?!·)(?!.*?·$)[·\u4e00-\u9fa5]+$/.test(value)) {
                            return true;
                        } else {
                            return "请输入正确的法人姓名";
                        }
                    }
                ]
            }, {
                label     : "法人证件:",
                field     : "MANAGE_company_legalNumber",
                component : props => <InputWithDropdown
                    {...props}
                    className="trans-company-instrepLicense inputWithDrop"
                    field = "MANAGE_company_legalNumber"
                    selects = {clientCard}
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.instreprno :
                        "test"
                    }
                />,
                rule: [
                    (value, type) => isEmpty(`请输入${clientCard[type]}`)(value),
                    (value, type) => +type === 0 ? (/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value)) || "请输入正确的身份证" : true
                ]
            }, {
                label     : "法人身份证正反面扫描件（加盖公章）:",
                field     : "MANAGE_company_legalFile",
                component : props => <Upload
                    {...props}
                    className="trans-company-legalPerson"
                    field = "MANAGE_company_legalFile"
                    fileTypes={uploadTypes}
                />,
                rule: isEmpty("请上传法人身份证正反面扫描件（加盖公章）")
            }],
            affirm: props => {
                const state = props.store.getState();
                return ({
                    title    : "企业信息确认",
                    subTitle : manageAffTitle("企业信息"),
                    sure     : () => {
                        const info = state.request.FUND_accountInfo;
                        if (isFetching){
                            return;
                        }
                        isFetching = true;
                        // 开始loading
                        props.store.dispatch({
                            type : "CONTROL_loading",
                            data : true,
                        });
                        S.getUpdateCompany(window.CUR_FUND, {
                            thirdPartId  : state.request.FUND_infoID,
                            // TODO: 客户名称丢失
                            instreprname : state.form.MANAGE_company_legal || info.instreprname,
                            instreprtype : state.form.MANAGE_company_legalNumber_type || info.instreprtype,
                            instreprno   : state.form.MANAGE_company_legalNumber || info.instreprno,
                            url          : state.form.MANAGE_company_legalFile ? state.form.MANAGE_company_legalFile.url : state.request.MANAGE_file.legalIdentity,
                            path         : state.form.MANAGE_company_legalFile ? state.form.MANAGE_company_legalFile.path : url2path(state.request.MANAGE_file.legalIdentity)
                        }).then(rs => {
                            isFetching = false;
                            if (+rs.retcode === 0){
                                hashHistory.push("fund/trans/success");
                            } else {
                                props.store.dispatch({
                                    type : "CONTROL_companyWaring_content",
                                    data : rs.retmsg,
                                });
                                props.store.dispatch({
                                    type : "CONTROL_companyWaring_show",
                                    data : true,
                                });

                            }
                            props.store.dispatch({
                                type : "CONTROL_companyDialog",
                                data : false,
                            });
                            // 无论成功失败结束laoding
                            props.store.dispatch({
                                type : "CONTROL_loading",
                                data : false,
                            });
                        });
                    },
                    close: () => props.store.dispatch({
                        type : "CONTROL_companyDialog",
                        data : false,
                    }),
                    customizeHead : false,
                    isShow        : !!props.store.getState().control.companyDialog,
                });
            },
            loading: props => ({
                isLoading:store.getState().control.loading
            }),
            dialog: props => {
                return {
                    customizeHead : false,
                    title         : "提示：",
                    content       : props.store.getState().control.companyWaring_content || "未知错误",
                    isShow        : !!props.store.getState().control.companyWaring_show,
                    close         : () => props.store.dispatch({
                        type : "CONTROL_companyWaring_show",
                        data : false,
                    }),
                };
            }
        },
        {
            label     : "账户管理-企业信息修改成功页",
            href      : "manage/company/success",
            className : "company-success",
            component : props => <ManSc
                {...props}
                navConfig = {transIndex}
                field = {"修改企业信息"}
                className = {"company-success"}
            />
        },
        {
            label     : "账户管理-银行资料",
            href      : "manage/bank/start",
            className : "bank-start",
            isForm    : true,
            navConfig : transIndex,
            // 表单组件, 包裹在className为form-line的div中
            // 底部的用户提示
            btns      : [{
                name      : "修改银行资料",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/bank/edit");
                }
            }],
            // 银行资料
            components: [{
                label     : "开户银行:",
                component : props => <Span
                    {...props}
                    className="trans-bank-bankName anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankName :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "银行开户支行:",
                component : props => <Span
                    {...props}
                    className="trans-bank-bankBranch anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankBranch :
                        "test"
                    }
                    disabled = {true}
                />

            }, {
                label     : "银行账户名:",
                component : props => <Span
                    {...props}
                    className="trans-bank-bankUser anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.nameInBank :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "银行卡号:",
                component : props => <Span
                    {...props}
                    className="trans-bank-userCard anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankAccount :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "联行号:",
                component : props => <Span
                    {...props}
                    className="trans-bank-contCard anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankbranchno :
                        "test"
                    }
                    disabled = {true}
                />
            }],
        },
        {
            label     : "账户管理-银行资料修改页",
            href      : "manage/bank/edit",
            className : "bank-edit",
            isForm    : true,
            navConfig : transIndex,
            btns      : [{
                name      : "提交",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form, check, props) {
                    props.store.dispatch({
                        type : "CONTROL_bankDialog",
                        data : true,
                    });
                }
            }, {
                name      : "取消",
                checkRule : false,
                className : "cancel-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/bank/start");
                }
            }],
            onEnter:() => {
                setTimeout(() => {
                    alter.enableFn();
                    alter.onBefore();
                })
            },
            onLeave:() => {
                alter.disableFn();
            },
            components: [{
                label     : "银行账户名:",
                field : "MANAGE_bank_bankUser",
                component : props => <Span
                    {...props}
                    className="trans-bank-bankUser anti-change-input"
                    field = "MANAGE_bank_bankUser"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.nameInBank :
                        "test"
                    }
                />,
            },{
                label     : "开户银行:",
                field : "MANAGE_bank_bankMain",
                component : props => {
                    const info = props.store.getState().request.FUND_accountInfo;
                    const list = bankList.map(item => item.bankName);
                    return (<RadioSelect
                        {...props}
                        className="trans-bank-bankName"
                        field = "MANAGE_bank_bankMain"
                        cur = {!!info ? info.bankName : list[0] }
                        list = {list}
                    />);
                }
            }, {
                label     : "银行开户支行:",
                field : "MANAGE_bank_bankBranch",
                component : props => <Input
                    {...props}
                    className="trans-bank-bankBranch"
                    field = "MANAGE_bank_bankBranch"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankBranch :
                        "test"
                    }
                />,
                rule: [
                    (value, type) => isEmpty("银行开户支行不能为空")(value),
                ],

            }, {
                label     : "银行卡号:",
                field : "MANAGE_bank_bankNumber",
                component : props => <Input
                    {...props}
                    className="trans-bank-userCard"
                    field = "MANAGE_bank_bankNumber"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankAccount :
                        "test"
                    }
                />,
                rule: [
                    (value, type) => isEmpty("银行卡号不能为空")(value),
                ],
            }, {
                label     : "联行号:",
                field : "MANAGE_bank_bankConcat",
                component : props => <Input
                    {...props}
                    className="trans-bank-contCard"
                    field = "MANAGE_bank_bankConcat"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.bankbranchno :
                        "test"
                    }
                />,
                formInfo : "非必填项",
            }, {
                label     : "银行账户证明文件（加盖公章）:",
                field     : "MANAGE_bank_bankFile",
                component : props => <Upload
                    {...props}
                    className="trans-bank-file"
                    field = "MANAGE_bank_bankFile"
                    fileTypes={uploadTypes}
                />
            }],
            affirm: props => {
                const state = props.store.getState();
                return ({
                    title    : "银行资料确认",
                    subTitle : manageAffTitle("银行资料"),
                    sure     : () => {
                        const info = state.request.FUND_accountInfo;
                        if (isFetching){
                            return;
                        }
                        isFetching = true;
                        props.store.dispatch({
                            type : "CONTROL_loading",
                            data : true,
                        });
                        S.getUpdateBank(window.CUR_FUND, {
                            thirdPartId  : state.request.FUND_infoID,
                            bankNo       : state.form.MANAGE_bank_bankMain === undefined ? bankListDir[info.bankName] : bankList[state.form.MANAGE_bank_bankMain].bankCode,
                            bankAccount  : state.form.MANAGE_bank_bankNumber || info.bankAccount,
                            bankBranch   : state.form.MANAGE_bank_bankBranch || info.bankBranch,
                            bankBranchNo : state.form.MANAGE_bank_bankConcat || info.bankbranchno,
                            url          : state.form.MANAGE_bank_bankFile ? state.form.MANAGE_bank_bankFile.url : state.request.MANAGE_file.bankAccountProof,
                            path         : state.form.MANAGE_bank_bankFile ? state.form.MANAGE_bank_bankFile.path : url2path(state.request.MANAGE_file.bankAccountProof)
                        }).then(rs => {
                            isFetching = false;
                            if (+rs.retcode === 0){
                                hashHistory.push("manage/bank/success");
                            } else {
                                props.store.dispatch({
                                    type : "CONTROL_bankWaring_content",
                                    data : rs.retmsg,
                                });
                                props.store.dispatch({
                                    type : "CONTROL_bankWaring_show",
                                    data : true,
                                });

                            }
                            props.store.dispatch({
                                type : "CONTROL_bankDialog",
                                data : false,
                            });
                            props.store.dispatch({
                                type : "CONTROL_loading",
                                data : false,
                            });
                        });
                    },
                    close: () => props.store.dispatch({
                        type : "CONTROL_bankDialog",
                        data : false,
                    }),
                    customizeHead : false,
                    isShow        : !!props.store.getState().control.bankDialog,
                });
            },
            loading: props => ({
                isLoading:store.getState().control.loading
            }),
            dialog: props => {
                return {
                    customizeHead : false,
                    title         : "提示：",
                    content       : props.store.getState().control.bankWaring_content || "未知错误",
                    isShow        : !!props.store.getState().control.bankWaring_show,
                    close         : () => props.store.dispatch({
                        type : "CONTROL_bankWaring_show",
                        data : false,
                    }),
                };
            }
        },
        {
            label     : "账户管理-银行资料修改成功页",
            href      : "manage/bank/success",
            className : "bank-success",
            component : props => <ManSc
                {...props}
                navConfig = {transIndex}
                field = {"修改银行资料"}
                className={"bank-success"}
            />
        },
        {
            label     : "账户管理-经办人",
            href      : "manage/contact/start",
            className : "contact-start",
            isForm    : true,
            navConfig : transIndex,
            // 表单组件, 包裹在className为form-line的div中
            // 底部的用户提示
            btns      : [{
                name      : "修改经办人",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/contact/edit");
                }
            }],
            components: [{
                label     : "经办人:",
                component : props => <Span
                    {...props}
                    className="trans-contact-name anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contact :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "身份信息:",
                component : props => <Span
                    {...props}
                    className="trans-contact-identity anti-change-input"
                    field = "bank"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contno :
                        "test"
                    }
                    disabled = {true}
                />

            }, {
                label     : "手机号:",
                component : props => <Span
                    {...props}
                    className="trans-contact-tel anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contphone :
                        "test"
                    }
                    disabled = {true}
                />
            }, {
                label     : "邮箱:",
                component : props => <Span
                    {...props}
                    className="trans-contact-mail anti-change-input"
                    field = "bankName"
                    type = "text"
                    setNewValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contemail :
                        "test"
                    }
                    disabled = {true}
                />
            }],
        },
        {
            label     : "账户管理-经办人修改页",
            href      : "manage/contact/edit",
            className : "contact-edit",
            isForm    : true,
            navConfig : transIndex,
            btns      : [{
                name      : "提交",
                checkRule : true,
                className : "features-submit",
                onClick   : function (form, check, props) {
                    props.store.dispatch({
                        type : "CONTROL_contactDialog",
                        data : true,
                    });
                }

            }, {
                name      : "取消",
                checkRule : false,
                className : "cancel-submit",
                onClick   : function (form) {
                    hashHistory.push("/manage/contact/start");
                }
            }],
            onEnter:() => {
                setTimeout(() => {
                    alter.enableFn();
                    alter.onBefore();
                })
            },
            onLeave:() => {
                alter.disableFn();
            },
            components: [{
                label     : "新经办人姓名:",
                field     : "MANAGE_contact_manager",
                component : props => <Input
                    {...props}
                    className="trans-contact-name"
                    field = "MANAGE_contact_manager"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contact :
                        "test"
                    }
                />,
                rule: [
                    // value => isEmpty("请输入经办人姓名")(value),
                    // 使用正则表达式过滤非法字符，经办人姓名只允许输入英文、数字或汉字以及姓名连接符
                    value => {
                        if (/^(?!·)(?!.*?·$)[a-zA-Z\s·]+$/.test(value)) {
                            return true;
                        } else if (/^(?!·)(?!.*?·$)[·\u4e00-\u9fa5]+$/.test(value)) {
                            return true;
                        } else {
                            return "请输入正确的经办人姓名";
                        }
                    }
                ],
            }, {
                label     : "经办人证件:",
                field     : "MANAGE_contact_managerNumber",
                component : props => <InputWithDropdown
                    {...props}
                    className="trans-contact-identity inputWithDrop"
                    field = "MANAGE_contact_managerNumber"
                    type = "text"
                    selects = {clientCard}
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contno :
                        "test"
                    }
                />,
                rule: [
                    (value, type) => isEmpty(`请输入${clientCard[type]}`)(value),
                    (value, type) => +type === 0 ? (/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value)) || "请输入正确的身份证" : true
                ]
            }, {
                label     : "手机号:",
                field     : "MANAGE_contact_managerTel",
                component : props => <Input
                    {...props}
                    className="trans-contact-tel"
                    field = "MANAGE_contact_managerTel"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contphone :
                        "test"
                    }
                />,
                rule: [
                    value => isEmpty("请输入手机号")(value),
                    value => value ? value.length === 11 || "手机号格式不正确" : true
                ]
            }, {
                label     : "邮箱:",
                field     : "MANAGE_contact_managerMail",
                component : props => <Input
                    {...props}
                    className="trans-contact-mail"
                    field = "MANAGE_contact_managerMail"
                    type = "text"
                    defaultValue = {props.store.getState().request.FUND_accountInfo ?
                        props.store.getState().request.FUND_accountInfo.contemail :
                        "test"
                    }
                />,
                rule: [
                    value => isEmpty("请输入邮箱")(value),
                    value => /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value) || "邮箱格式不正确"
                ]
            }, {
                label     : "经办人身份证正反面扫描件（加盖公章）:",
                field     : "MANAGE_contact_managerFile",
                component : props => <Upload
                    {...props}
                    className="trans-company-legalPerson"
                    field = "MANAGE_contact_managerFile"
                    fileTypes={uploadTypes}
                />
            }],
            affirm: props => {
                const state = props.store.getState();
                return ({
                    title    : "经办人信息确认",
                    subTitle : manageAffTitle("经办人信息"),
                    sure     : () => {
                        const info = state.request.FUND_accountInfo;
                        if (isFetching){
                            return;
                        }
                        isFetching = true;
                        props.store.dispatch({
                            type : "CONTROL_loading",
                            data : true,
                        });
                        S.getUpdateContact(window.CUR_FUND, {
                            thirdPartId : state.request.FUND_infoID,
                            contact     : state.form.MANAGE_contact_manager || info.contact,
                            contType    : +state.form.MANAGE_contact_managerNumber_type || info.conttype,
                            contNo      : state.form.MANAGE_contact_managerNumber || info.contno,
                            contPhone   : state.form.MANAGE_contact_managerTel || info.contphone,
                            contEmail   : state.form.MANAGE_contact_managerMail || info.contemail,
                            url         : state.form.MANAGE_contact_managerFile ? state.form.MANAGE_contact_managerFile.url : state.request.MANAGE_file.contactIdentity,
                            path        : state.form.MANAGE_contact_managerFile ? state.form.MANAGE_contact_managerFile.path : url2path(state.request.MANAGE_file.contactIdentity)
                        }).then(rs => {
                            isFetching = false;
                            // ...不是我不统一后端就是用这个名字
                            if (+rs.retcode === 0){
                                hashHistory.push("manage/contact/success");
                            } else {
                                props.store.dispatch({
                                    type : "CONTROL_contactWaring_content",
                                    data : rs.retmsg,
                                });
                                props.store.dispatch({
                                    type : "CONTROL_contactWaring_show",
                                    data : true,
                                });
                            }
                            props.store.dispatch({
                                type : "CONTROL_contactDialog",
                                data : false,
                            });
                            props.store.dispatch({
                                type : "CONTROL_loading",
                                data : false,
                            });
                        });
                    },
                    close: () => props.store.dispatch({
                        type : "CONTROL_contactDialog",
                        data : false,
                    }),
                    customizeHead : false,
                    isShow        : !!props.store.getState().control.contactDialog,
                });
            },
            loading: props => ({
                isLoading:store.getState().control.loading
            }),
            dialog: props => {
                return {
                    customizeHead : false,
                    title         : "提示：",
                    content       : props.store.getState().control.contactWaring_content || "未知错误",
                    isShow        : !!props.store.getState().control.contactWaring_show,
                    close         : () => props.store.dispatch({
                        type : "CONTROL_contactWaring_show",
                        data : false,
                    }),
                };
            }
        },
        {
            label     : "账户管理-经办人修改成功页",
            href      : "manage/contact/success",
            className : "contact-success",
            component : props => <ManSc
                {...props}
                navConfig = {transIndex}
                field = {"更换经办人"}
                className ={"contact-success"}
            />
        },
    ]

})