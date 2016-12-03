/**
 * Component -- resultList 行情页用户筛选结果呈现
 *
 * Created by Yuri on 16/07/28
 */

const React = require("react");

const Component = React.Component;

class ResultList extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
                <div className="f-openRightBtn">
                    <a href="#" className="f-dropdown" onClick = {this.props.toggleShowOpenFundParamList}>
                        <span className="dropdownText">{(this.props.showOpenFundParamList) ? "收起选项" : "展开更多筛选条件"}</span>
                        <i className={`icon${(this.props.showOpenFundParamList ? " icon-up3" : " icon-down3")}`}></i>
                    </a>
                </div>

        );

    }
}

module.exports = ResultList;
