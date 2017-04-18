require("./purchase.scss");

const React = require("react");

const _ = require("../../common/christina/christina");
const Filter = require("../../common/filter/filter");
const Service = require("../../common/service/service");
const S = new Service();
// TODO::uid更改
const formateNumber = (paramName) => {
    if (!paramName){
        return "";
    }
    const num = new Filter(parseFloat(_.getUrlParam(paramName)));
    return num.dataToLocalString().result;
};
const judgeCompany = (index) => {
    switch (index){
        case "guangfa":{
            return "广发";
        }
    }
};



class confirmOrder extends React.Component{
    constructor(){
        super();
        this.state = {
            user    : "",
            account : "",
            bank    : "",
        };
    }

    componentWillMount(){
        S.getAccountInfo(window.CUR_FUND, {
            matrixID: window.uid,
            // matrixID: 200,
        }).then((rs) => {
            if (rs.resultCode === "0"){
                this.setState({
                    user      : rs.custName,
                    account   : rs.bankAccount,
                    bank      : rs.bankBranch,
                    diffPayNo : rs.diffPayNo,
                    samePayNo : rs.samePayNo,
                });
            }
        });
    }

    render(){
        return (
            <div className="order-wrap">
                <div className="confirm-order">
                    <div className="confirm-form">
                        <div className="label">{judgeCompany(window.CUR_FUND)}基金收款账户:</div>
                        <div>
                            <label>户名:</label>
                            <span className="c-user">{this.state.user}</span>
                        </div>
                        <div>
                            <label>银行账号:</label>
                            <span className="c-account">{this.state.account}</span>
                        </div>
                        <div>
                            <label>开户行:</label>
                            <span className="c-acount-bank">{this.state.bank}</span>
                        </div>
                        <div>
                            <label>跨行大额支付号:</label>
                            <span className="c-acount-bank">{this.state.diffPayNo}</span>
                        </div>
                        <div>
                            <label>同行大额支付号:</label>
                            <span className="c-acount-bank">{this.state.samePayNo}</span>
                        </div>
                    </div>
                </div>
                <div className="confirm-tips">
                    <p>您已成功提交
                        <span className="red-font">{formateNumber("amount")}</span>
                        元的{_.getUrlParam("fundName")}申购申请。
                        请在交易日当天15:00点之前，将{formateNumber("amount")}元申购款汇款至{judgeCompany(window.CUR_FUND)}基金管理有限公司直销专户。</p>
                    <p>（请认/申购汇款时务必注明汇款人姓名，例如：“某某认购/申购{judgeCompany(window.CUR_FUND)}基金“，请务必使用支付银行账号进行转账）</p>
                </div>
            </div>
        );
    }
}
module.exports = confirmOrder;