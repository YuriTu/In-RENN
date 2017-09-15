/**
 * Created by renren on 2017/6/9.
 */
/**
 *  交易页 赎回组件
 *  Author Yuri 2016/03/02
 */

const React = require("react");
const Router = require("react-router");
const Link = Router.Link;
const Nav = require("../../common/secLevNavigation/app");
const Process = require("../../common/processBar/app");

const _ = require("../../../../common/christina/christina");
require("./redeem.scss");
const redeem = (props) => {
    return (
        <div className="component-container" style={{ "min-height": `${window.innerHeight - 121}px` }}>
            <Nav config = {props.navConfig}/>
            <Process config = {props.process}/>
            <div className="red-form-container">
                <div className="container success clearfix">
                    <div className="pull-left">
                        <i className="icon icon-checkmark"></i>
                    </div>
                    <div className="pull-right">
                        <h4>尊敬的用户：</h4>
                        <p>您已成功提交 <span className="affirm-info">{_.getUrlParam("amount")}</span>份{_.getUrlParam("fundName")}赎回操作。</p>
                        <p>预计T+1（ 快赎: T+0 ）日17：00前，基金金额将赎回至指定账户<br/>个别银行可能存在延迟，具体以银行到账时间为准</p>
                    </div>
                    <Link to={"fund/redeem/start"}
                          onClick={() => {
                              props.store.dispatch({
                                  type: "CLAEAR_FORM"
                              });
                          }}
                    >
                        <div
                            className={"btn block-center"}
                        >返回</div>
                    </Link>
                </div>


            </div>
        </div>
    );
};

module.exports = redeem;