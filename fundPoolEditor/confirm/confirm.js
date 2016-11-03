/**
 * 确认信息弹窗
 */
const React = require("react");
// 400*230 3radi
// padding 0 30 32 30
// linhei 158   16px bold
require("./basic.scss");
const Confirm = ({ ...props }) => {
    "use strict";
    return (
        <div className={`confirmDialog ${props.show ? "show" : "hide"}`}>
            <div className="shadow">
            </div>
            <div className="confirm">
                <div className="title">{props.title}</div>
                <div className="cancel btn btn-cancel" onClick={() => props.handleClick(1)}>取消</div>
                <div className="btn btn-submit submit" onClick={() => props.handleClick(0)}>确定</div>
            </div>
        </div>
    );
};

module.exports = Confirm;




