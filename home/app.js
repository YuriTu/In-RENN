require("../../css/common.scss");
require("./index.scss");
require("babel-polyfill");

const React = require("react");

const ReactDom = require("react-dom");

const Component = React.Component;

const Header = require("../common/header/header");

const RightNav = require("../common/right-nav/right-nav");

const Announcement = require("./announcement/announcement");

const Filter = require("./filter/monetary/filter");

const ReactTabs = require("../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const Open = require("./filter/open/openFund");

const CompareSystem = require("../common/compareSystem/compareSystem");

const C = new CompareSystem();

const openConfig = require("./config/openConfig");

const monetaryConfig = require("./config/monetaryConfig");

/** --- react-router 路由功能引入 --- **/
const ReactRouter = require("react-router");

const Router = ReactRouter.Router;

const Route = ReactRouter.Route;

const Link = ReactRouter.Link;

const IndexLink = ReactRouter.IndexLink;

const IndexRoute = ReactRouter.IndexRoute;

const hashHistory = ReactRouter.hashHistory;

/** --- react-router 路由功能引入 --- **/

window.BASE_STATIC_URL = "http://static.sofund.com/matrix/";

class App extends Component{

    constructor(){
        super();
        this.state = {
            flagUpdateRightNav : 0,
            compareList        : C.init(),
            paramUrl           : ""
        };
        this.openConfig = openConfig;
        this.monetaryConfig = monetaryConfig;
    }
    getParamUrl(paramUrl){
        this.setState({
            paramUrl: paramUrl
        });
    }
    renderTabContent(){
        let rs = this.openConfig;
        const tabContent = React.Children.map(this.props.children,
            (child) => {
                if (this.props.location.pathname.indexOf("monetary") >= 0 ){
                    rs = this.monetaryConfig;
                }
                
                return React.cloneElement(child, {
                    getParamUrl    : this.getParamUrl.bind(this),
                    compareList    : this.state.compareList,
                    addCompare     : this.addCompare.bind(this),
                    config         : rs,
                    saveChildState : this.saveChildState.bind(this)
                });
            } );

        return tabContent;
    }
    saveChildState(type, data){
        if (type === 1){
            this.monetaryConfig = data;
        } else if (type === 0){
            this.openConfig = data;
        }
    }
    addCompare(name, code){
        return C.addItemToRightNav.call(this, name, code);
    }
    componentWillMount(){
        C.listenerStorageEvent.call(this);
    }

    render(){
        return (
            <div>
                <Header></Header>
                <div className="main-content">
                    <Tabs>
                        <IndexLink to="/" activeClassName="active"><Tab>净值型基金</Tab></IndexLink>
                        <Link to="monetary" activeClassName="active"><Tab>货币理财</Tab></Link>
                        <TabBody>{this.renderTabContent()}</TabBody>
                    </Tabs>
                </div>

                <RightNav
                    ref="rightNav"
                    needUpdate = {this.state.flagUpdateRightNav}
                    addItem = {C.addItemToCompareSystem.bind(this)}
                    paramUrl = {this.state.paramUrl}
                ></RightNav>
                <Announcement></Announcement>
            </div>
        );
    }
}
ReactDom.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Open}/>
            <Route path="open" component={Open}/>
            <Route path="monetary" component={Filter}/>
        </Route>
    </Router>
, document.getElementById("content"));
