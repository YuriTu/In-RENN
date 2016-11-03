const React = require("react");

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;


const Filter = require("../../../../components/common/commonFilter/commonFilter");

const Option = require("../../../../components/common/inputOption/inputOption");

const Item = require("../../../../components/common/commonFilter/filterListItem/filterListItem");

const FundDetailView = ({ ...props }) => {
    "use strict";

    /**
     *
     * @param param 渲染类别
     * @param configName 渲染类型
     * @param typeName super 表明父元素
     * @returns {*}
     */
    const renderList = (param, configName, typeName) => {
        "use strict";
        return param.map((item) => {
            return <Item
                {...item}
                active = {props.interactive[configName][typeName]}
                sendData = { () => props.sendData(configName, typeName, item.code)}
                key = {item.name}
            ></Item>;
        });
    };

    const renderMainList = (config) => {
        "use strict";
        const item = config[1];
        item.option.getFirstData = (value) => props.getFirstData(item.code, value);
        item.option.getSecondData = (value) => props.getSecondData(item.code, value);
        item.option.handleBlur = (value) => props.handleBlur(item.code, value);
        // if (props.prevActiveSuper){
        item.option.warning = props.warning.fundScale;
        // }
        return (
            <div className="filterItem">
                <span className="itemName">{item.name}</span>
                <Filter
                    renderList = { () => renderList(item.superParamList, item.code, "activeItem") }
                    className = {"scaleSuper fundScale"}
                >

                    <Option
                        {...item.option}
                    ></Option>
                </Filter>
                </div>
        );
    };

    const renderMulChildList = (param, configName, typeName, childParam) => {
        "use strict";
        return param.map((item) => {
            return <Item
                {...item}
                active = {props.interactive[configName][typeName][childParam]}
                sendData = { () => props.sendData(configName, typeName, item.code)}
                key = {item.name}
            ></Item>;
        });
    };

    const renderMulList = (config) => {
        "use strict";
        const item = config[0];
        item.option.getFirstData = (value) => props.getFirstData(item.code, value);
        item.option.getSecondData = (value) => props.getSecondData(item.code, value);
        item.option.handleBlur = (value) => props.handleBlur(item.code, value);
        item.option.warning = props.warning.fundAchieve[props.prevActiveSuper];
        return (
            <div className="filterItem">
                <span className="itemName">{item.name}</span>
                <Filter
                    renderList = { () => renderList (item.superParamList, item.code, "superParamActiveItem") }
                    className = "superParam achieveSuper fundAchieve"
                >
                    <Filter
                        renderList = {() => renderMulChildList(item.childParamList, item.code, "childActive", props.prevActiveSuper) }
                        className = {(props.interactive[item.code].showChild ? "childParam achieveChild" : "childParam-none none")}
                    >
                        <Option
                            {...item.option}
                        ></Option>
                    </Filter>
                </Filter>
               </div>
        );
    };
    return (
        <Tabs>
            <Tab>基金概况</Tab>
            <TabBody>
                <div className="fpe-fundDetail clearfix" id = "fpe-fundDetail">
                    {renderMulList(props.config)}
                    {renderMainList(props.config)}
                </div>
            </TabBody>
        </Tabs>
    );
};

module.exports = FundDetailView;
