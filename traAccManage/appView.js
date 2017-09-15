const React = require("react");
const ReactRouter = require("react-router");
const Link = ReactRouter.Link;
const IndexLink = ReactRouter.IndexLink;
const ReactTabs = require("../common/react-tab/react-tab");
const Tabs = ReactTabs.Tabs;
const Tab = ReactTabs.Tab;
const TabBody = ReactTabs.TabBody;
const config = require("./config")({})[CUR_FUND];
const appView = props => (
    <div className="main-container traAccManage">
        <div className="tabs-content">
            <Tabs>
                <div>
                    {
                        config.tabs.map((item, index) => {
                            const key = item.route.replace(/(\/).+/, "");
                            return (
                                <Link
                                    to = {item.route}
                                    className={`${window.location.hash.indexOf(key) >= 0 && "active"}`}

                                ><Tab>{item.name}</Tab></Link>
                            );
                        })
                    }
                    <TabBody>
                        {props.children}
                    </TabBody>
                </div>
            </Tabs>
        </div>
    </div>
);

module.exports = appView;