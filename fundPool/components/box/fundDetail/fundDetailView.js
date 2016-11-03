const React = require("react");

const Component = React.Component;

const ReactRouter = require("react-router");

const Link = ReactRouter.Link;

const Box = require("../../common/boxContainer/boxContainer");

const Filter = require("../../../../common/commonFilter/commonFilter");

const Option = require("../../../../common/inputOption/inputOption");

const Item = require("../../../../common/commonFilter/filterListItem/filterListItem");

const FundDetailView = ({ ...props }) => {
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
        item.option.warning = props.warning.fundScale;
        return (
            <Box key = {item.name} name = {item.name}>
                <Filter
                    renderList = { () => renderList(item.superParamList, item.code, "activeItem") }
                    className = {`${item.code}`}
                >
                    <Option
                        refs = {item.code}
                        key = {0}
                        {...item.option}
                    ></Option>
                </Filter>
            </Box>
        );
    };
    // 渲染子集
    const renderMulChildList = (param, configName, typeName, childParamValue) => {
        let childParam = childParamValue;
        "use strict";
        const list = ["jn", "m", "m3", "m6", "y", "zj"];
        let flag = false;
        if (childParam === null){
            flag = true;
        }
        return param.map((item, index) => {
            if (flag){
                childParam = list[index];
            }
            // console.log(props.interactive[configName][typeName])
            // console.log(childParam)
            return <Item
                {...item}
                active = {props.interactive[configName][typeName][childParam]}
                sendData = { () => props.sendData(configName, typeName, item.code)}
                key = {item.name}
            ></Item>;
        });
    };
    // 处理收益的复选
    const renderMulList = (config) => {
        "use strict";
        const item = config[0];
        item.option.getFirstData = (value) => props.getFirstData(item.code, value);
        item.option.getSecondData = (value) => props.getSecondData(item.code, value);
        if (props.prevActiveSuper){
            item.option.warning = props.warning.fundAchieve[props.prevActiveSuper];
        }
        return (
            <Box key = {item.name} name = {item.name}>
                <Filter
                    renderList = { () => renderList (item.superParamList, item.code, "superParamActiveItem") }
                    className = {`superParam ${item.code} achieveSuper`}
                >
                    <Filter
                        renderList = {() => renderMulChildList(item.childParamList, item.code, "childActive", props.prevActiveSuper) }
                        className = {(props.interactive[item.code].showChild ? "childParam" : "childParam-none none")}
                    >
                        <Option
                            {...item.option}
                        ></Option>
                    </Filter>
                </Filter>
            </Box>
        );
    };
    const renderLink = (route) => {
        "use strict";
        return ( 
            <Link to= {route}><div className="fp-btn-next submit" onClick={() => props.handleNext()}>下一步</div></Link>
        );
    };
    const renderSkipLink = (route) => {
        "use strict";
        return (
            <Link to= {route}><div className="fp-btn-skip submit" onClick={() => props.handleNext(1)}>跳过</div></Link>
        );
    };


    return (
        <div className="fp-de-container clearfix">
            {renderMulList(props.config)}
            {renderMainList(props.config)}
            <div className="resultCount" >*根据当前筛选条件已为您筛选<span className="num">{props.resultCompanyCount}</span>家基金公司,
                <span className="num">{props.resultCount}</span>支基金
            </div>
            <Link to="FundCompany"><div className="fp-btn-prev submit" onClick={() => props.handlePrev()}>上一步</div></Link>
            {renderLink(props.route)}
            {renderSkipLink(props.route)}
        </div>
    );

};
FundDetailView.propType = {
    config: React.PropTypes.array
};

module.exports = FundDetailView;
