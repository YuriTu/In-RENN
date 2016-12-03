/**
 * Author : Yuri
 *
 * Created on 16/08/8.
 *
 * Component -- boxFundAchieve (基金行情页筛选组件 - 开放式基金业绩)
 */

/* nico~nico~ni~ 妮可保佑,永无bug*/

/** ——————基本组件引用———————— */
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— */

require("./box.scss");



class OpenFundAchieve extends Component{

    handleCilck(type){
        this.props.handleCilck(type);
    }
    handleClickAny(type){
        this.props.handleClickAny(type);
    }
    renderList(){
        const config = this.props.config;
        const list = config.map((item) => {
            return (
                <li
                    className={(this.props.fundAchieveParam.activeItem === item.code ? "fl-activeParam" : "")}
                    onClick = {this.handleCilck.bind(this, item) }
                    key = {`业绩${item.name}${item.sortID}`}
                >
                    {item.name}
                    <i className={`caret${this.props.fundAchieveParam.activeItem === item.code ? " fl-activeParam" : ""}`}></i>
                </li>
            );
        });
        
        return list;
    }
    render(){
        return (
            <div className="fundAchieve">
                <span className="f-intro">基金业绩:</span>
                <div className="fl-fundAchieveContainer">
                    <ul 
                        key = {`一级菜单${this.props.fundAchieveParam.activeItem.code}`}
                        className="superParam"
                    >
                        <li
                            className={(this.props.fundAchieveParam.isAny ? " fl-activeParam" : "")}
                            onClick = {this.handleClickAny.bind(this, 1)}
                        >不限</li>
                        {this.renderList()}
                        
                    </ul>
                    <ul
                        key = {`child${this.props.fundAchieveParam.activeItem.code}`}
                        className={`childParamContainer${(this.props.fundAchieveParam.showChild ? " show" : " hide")}${(this.props.fundAchieveParam.warning ? " option-warning" : " ")}`}
                        ref = "childParamComtainer"
                    >
                        {this.props.fundAchieveParam.achieveData}
                        <div className={`o-warning${(this.props.fundAchieveParam.warning ? " show" : " hide")}`}>*请输入正确的数字</div>
                    </ul>

                </div>
            </div>
        );
    }
}

module.exports = OpenFundAchieve;

