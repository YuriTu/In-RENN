/**
 * Created by Lever on 17/3/17.
 */
const React = require("react");

const Component = React.Component;

const radioSelectContainer = require("../../../../common/input/commonSelect").radioSelect;

const Select = require("../../../../common/input/select");

const RadioSelect = radioSelectContainer(Select);

const $ = require("jquery");
// TODO : 再研究一下他的机制
class RadioSelectComponent extends Component{
    constructor(props){
        super(props);
        const store = this.props.store,
            formState = store.getState().form;
        // this.cur = formState[this.props.field] ? formState[this.props.field][this.props.showField] : this.props.cur;

        this.dispatch = action => {
            store.dispatch(action);
            this.props.changeSubmittingState && this.props.changeSubmittingState(this.props.field);
        };
        this.state = {
            // list: !this.props.showField ? props.list : props.list.map(item => item[this.props.showField])
            list : props.list,
            cur  : props.cur,
        };
        // this.asyncList = this.props.list;
        this.changeSelect = (dispatch, field) => value => {
            props.changeRequest && props.changeRequest(value);
            return (dispatch({
                type : `CHANGE_FORM_${field}`,
                // data : this.props.mustField ? this.asyncList[value] : value
                data : value
            }));
        };
    }
    componentDidMount(){
        // 由于后端接口太慢，所以设定一定的延迟以拿到数据
        this.props.didMountChange && this.changeSelect(this.dispatch, this.props.field)(0);
        // this.props.showField && this.props.store.subscribe(action => /REQUEST_/.test(action.type) && this.setState({
        //     list: action.value.map(item => item[this.props.showField])
        // }, () => this.asyncList = action.value));

    }

    componentWillReceiveProps(nextProps){
        if (nextProps.cur !== this.state.cur || nextProps.list !== this.state.list){
            this.setState({
                cur  : nextProps.cur,
                list : nextProps.list
            });
        }
    }
    render(){
        return (
            <RadioSelect
                index="0"
                cur={this.state.cur}
                list={this.state.list}
                onSelect={this.changeSelect(this.dispatch, this.props.field)}
                style={this.props.style}
                className = {this.props.className}
            />
        );
    }
}

module.exports = RadioSelectComponent;