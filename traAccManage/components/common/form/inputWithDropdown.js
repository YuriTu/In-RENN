/**
 * Created by renren on 2017/6/13.
 */
const React = require("react");

const Component = React.Component;

const Input = require("./input");

const radioSelectContainer = require("../../../../common/input/commonSelect").radioSelect;

const Select = require("../../../../common/input/select");

const RadioSelect = radioSelectContainer(Select);

class DropDownWithInput extends Component{
    constructor(props){
        super(props);
        const dispatch = props.store.dispatch;
        const { field, store } = props, formState = store.getState().form;
        this.cur = this.props.selects[formState ? (formState[`${field}_type`] || 0) : 0];

        this.changeSelectType = (value, isError = false) => {
            dispatch({
                type : `CHANGE_FORM_${field}_type`,
                data : value
            });
            if (isError) {
                return;
            }
            this.props.changeSubmittingState && this.props.changeSubmittingState(field);
        };
    }
    componentWillReceiveProps(nextProps){
        const { field, store } = nextProps, formState = store.getState().form;
        if (this.cur !== this.props.selects[formState ? (formState[`${field}_type`]) : 0]){
            this.cur = this.props.selects[formState[`${field}_type`]];
        }
    }
    componentDidMount(){
        // 添加该字段的默认值
        const formState = this.props.store.getState().form;
        if (formState) {
            formState[`${this.props.field}_type`] || this.changeSelectType(0, formState[`error_${this.props.field}`] !== true);
        }
    }
    render(){
        const { className, field, selects, ...props } = this.props;
        return (
            <div className={className}>
                <RadioSelect
                    index="0"
                    cur={this.cur}
                    list={selects}
                    onSelect={this.changeSelectType}
                    style={{ minWidth: "100px" }}
                />
                <Input
                    type="text"
                    field={field}
                    store={props.store}
                    changeSubmittingState={props.changeSubmittingState}
                    defaultValue = {props.defaultValue}
                />
            </div>
        );
    }
}

Input.propTypes = {
    className : React.PropTypes.string,
    field     : React.PropTypes.string,
    selects   : React.PropTypes.array
};

module.exports = DropDownWithInput;
