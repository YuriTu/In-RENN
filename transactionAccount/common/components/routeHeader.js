const React = require("react");
const RouteHeader = require("../../../common/routeHeader/routeHeader");

const judgePath = (path) => {
    let index = "redConfig";
    if (path.indexOf("redeem") < 0){
        index = "purConfig";
    }
    return index;
};

const redContainer = (props) => {
    const config = props[judgePath(props.location.pathname)];
    return (
        <div>
            <RouteHeader config={config.routeHeader}/>
            {props.children}
        </div>
    );
};

module.exports = redContainer;