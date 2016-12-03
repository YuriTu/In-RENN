/**
 * Author : Yuri
 *
 * Created on 16/08/01.
 *
 * Component -- boxFundType (基金行情页筛选组件 -开放式基本特有 夏普 卡玛 最大回撤 评级)
 */

/* nico~nico~ni~ 妮可保佑,永无bug*/

/** ——————基本组件引用———————— */
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— */

class FundOpenType extends Component{

    changeOpenFundType(index){
        this.props.changeOpenFundType(index);
    }
    hasItSelected(i){
        const datalist = this.props.openFundParam;
        for (let k = 0; k < datalist.length;k++){
            if (datalist[k].index === i){
                return true;
            }
        }
        return false;
    }
    renderList(){
        const data = this.props.openFundParamList;
        const htmlArr = [];
        for (let i = 0;i < data.length;i++){
            const param = {
                index    : i,
                typeCode : data[i].typeCode
            };
            htmlArr.push(
                <li
                    className={`openType${this.hasItSelected(i) ? " activeOpenType" : ""}`}
                    onClick = {this.changeOpenFundType.bind(this, param)}
                    key = {`fundOpenType${i}`}
                >
                    {data[i].name}
                    <i className={`openTypeIcon icon-checkmark icon${this.hasItSelected(i) ? " activeOpenTypeIcon" : ""}`}></i>
                </li>
            );
        }
        return htmlArr;
    }

    render(){
        return (
            <div className="fundOpenType">
                <ul>
                    {this.renderList()}
                </ul>
            </div>
        );
    }
}
module.exports = FundOpenType;

