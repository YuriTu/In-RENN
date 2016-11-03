const React = require("react");

const ReactTabs = require("../../../common/react-tab/react-tab");

const Tabs = ReactTabs.Tabs;

const Tab = ReactTabs.Tab;

const TabBody = ReactTabs.TabBody;

const fundNameView = ({ ...props }) => {
    "use strict";
    return (
    <Tabs>
        <Tab>基金池管理</Tab>
        <TabBody>
            <div className="fpe-fundName clearfix" id="fpe-fundName">
                <div className="name">
                    <span>更改基金池名称: </span>
                    <input type="text" id="nameInput"
                           value={props.defaultName}
                           onChange={(e) => props.changeInput(e.target.value)}
                    />
                    <i className="icon icon-edit2" onClick={props.focusInput}></i>
                </div>
                <div className="btn deleteBtn" onClick={props.handleDelete}>
                    <i className="icon icon-garbage"></i>
                    <span>删除</span>
                </div>
            </div>
        </TabBody>
    </Tabs>

    );
};


module.exports = fundNameView;
