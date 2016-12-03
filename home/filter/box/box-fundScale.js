/**
 * Author : Yuri
 *
 * Created on 16/07/10.
 *
 * Component -- boxFundScale (基金行情页筛选组件 - 基金规模)
 */

/* nico~nico~ni~ 妮可保佑,永无bug*/

/** ——————基本组件引用———————— */
const React = require("react");

const Component = React.Component;

/** ——————基本组件引用完成———————— */


require("./box.scss");

class FundScale extends Component{
    handleCilck(type){
        this.props.handleCilck(type);
    }
    handleClickAny(type){
        this.props.handleClickAny(type);
    }
    getStartSc(event){
        this.props.getStartSc(event.target.value);
    }
    getEndSc(event){        
        this.props.getEndSc(event.target.value);
    }
    handleShowOption(){
        this.props.handleShowOption(1);
    }
    sendOptionalData(){
        this.props.sendOptionalData();
    }
    renderList(){
        const config = this.props.config;
        const list = config.map((item) => {
            return (
                <li
                    className={(this.props.fundScaleParam.activeItem === item.code ? "fl-activeParam" : "")}
                    onClick = {this.handleCilck.bind(this, item.code) }
                    key = {`规模${item.name}`}
                >
                    {item.name}
                </li>
            );
        });

        return list;
    }
    deleteSPlaceHolder(){
        this.refs.startSc.value = "";
    }
    deleteEPlaceHolder(){
        this.refs.endSc.value = "";
    }

    render(){
        return (
            <div className="fundScale">
                <span className="f-intro">基金规模:</span>
            <div className="fl-fundScaleContainer">
                <ul className="superParam">
                    <li
                        className={(this.props.fundScaleParam.isAny ? " fl-activeParam" : "")}
                        onClick = {this.handleClickAny.bind(this, 2)}
                    >不限</li>
                    {this.renderList()}
                    <li className={"" + (this.props.fundScaleParam.showOption ? " fl-activeParam" : "") + (this.props.fundScaleParam.activeOption ? " fl-activeParam" : "")} onClick = {this.handleShowOption.bind(this)} >自定义 <i className={"caret" + (this.props.fundScaleParam.showOption ? " fl-activeParam" : "") + (this.props.fundScaleParam.activeOption ? " fl-activeParam" : "")}></i></li>
                </ul>
                <div className={"optionalContainer" + ( this.props.fundScaleParam.showOption ? " show" : " hide")}>
                    <div className="ScaleOptional">
                        <lebel htmlFor = "startSc">规模(亿元): </lebel>
                        <input
                            type="text"
                            ref = "startSc"
                            id="startSc"
                            onChange = {this.getStartSc.bind(this)}
                            className={(this.props.warning.start ? "warningInput" : "")}
                            onFocus = {this.deleteSPlaceHolder.bind(this)}
                        />
                        <label htmlFor="endSc"> 至 </label>
                        <input
                            type="text"
                            ref = "endSc"
                            id="endSc"
                            onChange = {this.getEndSc.bind(this)}
                            className={(this.props.warning.end ? "warningInput" : "")}
                            onFocus = {this.deleteEPlaceHolder.bind(this)}
                        />
                        <a href="javascript:void(0)" className="optionalBtn" onClick = {this.sendOptionalData.bind(this)}>确定</a>
                    </div>
                    <div
                        className={((this.props.warning.start || this.props.warning.end) ? "warningText warningSc show" : "hide")}
                    >*请输入正确的基金规模区间</div>
                </div>
            </div>
            </div>
        );
    }
}




module.exports = FundScale;

