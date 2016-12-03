/**
 * Created by Yuri on 16/11/16.
 */
require("./incomeRate.scss");

const React = require("react");

const ch = require("../../common/christina/christina");

const Spline = require("../../common/charts/spline");

const TimeSelect = require("../../common/time-select/time-select");

const Chart = require("../../hold/box/box-chart-row");

const action = require("./incomeRateAction");

const Filter = require("../../common/filter/filter");

const timeRange = [{
    index : 1,
    name  : "1M"
}, {
    index : 3,
    name  : "3M"
}, {
    index : 6,
    name  : "6M"
}, {
    index : 12,
    name  : "1Y"
}, {
    index : 24,
    name  : "2Y"
}, {
    index : 0,
    name  : "最大"
}];
const comparingList = [{
    name : "沪深300",
    code : 300001
}];

let chartData;
let curentTime = 1;
const config = {
    chart: {
        backgroundColor: "#292f33"
    },
    tooltip: {
        formatter: function () {
            const PositionIndex = this.points[0].point.index;
            // const is
            const render = (data) => {
                return data.map((item, index) => {
                    const income = item.series.yData[PositionIndex];
                    const name = item.series.name;
                    const worth = chartData[index].yData[PositionIndex];
                    const color = item.color;
                    const colorList = ["#9EACBF", "#FC5858", "#5BBF7E"];
                    const formatIncome = new Filter(income);
                    const lastChild = index === data.length - 1 ? "margin-bottom:0px" : "";
                    return (
                        `<li style="margin-bottom:-14px;${lastChild}">
                            <span style="padding-left:1px;border-left:3px solid ${color};height:15px;"></span>
                            <span style="padding:2px 0 2px 3px;;color: #9EACBF;min-width: 120px;display: inline-block">${name}</span>
                            <span style="padding:2px 0 2px 20px;color: #9EACBF">${formatIncome.numberFixedDigit(4).result}   (
                             <span style="font-weight: bolder;color:${colorList[ch.judgeColor(worth)]};">
                              ${ch.judgeColor(worth) < 2 ? "+" : ""}${worth} %
                             </span>)         
                            </span>
                        </li>`
                    );

                });
            };
            return (
                `  <div>
                        <div
                        style="color:#9EACBF;padding:2px 0;font-size:12px;display:inline-block;height:13px;margin-left:0px;margin-bottom: 5px;vertical-align:middle;font-weight: bold"
                        >${this.x}</div>
                        <ul className = "incomeRateTable" style="margin-top:0px;">
                            ${render(this.points)}
                        </ul>
                    </div>
                    
                    
                `

            );
        }
    },
};

const appView = (props) => {
    chartData = props.incomeRateData && (props.incomeRateData.chartData || {});
    return (
        <div className="incomeRate">
            <Chart
                changeTimeRange={(index = 1) => {
                    props.dispatch(action.startLoading());
                    props.dispatch(action.changeTimeRange(timeRange[index].index));
                }}
                changeComparingList={(data, index = 1) => {
                    props.dispatch(action.startLoading());
                    setTimeout(() => props.dispatch(action.changeComparingList(data, timeRange[index].index)), 1000 / 60);
                }}
                isLoading={props.incomeRateData && (props.incomeRateData.loading)}
                comparingList={comparingList}
                chartData={props.incomeRateData && (props.incomeRateData.chartData || {})}
                timeRangeList={timeRange}
                chartConfig = {config}
                curSelectIndex = {1}
            />
        </div>
    );
};
appView.defaultProps = {
    incomeRateData: {
        chartData : {},
        loading   : false,
    }
};

module.exports = appView;

//
// <span
//     style="color:#9EACBF;padding:2px 0;font-size:12px;display:inline-block;height:13px;margin-left:0px;background:{series.color};vertical-align:middle;"
// >${this.x}</span>
// <table className = "incomeRateTable" style="display:table;margin-top:0px;">
//     <tbody>
//     ${render(this.points)}
//     </tbody>
//
//     </table>