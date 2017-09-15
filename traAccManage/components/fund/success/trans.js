/**
 * Created by renren on 2017/6/12.
 */

const Nav = require("../../common/secLevNavigation/app");
const _ = require("../../../../common/christina/christina");
require("./order.scss");
module.exports = props => {
    const state = props.store.getState().request.FUND_accountInfo;
    const data = JSON.parse(window.sessionStorage.getItem("transSuccess"));
    const { transout, transin, amount, transDate, confirmDate, status } = { ...data };
    return (
        <div className="component-container">
            <Nav config = {props.navConfig}/>
            <div className="confirm-trans">
                <div className="confirm-form">
                    <div>
                        <label>转出基金代码:</label>
                        <span className="c-user">{transout.fundName} {transout.fundCode}</span>
                    </div>
                    <div>
                        <label>目标基金代码:</label>
                        <span className="c-account">{transin.fundName} {transin.fundCode}</span>
                    </div>
                    <div>
                        <label>转换份额:</label>
                        <span className="c-acount-bank">{amount}</span>
                    </div>
                    <div>
                        <label>基金交易日期:</label>
                        <span className="c-acount-bank">{transDate}</span>
                    </div>
                    <div>
                        <label>份额确认日:</label>
                        <span className="c-acount-bank">{confirmDate}</span>
                    </div>
                    <div>
                        <label>转换状态:</label>
                        <span className="c-acount-bank">{status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};