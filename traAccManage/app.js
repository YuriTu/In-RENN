/**
 * Created by Yuri on 17/06/01.
 * 有机会重构抽象程度太差
 */
window.CUR_FUND = location.pathname.split("/")[1];
// window.CUR_FUND = "zhongrong";
window.uid = window.localStorage.getItem("uid");


const React = require("react");

const AppView = require("./appView");

const createStore = require("../common/fake-redux/fakex").createStore;

const _ = require("../common/util/util");

const ROOT = require("./reducers/root");

const log = require("../common/fake-redux/log");

const CheckObject = require("../common/accountCheckUrl/accountCheckUrl");

const Form = require("./components/common/form/form");

const hashHistory = require("react-router").hashHistory;

const init = require("./init");

// 交易记录组件
const RecordList = require("../transactionAccount/transactionRecord/recordControl");
require("../../css/common.scss");
require("./basic.scss");

const Store = createStore(ROOT, {
    form    : {},
    request : {},
    control : {},
});


Store.dispatch = log(Store);

const config = require("./config")(Store)[CUR_FUND];
window.config = config;
const Check = new CheckObject(config.nameEn);

const checkUrl = Check.checkUrl;
// const checkUrl = "";


const app = store => (
    class App extends React.Component {
        constructor(props){
            super();
            this.state = {
                ...Store.getState()
            };
        }
        // shouldComponentUpdate(nextProps, nextState){
        //     return !_.isObjectEqual(nextState, this.state);
        // }
        componentDidMount(){
            Store.subscribe(() => {
                this.setState({ ...Store.getState() });
            });
        }
        render(){
            return (
                <AppView >
                    {
                        React.cloneElement(this.props.children, {
                            store  : store,
                            key    : location.hash,
                            config : config,
                        })
                    }
                </AppView>
            );
        }

    }
);

const createRoute = config.components.map((item, index) => {
    if (!!item.isForm){
        return {
            path      : item.href,
            component : props => <Form
                {...item}
                key = {index}
                store = {props.store}
                check = ""
                components = {item.components}
            />,
            onEnter: (...args) => {
                checkUrl(...args);
                item.onEnter && item.onEnter();

            },
            onLeave: () => {
                item.onLeave && item.onLeave();
            }
        };
    }
    return {
        path      : item.href,
        component : props => item.component(props),
        onEnter   : checkUrl,
    };
}).concat([{
    path      : "record",
    component : RecordList,
    onEnter   : checkUrl,
}]);


init(window.CUR_FUND,Store,createRoute,app);


const initListener = () => {
    hashHistory.listenBefore((rs) => {
        // 只要第二项不一样，就清除一遍form
        const after = rs.pathname.split("/")[2];
        const before = location.hash.split("/")[2];
        const beforeMain = location.hash.split("/")[1];
        if (after !== before){
            Store.dispatch({
                type: "CLAEAR_FORM"
            });
        }
    });
};
initListener();

