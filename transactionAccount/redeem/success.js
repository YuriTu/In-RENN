/**
 *  交易页 赎回组件
 *  Author Yuri 2016/03/02
 */

const React = require("react");
const Router = require("react-router");
const Link = Router.Link;

const _ = require("../../common/christina/christina");
require("./redeem.scss");
const redeem = () => {
    return (
        <div className="re-main-container" style={{ "min-height": `${window.innerHeight - 121}px` }}>

            <div className="red-from-container">
                <div className="container success clearfix">
                    <div className="pull-left">
                        <i className="icon icon-checkmark"></i>
                    </div>
                    <div className="pull-right">
                        <h4>尊敬的用户：</h4>
                        <p>您已成功提交 <span className="affirm-info">{_.getUrlParam("amount")}</span>份{_.getUrlParam("fundName")}赎回操作。</p>
                        <p>预计T+1日17：00前，基金金额将赎回至指定账户<br/>个别银行可能存在延迟，具体以银行到账时间为准</p>
                    </div>
                </div>
                <Link to={"redeem/start"}>
                    <div
                        className={"confirm-btn block-center"}
                    >返回</div>
                </Link>

            </div>
        </div>
    );
};

module.exports = redeem;