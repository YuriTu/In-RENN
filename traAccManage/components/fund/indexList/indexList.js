// 使用超集创造基础模板，所有组件使用平等一级，不设树形结构
const React = require("react");
const Nav = require("../../common/secLevNavigation/app");
const hashHistory = require("react-router").hashHistory;

require("./indexList.scss");

const buyIn = (name, code) => {
    hashHistory.push(`/fund/order/start?&fundName=${encodeURIComponent(name)}&fundCode=${encodeURIComponent(code)}`);
};
const IndexList = props => {
    const store = props.store, state = store.getState();
    // store.dispatch({
    //     type: "GET_FUND_INDEXLIST",
    //     data: window.CUR_FUND,
    // });
    return (
        <div className="component-container">
            <Nav config = {props.navConfig}/>
            <table className="purchase-tb">
                <thead>
                <tr>
                    {
                        props.thead.map(item => <th>{item}</th>)
                    }
                </tr>
                </thead>
                <tbody>
                {
                    !!state.request.FUND_indexList ?
                        state.request.FUND_indexList.map((item, index) => (
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
                        )) : <tr><td></td><td></td><td></td></tr>
                }
                </tbody>
            </table>
        </div>
    );
};


module.exports = IndexList;