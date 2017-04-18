const React = require("react");

class WarningInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isClick: props.isClick || false,
        };
        this.toggleIcon = () => {
            this.props.onClick && this.props.onClick(!this.state.isClick);
            this.setState({
                isClick: !this.state.isClick
            });
        };
        this.onChange = (e) => {
            this.setState({
                isClick: false
            });
            this.props.onChange && this.props.onChange(e);
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.isClick !== this.state.isClick){
            this.setState({
                isClick: nextProps.isClick
            });
        }
    }
    render(){
        return (
            <div className={`${this.props.className} warning-input-container`}>
                <input
                    type="text"
                    value={this.props.value && this.props.value}
                    onChange={(e) => this.onChange(e)}
                    disabled={this.props.disabled}
                />
                {
                    this.props.hasBtn &&
                    (
                        <span className="btn-container" onClick={(e) => this.toggleIcon(e)}>
                            <i
                                className={`icon ${this.state.isClick ? "icon-checked" : "icon-checkbox"}`}
                            ></i>
                            <span className="box-label">{this.props.btnText}</span>
                        </span>
                    )
                }
                <div className={`warning ${this.props.showWarning ? "show" : "hide"}`}>
                    <span>{this.props.warningText}</span>
                </div>
            </div>
        );
    }
}

WarningInput.propsType = {
    // 自定义类名
    className   : React.PropTypes.string,
    // input输入回调
    onChange    : React.PropTypes.func,
    // 是否需要自定义按钮
    hasBtn      : React.PropTypes.bool,
    // 自定义按钮文案
    btnText     : React.PropTypes.string,
    // 自定义按钮回调
    onClick     : React.PropTypes.func,
    // input是否可以编辑
    disabled    : React.PropTypes.bool,
    // 是否展示warning
    showWarning : React.PropTypes.bool,
    // waring文案
    warningText : React.PropTypes.string,
    // 全选是否被选中
    isClick     : React.PropTypes.bool,
};


module.exports = WarningInput;