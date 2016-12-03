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
            <div className="f-resultlist">
                <span className="f-intro">所有分类:</span>
                <ul className="filterItemList">
                    {this.props.ParamForPanel}
                </ul>
                <div className="f-rightBtn">
                    <a href="#" className="f-clearAll" onClick = {this.props.handleClickClearAll.bind(this)}>清除所选条件</a>
                    <a href="#" className="f-dropdown" onClick = {this.props.toggleShowFilterList.bind(this)}>
                        {(this.props.showFilterList) ? "收起" : "展开"}
                        <i
                            onClick = {this.props.toggleShowFilterList.bind(this)}
                            className={`icon${(this.props.showFilterList ? " icon-up3" : " icon-down3")}`}
                        ></i>
                    </a>
                </div>
            </div>
        );
        
    }
}

module.exports = ResultList;
