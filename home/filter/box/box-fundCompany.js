/**
 * Author : Yuri
 *
 * Created on 16/07/10.
 *
 * Component -- boxCompany (基金行情页筛选组件 - 基金公司)
 */
/* nico~nico~ni~ 妮可保佑,永无bug*/
/** ——————基本组件引用———————— */
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— */

require("./box.scss");


/**
 * 父级props  fundCompanyParam
 * @isAny:true,不限 是否被选中
 * @activeItem:-1, 被选中的是哪一项
 */


class FundCompany extends Component{
    constructor(props){
        super(props);

        this.state = {
            isAny       : true,
            activeItem  : -1,
            companyData : [],
        };
    }

    renderCompanyList(){
        const config = this.props.config;
        const list = config.map((item) => {
            return (
                <li
                    className={`special-chart${this.props.fundCompanyParam.activeItem === item.code ? " fl-activeParam" : ""}`}
                    onClick = {this.props.handleCilck.bind(this, item.code)}
                    key = {`company${item.name}`}
                >{item.name}</li>
            );
        });
        return list;
    }
    render(){
        return (
            <div className="fundCompany">
                <span className="f-intro">基金公司:</span>
                <div className="fl-fundCompanyContainer">
                    <ul>
                        <li
                            className={(this.props.fundCompanyParam.isAny ? " fl-activeParam" : "")}
                            onClick = {this.props.handleClickAny.bind(this, 0)}
                            style={{ verticalAlign: "top" }}>不限</li>
                        {this.renderCompanyList()}

                    </ul>
                    <ul className={`childParamContainer${this.props.fundCompanyParam.isAny ? " hide" : " show"}`}>
                            {this.props.fundCompanyParam.companyData}
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = FundCompany;

