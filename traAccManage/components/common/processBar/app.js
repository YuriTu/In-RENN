const React = require("react");
const RouteHeader = require("../../../../common/routeHeader/routeHeader");

module.exports = props => (
    <div className="process-container">
        <RouteHeader
            config={props.config.map((item, index) => ({
                index : index + 1,
                title : item.name,
                route : item.route
            }))}
        />
    </div>
);
