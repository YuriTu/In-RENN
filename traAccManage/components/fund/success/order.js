/**
 * 基金申购成功
 * Created by renren on 2017/6/6.
 */
const Nav = require("../../common/secLevNavigation/app");
const Process = require("../../common/processBar/app");
const _ = require("../../../../common/christina/christina");
const Filter = require("../../../../common/filter/filter");
require("./order.scss");
const formateNumber = (paramName) => {
    if (!paramName){
        return "";
    }
    const num = new Filter(parseFloat(_.getUrlParam(paramName)));
    return num.dataToLocalString().result;
};
module.exports = props => {
    const state = props.store.getState().request.FUND_accountInfo;
    const { name, account, branch, diffPayNo, samePayNo } = { ...state };
    return (
        <div className="component-container">
            <Nav config = {props.navConfig}/>
            <Process config = {props.process}/>
            <div className="confirm-order order-success">
                <div className="confirm-form">
                    <div className="label">{window.config.name}收款账户:</div>
                    <div>
                        <label>户名:</label>
                        <span className="c-user">{name}</span>
                    </div>
                    <div>
                        <label>银行账号:</label>
                        <span className="c-account">{account}</span>
                    </div>
                    <div>
                        <label>开户行:</label>
                        <span className="c-acount-bank">{branch}</span>
                    </div>
                    <div>
                        <label>跨行大额支付号:</label>
                        <span className="c-acount-bank">{diffPayNo}</span>
                    </div>
                    {
                        samePayNo && <div>
                            <label>同行大额支付号:</label>
                            <span className="c-acount-bank">{samePayNo}</span>
                        </div>
                    }
                </div>
            </div>
            <div className="confirm-tips">
                <p>您已成功提交
                    <span className="red-font">{formateNumber("amount")}</span>
                    元的{_.getUrlParam("fundName")}申购申请。
                    请在交易日当天15:00点之前，将{formateNumber("amount")}元申购款汇款至{window.config.name}管理有限公司直销专户。</p>
                {
                    (window.config.name !== "中融基金") && <p>（请认购/申购汇款时务必注明汇款人姓名，例如：“某某认购/申购{window.config.name}“，请务必使用支付银行账号进行转账）</p>
                }

            </div>
        </div>
    );
};