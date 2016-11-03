const React = require("react");

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const Filter = require("../../../../components/common/commonFilter/commonFilter");

const Option = require("../../../../components/common/inputOption/inputOption");

const Item = require("../../../../components/common/commonFilter/filterListItem/filterListItem");

const fundCompanyView = ({ ...props }) => {
    "use strict";

    const renderList = (param, configName) => {
        return param.map((item) => {
            return <Item
                {...item}
                active = {props.interactive[configName].activeItem}
                sendData = {() => props.sendData(configName, item.code)}
                key = {item.name}
            ></Item>;
        });
    };
    const renderFilterList = (config) => {
        return config.map((item) => {
            item.option.getFirstData = (value) => props.getFirstData(item.code, value);
            item.option.getSecondData = (value) => props.getSecondData(item.code, value);
            item.option.handleBlur = (value) => props.handleBlur(item.code, value);
            item.option.warning = props.warning[item.code];
            return (
                <div className={`filterItem ${item.code}`} key = {item.name} >
                    <span className="itemName">{item.name}</span>
                    <Filter renderList = {() => renderList(item.superParamList, item.code) }>
                        <Option
                            {...item.option}
                        ></Option>
                    </Filter>
                </div>
            );
        });
    };
    return (
        <Tabs>
            <Tab>基金公司</Tab>
            <TabBody>
                <div className="fpe-fundCompany clearfix" id="fpe-fundCompany">
                    {renderFilterList(props.config)}
                </div>
            </TabBody>
        </Tabs>
    );
};

module.exports = fundCompanyView;
