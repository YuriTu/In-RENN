/**
 * Created by Lever on 16/6/22.
 */
const React = require("react");

const Component = React.Component;

const Highcharts = require("highcharts");
// 引入基本配置
const BaseCharts = require("../../common/charts/charts_base_config");

const Filter = require("../../common/filter/filter");

const F = new Filter();
// 基础规范颜色
const COLOR_ARR = ["#7ab4fa", "#ff40ff", "#9a37ff", "#4683eb", "#00fdff", "#f2c314", "#e8922a", "#ce3f19", "#00999a", "#9ec5ea", "d9d9d9"];

const chartOption = BaseCharts.charts.strategyIncomeOption;

class Spline extends Component{
    renderChart(chartData = this.props.chartData || { xAxis: [], yAxis: [] } ){
        chartOption.chart.type = "spline";
        chartOption.chart.spacingBottom = 8;
        chartOption.chart.spacingTop = 32.5;
        chartOption.chart.spacingLeft = 20;
        chartOption.chart.spacingRight = 20;

        chartOption.chart.height = 201;

        chartOption.chart.marginRight = 20;

        chartOption.chart.className = "chartSpline";

        chartOption.plotOptions = {
            area: {
                fillColor: {
                    linearGradient : [0, 40, 0, 200],
                    stops          : [
                        [0, "rgba(122,180,250,0.5)"],
                        [1, "rgba(0,0,0,0)"]
                    ]
                },
                marker: {
                    radius: 0
                },
                lineWidth : 1,
                states    : {
                    hover: {
                        lineWidth: 0
                    }
                },
                threshold: null,
            }
        };
        chartOption.plotOptions.area.dataLabels = 0;
        if (!chartData.xAxis){
            chartData.xAxis = [];
        }
        chartOption.xAxis.tickInterval = Math.round((chartData.xAxis.length ? chartData.xAxis.length : 0) / 4);
        // chartOption.xAxis.tickInterval = 12;
        chartOption.xAxis.categories = chartData.xAxis;
        // chartOption.xAxis.offset = 40;
        // chartOption.xAxis.showFirstLabel = true;
        // chartOption.xAxis.startOnTick = true;
        // chartOption.xAxis.showFirstLabel = true;
        // chartOption.xAxis.labels.distance = 10;
        // chartOption.xAxis.labels.staggerLines = 2;
        // chartOption.xAxis.labels.maxStaggerLines = 1;
        chartOption.yAxis.offset = -15;

        chartOption.series = [];
        const yAxis = F.stringArrayToNumberArray(chartData.yAxis);

        const series = {
            data  : yAxis,
            name  : "累计收益",
            color : "#7ab4fa",
            type  : "area",
        };

        chartOption.series.push(series);
        // 设置legend

        chartOption.title = {
            text  : " ",
            align : "left",
            x     : 0,
            y     : 15,
            style : {
                color      : "#fff",
                fontSize   : "14px",
                fontWeight : "bold"
            }
        };



        // 制定chart的渲染位置
        chartOption.chart.renderTo = this.refs.chart;
        // 传入配置参数,预留回调
        this.chart = new Highcharts["Chart"](chartOption, this.props.callback);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.chartData !== this.props.chartData){
            this.renderChart(nextProps.chartData);
        }
    }
    componentDidMount(){
        if (this.props.chartData.xAxis && this.props.chartData.xAxis.length > 0){
            this.renderChart();
        }
    }
    componentWillUnmount(){
        this.chart && this.chart.destroy && this.chart.destroy();
    }
    render(){

        return (
            <div className="chart-box" ref="chart"></div>
        );
    }
}

module.exports = Spline;
