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

const config = [
    {
        name   : "近1年",
        code   : "year",
        sortID : 1
    },
    {
        name   : "成立至今",
        code   : "untilNow",
        sortID : 2
    }
];

class FundOpenParam extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    handleCilck(type){
        this.props.handleCilck(this.props.openFundName, type);
    }

    renderList(){
        const list = config.map((item) => {
            const param = {
                superName : item.name,
                superCode : item.code,
                sortID    : item.sortID + this.changSortID(this.props.openFundName)
            };
            return (
                <li
                    className={(this.props.fundOpenParam.activeItem === item.code ? "fl-activeParam" : "")}
                    onClick = {this.handleCilck.bind(this, param) }
                    key = {`${this.props.openFundName}:${item.name}`}
                >
                    {item.name}
                    <i className={`caret${(this.props.fundOpenParam.activeItem === item.code ? " fl-activeParam" : "")}`}></i>
                </li>
            );
        });
        return list;
    }
    changSortID(name){
        let rs;
        switch (name){
            case "波动率:":{
                rs = 10;
            }
                break;
            case "夏普:":{
                rs = 12;
            }
                break;
            case "卡玛:":{
                rs = 14;
            }
                break;
            case "最大回撤:":{
                rs = 16;
            }
        }
        return rs;
    }
    render(){
        return (
            <div className="fundOpenParam">
                <span className="f-intro">{this.props.openFundName}</span>
                <div className="fl-fundOpenParamContainer">
                    <ul
                        key = {`${this.props.openFundName}:Param`}
                        className="superParam"
                    >
                        <li
                            className={(this.props.fundOpenParam.isAny ? " fl-activeParam" : "")}
                            onClick = {this.props.handleClickAny.bind(this)}
                        >不限</li>
                        {this.renderList()}
                    </ul>
                    <ul
                        className={`childParamContainer${this.props.fundOpenParam.showChild ? " show" : " hide"}${(this.props.fundOpenParam.warning ? " option-warning" : " ")}`}
                        key = {`${this.props.openFundName}:childParam`}
                    >
                        {this.props.fundOpenParam.childData}
                        <li><div className={`o-warning${(this.props.fundOpenParam.warning ? " show" : " hide")}`}>*请输入正确的数字</div></li>

                    </ul>
                    
                </div>

            </div>
        );
    }
}




module.exports = FundOpenParam;

