/**
 * Created by renren on 2017/6/6.
 */

const React = require("react");
const _ = require("../../../../common/util/util");
const Number = require("./number");
require("./input.scss");
class Input extends React.Component {
    constructor(props){
        super(props);
        const dispatch = props.store.dispatch;
        const { field, changeSubmittingState } = props;
        this.setInput = (input) => this.input = input;
        this.changeValue = () => {
            dispatch({
                type : `CHANGE_FORM_${field}`,
                data : this.input.value.trim()
            });
            changeSubmittingState && changeSubmittingState(field);
        };
        this.setValue = (value) => this.input.value = value;
    }
    componentWillReceiveProps(nextProps){
        if (!this.input){
            return;
        }
    }

    componentDidMount(){
        this.props.defaultValue && this.setValue(this.props.defaultValue) && this.changeValue();

    }
    render(){
        const { className, field, type} = this.props;
        return (
            type === "number" ?
                <Number {...this.props}/> :
            <input
                className={`${className} form-input`}
                type={type}
                id = {`form-${field}`}
                key = {`form-${field}`}
                name = {field}
                ref = {this.setInput}
                onChange={this.changeValue}
            />
        );
    }
}

Input.propTypes = {
    className   : React.PropTypes.string,
    type        : React.PropTypes.string,
    field       : React.PropTypes.string,
    disabled    : React.PropTypes.bool,
    // 通过props传参改变input value
    setNewValue : React.PropTypes.string,
};

module.exports = Input;
