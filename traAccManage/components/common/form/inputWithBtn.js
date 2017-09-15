/**
 * Created by renren on 2017/6/9.
 */

const React = require("react");
const _ = require("../../../../common/util/util");
require("./input.scss");
class InputWithBtn extends React.Component {
    constructor(props){
        super(props);
        const dispatch = props.store.dispatch;
        this.state = {
            isChecked: false,
        };
        const { field, changeSubmittingState, isAutoCheckRule } = props;
        this.setNewValue = props.setNewValue;
        this.setInput = (input) => this.input = input;

        this.changeValue = _.debounce(() => {
            this.setState({
                isChecked: false
            });
            dispatch({
                type : `CHANGE_FORM_${field}`,
                data : (+this.input.value.trim()).toFixed(2)
            });
            changeSubmittingState && changeSubmittingState(field, isAutoCheckRule);
        }, 60);
        this.setValue = (value) => this.input.value = value;
        this.setAll = () => {
            const type = field.replace(/FUND_*/, "").replace(/(_)\w+/, "");
            const avail = props.store.getState().form[`FUND_${type}_availableAmount`];
            if (!avail){
                return;
            }
            this.setState({
                isChecked: !this.state.isChecked
            });
            this.setValue(avail);
            dispatch({
                type : `CHANGE_FORM_${field}`,
                data : avail
            });
        };
    }
    componentWillReceiveProps(nextProps){
        if (!this.input){
            return;
        }
        if ( this.props.setNewValue && this.setNewValue !== nextProps.setNewValue){
            this.setValue(nextProps.setNewValue);
        }
    }
    componentDidMount(){
        this.props.defaultValue && this.setValue(this.props.defaultValue);
    }
    render(){
        const { className, field, type, disabled } = this.props;
        return (
            <div className="inline-block">
                <input
                    className={`${className} form-input`}
                    type="text"
                    id = {`form-${field}`}
                    key = {`form-${field}`}
                    name = {field}
                    ref = {this.setInput}
                    disabled={disabled}
                    onChange={this.changeValue}
                />
                <span
                    className="btn-container"
                    onClick={this.setAll}
                >
                    <i className={`icon ${this.state.isChecked ? "icon-checked" : "icon-checkbox"}`}></i>
                    <span className="box-label">全部</span>
                </span>
            </div>

        );
    }
}

InputWithBtn.propTypes = {
    className   : React.PropTypes.string,
    type        : React.PropTypes.string,
    field       : React.PropTypes.string,
    disabled    : React.PropTypes.bool,
    // 通过props传参改变input value
    setNewValue : React.PropTypes.string,
};

module.exports = InputWithBtn;
