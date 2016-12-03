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


require("./box.scss");



class FundRatings extends Component{

    handleCilck(type){
        this.props.handleCilck(this.props.openFundName, type);
    }
    handleClickAny(type){
        this.props.handleClickAny(type);
    }
    renderList(){
        const config = this.props.config;
        const list = config.map((item) => {
            const param = {
                name   : item.name,
                code   : item.code,
                sortID : item.sortID,
            };
            return (
                <li className={(this.props.fundOpenParam.activeItem === item.code ? "fl-activeParam" : "")}
                    onClick = {this.handleCilck.bind(this, param) }
                    key = {`rating:${item.name}`}
                >
                    {item.name}
                    <i className={`caret${(this.props.fundOpenParam.activeItem === item.code ? " fl-activeParam" : "")}`}></i>
                </li>
            );

        });
        return list;
    }
    render(){
        return (
            <div className="fundRatings">
                <span className="f-intro">{this.props.openFundName}</span>
                <div className="fl-fundRatingsContainer">
                    <ul className="superParam">
                        <li
                            className={(this.props.fundOpenParam.isAny ? " fl-activeParam" : "")}
                            onClick = {this.handleClickAny.bind(this, 3)}
                        >不限</li>
                        {this.renderList()}
                    </ul>
                    <ul className={`childParamContainer${(this.props.fundOpenParam.showChild ? " show" : " hide")}`}>
                        {this.props.fundOpenParam.childData}
                    </ul>
                </div>

            </div>
        );
    }
}




module.exports = FundRatings;

