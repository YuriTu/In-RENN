const React = require("react");
const Route = require("react-router");
const Link = Route.Link;
require("./app.scss");

/**
 * 导航栏
 * @param {Array} props {name:"路由名称"，href = "跳转路径"}
 * @return {Jsx} component
 */
module.exports = props => (
    <div key = {"nav-container"} className="secLevNav nav-container clearfix">
        <ul>
            {
                props.config.map((item, index) => (
                <Link to = {item.href}
                      className={`${window.location.href.indexOf(item.href.split("/")[2]) > 0 && "active"}`}
                        activeClassName={"active"}>
                    <li key={`${item.name}-${index}`}>{item.name}</li>
                </Link>
                ))
            }
        </ul>

    </div>
);

