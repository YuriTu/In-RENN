require("./purchase.scss");

const React = require("react");

const Service = require("../../common/service/service");
const S = new Service();

const hashHistory = require("react-router").hashHistory;
const config = require("./purchaseConfig");
const buyIn = (name, code) => {
    hashHistory.push(`/purchase/order?&fundName=${encodeURIComponent(name)}&fundCode=${encodeURIComponent(code)}`);
};

const renderTh = (list) => {
    return list.map((item) => {
        return (<th>{item}</th>);
    });
};

class PurchaseList extends React.Component {
    constructor(){
        super();
        this.state = {
            availList: null
        };
        this.fundCompany = window.CUR_FUND;
        this.renderList = (list) => {
            if (!list){
                return (<tr><td></td><td></td><td></td></tr>);
            }
            return list.map((item, index) => {
                return (
                    <tr key = {`tr_${index}`}>
                        <td>{item.fundCode}</td>
                        <td>{item.fundName}</td>
                        <td><a
                            href="javascript:;"
                            onClick={
                                () => buyIn(item.fundName, item.fundCode)
                            }
                        >申购</a></td>
                    </tr>
                );
            });
        };
    }
    componentDidMount(){
        S.getAllFund(this.fundCompany, {}).then((rs) => {
            let list = [];
            if (rs.code === "0"){
                list = rs.data.map((item, index) => {
                    return ({
                        fundCode : item.fundCode,
                        fundName : item.fundName
                    });
                });
                this.setState({
                    availList: list,
                });
            }
        });
    }
    render(){
        return (
            <table className="purchase-tb">
                <thead>
                <tr>
                    {renderTh(config.thead)}
                </tr>
                </thead>
                <tbody>
                    {this.renderList(this.state.availList)}
                </tbody>
            </table>
        );
    }
}

module.exports = PurchaseList;