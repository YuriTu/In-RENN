
const React = require("react");

const Component = React.Component;

const ReactRouter = require("react-router");

const Link = ReactRouter.Link;

const Box = require("../../common/boxContainer/boxContainer");

const Filter = require("../../../../common/commonFilter/commonFilter");

const Option = require("../../../../common/inputOption/inputOption");

const Item = require("../../../../common/commonFilter/filterListItem/filterListItem");


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
                key = {item.name}
            ></Item>;
        });
    };
    // 渲染二级项目
    const renderChildList = (param, configName) => {
        let prevt;
        let activeItem;
        return param.map((item) => {
            prevt = props.interactive[configName].currentActive;
            if (!prevt){
                prevt = null;
                activeItem = null;
            } else {
                activeItem = props.interactive[configName][prevt].child;
            }
            return <Item
                {...item}
                active = {activeItem}
                sendData = { () => props.sendChildData(configName, item.code, props.activeSuperItem)}
                key = {item.name}
            ></Item>;
        });
    };
    const renderMainList = (config) => {

        return config.map((item) => {
            item.option.getFirstData = (value) => props.getFirstData(item.code, value);
            item.option.getSecondData = (value) => props.getSecondData(item.code, value);
            if (props.activeSuperItem !== "all"){
                item.option.warning = props.warning[item.code][props.activeSuperItem];
            }

            return (
                <Box key = {item.name} name = {item.name}>
                    <Filter
                        renderList = { () => renderList (item.superParamList, item.code, "superParamActiveItem") }
                        className = {`superParam ${item.code}`}
                    >
                        <Filter
                            renderList = {() => renderChildList(item.childParamList, item.code) }
                            className = {(props.interactive[item.code].showChild ? "childParam" : "none")}
                        >
                            <Option
                                {...item.option}
                            ></Option>
                        </Filter>
                    </Filter>
                </Box>
            );
        });
    };

    return (
        <div className="fp-ci-container clearfix">
            {renderMainList(props.config)}
            <div className="resultCount" >*根据当前筛选条件已为您筛选<span className="num">{props.resultCompanyCount}</span>家基金公司,
                <span className="num">{props.resultCount}</span>支基金
            </div>
            <Link to="FundDetail"><div className="fp-btn-prev submit" onClick={() => props.handlePrev()}>上一步</div></Link>
            <Link to="FundResult"><div className="fp-btn-next submit" onClick={() => props.handleNext()}>下一步</div></Link>
            <Link to="FundResult"><div className="fp-btn-skip " onClick={() => props.handleNext(1)}>跳过</div></Link>
        </div>
    );
};

module.exports = FundCIndexView;
