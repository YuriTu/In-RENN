const React = require("react");

const Component = React.Component;

const select = require("../../../../common/input/select");

const timeSelect = require("../../../../common/input/timeSelect");

const ReactRouter = require("react-router");

const Link = ReactRouter.Link;

const PlaceHolder = require("../../../../common/placeholder-patch/placeholder");

const Timer = timeSelect(select);


const FundResultView = ({ ...props }) => {
    "use strict";
    const readName = (e) => {
        props.readName(e.target.value);
    };
    const renderLink = (route) => {
        "use strict";
        return ( 
            <Link to= {route}><div className="fp-btn-prev submit" onClick={() => props.handlePrev()}>上一步</div></Link>
        );
    };

    const mailDOM = document.getElementById("mail");
    const nameDOM = document.getElementById("fundID");
    return (
        <div className="fp-result-container clearfix">
            <span className="formTitle">您创建的基金池类型筛选条件如下</span>
            <form>
                <div className="form-group">
                    <label htmlFor="fundID">名称</label>
                    <PlaceHolder isUse = {props.isOlderIE} isShow={props.showNamePH} focus = {nameDOM} content = {"例：基金池1"}></PlaceHolder>
                    <input type="text" id="fundID"  autoComplete="off" onBlur={(e) => readName(e)} onChange={props.changeName}/>
                </div>
                <div className="form-group">
                    <label htmlFor="frequency">刷新条件</label>
                    <div className="selectLike clearfix dropdown-click" onClick={() => props.handleDrop()}>{props.updateText}
                        <div className="dropLike dropdown-click">
                            <i className={`caret ${props.showDrop ? " upCaret" : " hide"}`}></i>
                        </div>
                    </div>
                    <ul id="update" className={(props.showDrop ? "dropdown" : "none")}>
                        <li onClick={() => props.sendUpdateData(0, "每日刷新")}>每日刷新</li>
                    </ul>
                </div>
                <div className="form-group">
                    <label htmlFor="mail">变动提醒联系人</label>
                    <PlaceHolder isUse = {props.isOlderIE} isShow={props.showMailPH} focus = {mailDOM} content = {"Email"}></PlaceHolder>
                    <input type="text" id="mail" placeholder="Email" autoComplete="off" onChange={props.mailChange} onBlur={(e) => props.getMail(e.target.value)}/>
                    <span className={props.warningMail ? "warningMail" : ""}>{props.warningMail ? "*请输入正确的邮箱地址" : "请输入基金池变动通知邮箱"}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="mailWarning">邮件提醒时间</label>
                    <div className="selectLike time-select clearfix">
                    <Timer cur={props.curNoticeTime} getTime={time => props.getTime(time)}/>
                    </div>
                </div>
                <div className="resultList form-group clearfix">
                    <label htmlFor="resultList">筛选条件</label>
                    <ol id="resultList">
                        {props.resultList}
                    </ol>
                </div>
            </form>
            <div className="resultCount" >*根据当前筛选条件已为您筛选<span className="num">{props.resultCompanyCount}</span>家基金公司,
                <span className="num">{props.resultCount}</span>支基金
            </div>
            <a href="javascript:void 0" className="fp-btn-next" onClick={(e) => { props.finish(e); }}>确认创建</a>
            {renderLink(props.route)}
        </div>
    );
};
FundResultView.propType = {
    mailChange: React.PropTypes.func
};
module.exports = FundResultView;
