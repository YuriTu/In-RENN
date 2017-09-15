/**
 * Created by renren on 2017/6/16.
 */
const React = require("react");
require("./input.scss");

module.exports = (props) => (
    <div
        className={`${props.className} form-span`}
        id = {`form-${props.field}`}
        key = {`form-${props.field}`}
        name = {props.field}
    >
        <span>{props.setNewValue}</span>
    </div>
);