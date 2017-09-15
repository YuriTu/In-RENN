/**
 * Created by renren on 2017/6/13.
 */
const React = require("react");
const Nav = require("../../common/secLevNavigation/app");
require("./manage.scss");

module.exports = props => {
    return (
        <div className="component-container">
            <Nav config = {props.navConfig}/>
            <div className={`confirm-manage ${props.className}`}>
                <div className="confirm-form clearfix">
                    <div className="pull-left">
                        <i className="icon icon-checkmark"></i>
                    </div>
                    <div className="pull-right">
                        <h4>{props.field}申请已提交</h4>
                    </div>
                </div>
                <p className="pageInfo">
                    您的资料修改申请已提交，广发基金会在一个工作日内审核您的修改请求
                </p>
            </div>
        </div>
    );
};