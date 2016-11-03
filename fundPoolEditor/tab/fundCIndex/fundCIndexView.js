const React = require("react");

const Component = React.Component;

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const Filter = require("../../../../components/common/commonFilter/commonFilter");

const Option = require("../../../../components/common/inputOption/inputOption");

const Item = require("../../../../components/common/commonFilter/filterListItem/filterListItem");


const FundCIndexView = ({ ...props }) => {
    "use strict";
    const needActive = (list, code) => {
        let activeCode = "";
        for (const key in list){
            if ((list[key].active === true) && key === code){
                activeCode = key;
            }
        }
        return activeCode;
    };

    // 使用循环遍历，循环传参保留参数
    const renderList = (param, configName, typeName) => {
        return param.map((item) => {
            return <Item
                {...item}
                active = {needActive(props.interactive[configName], item.code) }
                sendData = { () => props.sendData(configName, typeName, item.code)}
                key = {`${configName} - ${item.name}`}
            ></Item>;
        });
    };
    // 渲染二级项目
    const renderChildList = (param, configName) => {
        return param.map((item) => {
            return <Item
                {...item}
                active = {props.interactive[configName][props.activeSuperItem].child}
                sendData = { () => props.sendChildData(configName, item.code, props.activeSuperItem)}
                key = {`${configName} : ${item.name}`}
            ></Item>;
        });
    };
    const renderMainList = (config) => {

        return config.map((item) => {
            item.option.getFirstData = (value) => props.getFirstData(item.code, value);
            item.option.getSecondData = (value) => props.getSecondData(item.code, value);

            if (props.activeSuperItem !== "all") {
                item.option.warning = props.warning[item.code][props.activeSuperItem];
            }
            return (
                <div className="filterItem" key={item.name}>
                    <span className="itemName">{item.name}</span>
                    <Filter
                        renderList = { () => renderList (item.superParamList, item.code, "superParamActiveItem") }
                        className = {`superParam fci-super ${item.code}`}
                    >
                        <Filter
                            renderList = {() => renderChildList(item.childParamList, item.code) }
                            className = {(props.interactive[item.code].showChild ? "childParam achieveChild" : "childParam-none none ")}
                        >
                            <Option
                                {...item.option}
                            ></Option>
                        </Filter>
                    </Filter>
                </div>
            );
        });
    };

    return (
        <Tabs>
            <Tab>综合指标</Tab>
            <TabBody>
                <div className="fpe-fundCIndex clearfix" id = "fpe-fundCIndex">
                    {renderMainList(props.config)}
                </div>
            </TabBody>
        </Tabs>

    );
};

module.exports = FundCIndexView;
