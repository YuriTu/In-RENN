const React = require("react");

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const FundTypeList = require("../../../common/commonFilter/fundChildType/fundChildType");
const FundTypeView = ({ ...props }) => {
    "use strict";
    return (
        <Tabs>
            <Tab>基金类型</Tab>
            <TabBody>
                <div className="fpe-fundType clearfix" id = "fpe-fundType">
                    <div className="fundTypeName">
                        <span className="itemName">管理类型:</span>
                        <span>{props.name}</span>
                    </div>
                    <div className="typeList">
                        <FundTypeList
                            key = {"fundType"}
                            config = {props.config}
                            result = {props.result}
                            handleClick = {props.changeChildType}
                        ></FundTypeList>
                    </div>
                    </div>
            </TabBody>
        </Tabs>
    );
};

module.exports = FundTypeView;
