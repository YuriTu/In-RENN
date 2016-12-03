/**
 * Created by Yuri on 16/11/14.
 */
require("./basicInfo.scss");

const React = require("react");

const ch = require("../../common/christina/christina");

const until = require("../../common/util/util");

const renderInfo = (data, nature) => {
    if (ch.isEmptyObject(data)){
        return;
    }
    const isIE = until.isIE();
    let rs = (
        <ul>
            <li><span className="name">运行天数</span><span className="value">{data.days}<span className="unit">天</span></span></li>
            <li><span className="name">累计收益</span>
                <span className={`value ${data.cumulativeReturn >= 0 ? "positive" : "nagetive"}`}>
                        <span className={`icon ${data.cumulativeReturn >= 0 ? "positive icon-arrow-up" : "nagetive icon-arrow-down"} ${isIE ? "ieHack" : ""}`}></span>
                    {data.cumulativeReturn}<span className="unit">%</span>
                    </span></li>
            <li><span className="name">最大回撤率</span>
                <span className="value">{data.maxDrawdown}<span className="unit">%</span></span>

            </li>
            <li><span className="name">年化波动率</span>
                <span className="value">{data.volatility}<span className="unit">%</span></span>

            </li>
            <li><span className="name">夏普</span><span className="value">{data.sharpeRatio}</span></li>
            <li><span className="name">卡玛值</span><span className="value">{data.karmaRatio}</span></li>
        </ul>
    );
    if (nature && +nature.nature === 0){
        // 是货币型
        rs = (
            <ul>
                <li><span className="name">运行天数</span><span className="value">{data.days}<span className="unit">天</span></span></li>
                <li><span className="name">累计收益</span>
                    <span className={`value ${data.cumulativeReturn >= 0 ? "positive" : "nagetive"}`}>
                        <span className={`icon ${data.cumulativeReturn >= 0 ? "positive icon-arrow-up" : "nagetive icon-arrow-down"} ${isIE ? "ieHack" : ""}`}></span>
                        {data.cumulativeReturn}<span className="unit">%</span>
                    </span></li>
                <li><span className="name">万分收益</span><span className="value">{data.wanpernav}</span></li>
                <li><span className="name">七日年化</span><span className="value">{data.yield7day}<span className="unit">%</span></span></li>
                <li><span className="name"></span><span className="value"></span></li>
                <li><span className="name"></span><span className="value"></span></li>
            </ul>
        );
    }
    return rs;
};



const appView = (props) => {
    const toggle = () => {
        props.dispatch({ type: "TOGGLE_TEXT" });
    };
    const renderText = (data) => {
        if (!data.strategyInfo){
            return;
        }
        const completeText = data.strategyInfo.description;
        // const completeText = "人人金服货币轮动策略采用强化学习中的一类序列选择优化算法，对货币基金周期性的选择过程建模，利用全市场货币基金历史收益表现和投资组合的历史持有记录，动态调整组合持仓，以最大化组合持有期间的总体收益。管理资金规模，调仓频率和组合的基金数目是策略运行时需要提供的参数。        以管理10亿资金，持有10支货币基金（每支基金平均容纳一亿资金），每月初调整组合持仓为例，从xxxx年至今，人人金服策略的年化收益率比市场同类平均高xxbps。人人金服货币轮动策略采用强化学习中的一类序列选择优化算法，对货币基金周期性的选择过程建模，利用全市场货币基金历史收益表现和投资组合的历史持有记录，动态调整组合持仓，以最大化组合持有期间的总体收益。管理资金规模，调仓频率和组合的基金数目是策略运行时需要提供的参数。        以管理10亿资金，持有10支货币基金（每支基金平均容纳一亿资金），每月初调整组合持仓为例，从xxxx年至今，人人金服策略的年化收益率比市场同类平均高xxbps。";
        // const completeText = "六六六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十"
        // console.log(completeText.length)
        // 1200px两行极限 186 汉字
        const maxLength = 186;
        const subText = completeText.substr(0, maxLength);
        const showSubText = completeText.length > maxLength ? subText : completeText;
        const showText = data.showMore ? completeText : showSubText;

        return (
            <div className="description">
                {showText}
                <span
                    className={`ellipsis ${data.showMore ? "showMore" : "hideMore"} ${completeText.length > maxLength ? "showIcon" : "hideIcon"}`}
                    onClick={() => toggle()}
                >{data.showMore ? <i className={"icon icon-up-small "}></i> : <i className={"icon icon-down-small "}></i>}</span>
            </div>
        );
    };
    return (
        <div className="basicInfo">
            {renderInfo(props.data.strategyIndicator, props.data.strategyInfo)}
            {renderText(props.data)}

        </div>
    );
};

// appView.propTypes = {
//     data        : React.PropTypes.array,
//     description : React.propTyps.str,
// };
// appView.defaultProps = {
//     data:{
//         strategyInfo:{
//             needIcon:true,
//             showMore:false,
//         }
//     }
// }

module.exports = appView;