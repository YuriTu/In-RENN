const React = require("react");
const ReactRouter = require("react-router");
const Link = ReactRouter.Link;

const Box = require("../../common/boxContainer/boxContainer");

const Filter = require("../../../../common/commonFilter/commonFilter");

const Option = require("../../../../common/inputOption/inputOption");
const Item = require("../../../../common/commonFilter/filterListItem/filterListItem");


const FundCompanyView = ({ ...props }) => {
    "use strict";
    // 使用循环遍历，循环传参保留参数
    const renderList = (param, configName) => {
        return param.map((item) => {
            return <Item
                {...item}
                active = {props.interactive[configName].activeItem}
                sendData = {props.sendData.bind(this, configName, item.code)}
                key = {item.name}
            ></Item>;
        });
    };
    const renderMainList = (config) => {
        return config.map((item) => {
            item.option.getFirstData = (value) => props.getFirstData(item.code, value);
            item.option.getSecondData = (value) => props.getSecondData(item.code, value);
            item.option.warning = props.warning[item.code];
            return (
                <Box key = {item.name} name = {item.name} >
                    <Filter renderList = { () => renderList(item.superParamList, item.code) } className = {`${item.code}`}>
                        <Option
                            {...item.option}
                        ></Option>
                    </Filter>
                </Box>

            );
        });
    };


    return (
        <div className="fp-com-container clearfix">
            {renderMainList(props.config)}
            <div className="resultCount" >*根据当前筛选条件已为您筛选<span className="num">{props.resultCompanyCount}</span>家基金公司,
                <span className="num">{props.resultCount}</span>支基金
            </div>

            <Link to="FundPoolType" refresh="true" ><div className="fp-btn-prev submit" onClick={() => props.handlePrev()}>上一步</div></Link>
            <Link to="FundDetail"><div className="fp-btn-next submit" onClick={() => props.handleNext()}>下一步</div></Link>
        </div>
    );
};

module.exports = FundCompanyView;
