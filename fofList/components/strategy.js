/**
 * Created by Yuri on 16/11/10.
 */


const React = require("react");
const Spline = require("../charts/charts-spline");
const ca = require("../../common/christina/christina");
const Component = React.Component;
require("./strategy.scss");

// 渲染零态
const renderNull = () => {
    return (
        <li className="isNull"><div>
            <img src="http://static.sofund.com/matrix/images/warning_zero.png" alt="null"/>
            <span> 您尚未开启FOF策略功能，联系客户经理定制专属策略服务</span>
        </div></li>
    );
};


// 渲染基础信息

const renderListBody = (data) => {
    let rs = (
        <table>
            <tbody>
            <tr>
                <td><span className="name">运行天数</span><span className="value">{data.days}天</span></td>
                <td><span className="name">累计收益</span>
                    <span className={`value ${data.cumulativeReturn >= 0 ? "positive" : "nagetive"}`}>
                        <span className={`icon ${data.cumulativeReturn >= 0 ? "positive icon-arrow-up" : "nagetive icon-arrow-down"}`}></span>
                        {data.cumulativeReturn}%
                    </span>
                </td>
                <td><span className="name">最大回撤率</span><span className="value">{data.maxDrawdown}%</span></td>
            </tr>
            <tr>
                <td><span className="name">年化波动率</span><span className="value">{data.volatility}%</span></td>
                <td><span className="name">夏普</span><span className="value">{data.sharpeRatio}</span></td>
                <td><span className="name">卡玛</span><span className="value">{data.karmaRatio}</span></td>
            </tr>
            </tbody>
        </table>
    );
    if (+data.nature === 0) {
        // 为货币基金
        rs = (
            <table>
                <tbody>
                <tr>
                    <td><span className="name">运行天数</span><span className="value">{data.days}天</span></td>
                    <td><span className="name">累计收益</span>
                        <span className={`value ${data.cumulativeReturn >= 0 ? "positive" : "nagetive"}`}>
                        <span className={`icon ${data.cumulativeReturn >= 0 ? "positive icon-arrow-up" : "nagetive icon-arrow-down"}`}></span>
                            {data.cumulativeReturn}%
                    </span>
                    </td>
                    <td><span className="name">万份收益</span><span className="value">{data.wanpernav}</span></td>
                </tr>
                <tr>
                    <td><span className="name">7日年化</span><span className="value">{data.yield7day}%</span></td>
                    <td><span className="name"></span><span className="value"></span></td>
                    <td><span className="name"></span><span className="value"></span></td>
                </tr>
                </tbody>
            </table>
        );
    }
    return rs;
};


// 主渲染逻辑
const renderStrategy = (props) => {

    let result = renderNull();
    // console.log(props.data)
    // console.log(ca.isEmptyObject(props.data)
    if (ca.isEmptyObject(props.data)){
        return result;
    }
    // 格式化参数
    const data = ca.objToArr(props.data);


    // 渲染函数
    if (data && data.length > 0){
        result = data.map((item, index) => {
            // if(item.hasOwnProperty())
            const i = index % 6;
            if (!!item.description){
                return <StrategyItem {...item} index = {index} i = {i} key = {`strategy_super_${index}`}></StrategyItem>;
            }
        });
        // result = [];
        // for(let index = 0;index < data.length;i++){
        //     const i = index % 6;
        //
        //     result.push(
        //         <StrategyItem {...data[i]} index = {index} i = {i} key = {`strategy_super_${index}`}></StrategyItem>
        //     );
        // }
    }
    return result;
};



const Strategy = (props) =>
    (
    <ul id="strategy">
        {renderStrategy(props)}
    </ul>
);

// 渲染组件
class StrategyItem extends Component{
    constructor(props){
        super();
        this.state = {
            showMore: false,
        };
        // const text = "人人金服货币轮动策略采用强化学习中的一类序列选择优化算法，对货币基金周期性的选择过程建模，利用全市场货币基金历史收益表现和投资组合的历史持有记录，动态调整组合持仓，以最大化组合持有期间的总体收益。管理资金规模，调仓频率和组合的基金数目是策略运行时需要提供的参数。        以管理10亿资金，持有10支货币基金（每支基金平均容纳一亿资金），每月初调整组合持仓为例，从xxxx年至今，人人金服策略的年化收益率比市场同类平均高xxbps。";

        const text = props.description || "";
        this.maxLength = 71;
        this.completeText = text;
        this.subText = this.completeText.substr(0, this.maxLength);
        this.showSubText = this.completeText.length > this.maxLength ? this.subText : this.completeText;
        this.textList = [this.showSubText, this.completeText];

        this.toggle = () => {
            this.setState({
                showMore: !this.state.showMore,
            });
        };
    }

    render(){
        return (
            <li key={`strategy_${this.props.index}`}>
                <div className="strategy str-container clearfix">
                    <div className="left info">
                        <div className="s-header">
                            <span className="name">{this.props.name}</span>
                            <span className="group">{this.props.sourceName}</span>
                            <span className="detail"><a href={`/web/strategyDetail?fid=${this.props.id}`}>查看详情>></a></span>
                        </div>
                         <div className="s-body">
                             {renderListBody(this.props)}
                         </div>
                        <div className="s-footer">
                            {this.textList[+(this.state.showMore)]}
                            {/* <span*/}
                                {/* className={`ellipsis ${this.state.showMore ? "showMore" : "hideMore"}*/}
                                            {/* ${this.completeText.length > this.maxLength ? "showIcon" : "hideIcon"}`}*/}
                                {/**/}
                            {/* >{this.state.showMore ? <i className={"icon icon-up22 "}></i> : "..."}</span>*/}
                            <span className={`showIcon ${this.completeText.length > this.maxLength ? "showIcon" : "hideIcon"}`}>...</span>
                        </div>
                    </div>
                    <div className="right infoCharts">
                        <div className="chartTitle">
                            <div className="title">近3月累计收益</div>
                            <div className={`label label_${this.props.i}`}>{this.props.label}</div>
                        </div>

                        <Spline
                            chartData = {this.props.income}

                        ></Spline>
                    </div>
                </div>
            </li>
        );
    }

}

// Strategy.prototype = {
//
// };

module.exports = Strategy;