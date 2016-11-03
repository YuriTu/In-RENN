const React = require("react");

require("./basic.scss");

const CompanyBoxContainer = ({ name, children, ...props }) => {
    return (
        <div className="companyBoxPanel clearfix">
            <div className="panel-header">{name}</div>
            <div className="panel-caret"></div>
            <div className="panel-body">{children ? children : null}</div>
        </div>
    );

};
CompanyBoxContainer.propsType = {
    name     : React.PropTypes.string,
    children : React.PropTypes.node,
};


module.exports = CompanyBoxContainer;
