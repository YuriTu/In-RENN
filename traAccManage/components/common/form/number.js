/**
 * Created by renren on 2017/6/14.
 */

const React = require("react");

const Component = React.Component;

const NumberInput = require("../../../../common/input/number");

class NumberIn extends Component{
    constructor(props){
        super(props);
        const dispatch = props.store.dispatch;
        const { field, changeSubmittingState, isAutoCheckRule } = props, form = props.store.getState().form;
        this.defaultValue = !!form ? form[field] : "";
        this.changeValue = value => {
            dispatch({
                type : `CHANGE_FORM_${field}`,
                data : (+value).toFixed(2)
            });
            changeSubmittingState && changeSubmittingState(field, isAutoCheckRule );
        };
    }
    render(){
        const { className, field } = this.props;
        return (
            <NumberInput
                className={className}
                defaultValue={this.defaultValue}
                inputChange={this.changeValue}
                ref="amount"
                id={`form-${field}`}
            />
        );
    }
}

NumberIn.propTypes = {
    className : React.PropTypes.string,
    field     : React.PropTypes.string
};

module.exports = NumberIn;

