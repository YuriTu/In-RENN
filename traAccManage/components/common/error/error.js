const React = require("react");
const _ = require("../../../../common/util/util");
class Error extends React.Component {
    constructor(props){
        super(props);
        this.store = props.store;
        const formState = this.store.getState().form;
        this.state = {
            error: !!formState ?
                formState[`error_${this.props.field}`] || true : true
        };
        this.typeError = error => this.store.getState().form[`error_${this.props.field}`] ||
            this.store.dispatch({
                type  : `ERROR_${this.props.field}`,
                value : error,
            });
        this.typeClearError = () => this.store.getState().form[`error_${this.props.field}`] &&
            this.store.dispatch({
                type: `CLEAR_ERROR_${this.props.field}`
            });
        this.checkError = (rule, ...value) => {
            if (!rule){
                return;
            }
            if (!_.isArray(rule)){
                return;
            }
            for (let i = 0; i < rule.length;i++){
                const check = rule[i](...value);
                if (check !== true){
                    this.typeError(check);
                    return this.setState({
                        error: check
                    });
                }
            }
            // this.setState({
            //     error: true
            // });
            this.clearError();
        };
        this.clearError = () => this.setState({
            error: true
        }, this.typeClearError);
    }
    componentWillReceiveProps(nextProps){
        const newStoreState = this.store.getState();
        const formState = newStoreState.form;
        const newError = !!formState ?
            formState[`error_${this.props.field}`] || true : true;
        if (newError !== this.state.error){
            this.setState({
                error: newError
            });
        }
        // 如果是自动校检则每次值改变进行检查
        if (this.props.isAutoCheckRule && nextProps.checkValue !== this.props.checkValue ){
            this.checkError(
                nextProps.rule,
                nextProps.checkValue
                );
        }
        if (nextProps.isSubmitting !== this.props.isSubmitting ) {
            if (nextProps.isSubmitting) {
                if (!!newStoreState.form[`${nextProps.field}_type`]){
                    this.checkError(
                        nextProps.rule,
                        newStoreState.form[nextProps.field],
                        newStoreState.form[`${nextProps.field}_type`]);
                } else {
                    this.checkError(
                        nextProps.rule,
                        newStoreState.form[nextProps.field]);
                }
            } else {
                this.clearError();
            }
        }

    }
    render(){
        return (
            <p className={`error ${this.state.error === true ? " none" : ""}`}>
                <i className="icon icon-warning2" />
                <span className="small-size">{this.state.error}</span>
            </p>
        );
    }
}

module.exports = Error;