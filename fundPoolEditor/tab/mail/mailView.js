const React = require("react");

const Component = React.Component;

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;
// TODO:
const MailSet = require("../../../common/mail-set/mailSet");

const mailsSetController = require("../../../common/mail-set/mailSetController");

const MailsSet = mailsSetController(MailSet);

const MailView = ({ ...props }) => {
    "use strict";
    return (
        <Tabs>
            <Tab>订阅管理</Tab>
            <TabBody>
                <div className="mail clearfix" id = "fpe-mail">
                    <div className="mailLeft">
                        <span className="itemName">发送邮箱:</span>
                    </div>
                    <div className="mailRight">
                        <MailsSet
                            poolId = {props.poolId ? props.poolId : ""}
                            getMails = {props.getMails}
                        />
                    </div>
                    <div className={`mail-warning ${props.warning ? "" : " hide"}`}>请至少添加一个邮箱</div>
                </div>
            </TabBody>
        </Tabs>
    );
};

module.exports = MailView;
