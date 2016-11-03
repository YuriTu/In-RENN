const React = require("react");

const Component = React.Component;

const Service = require("../../../common/service/service");

const S = new Service();

const FundNameContainer = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                name         : props.fund.fundPoolName,
                confirmState : {
                    show  : true,
                    title : "确定删除该基金？"
                }
            };
            this.id = props.info.poolId;

            this.focusInput = () => {
                document.getElementById("nameInput").focus();
                // document.getElementById("nameInput").value = "";
            };
            this.handleDelete = () => {
                this.props.handleDelete(this.id);
            };
            this.changeInput = (value) => {
                this.setState({
                    name: value,
                });
                // 通知父元素
                this.props.changeBasicParam(value, "fundPoolName");
            };
        }
        render(){
            const param = {
                handleDelete : () => this.handleDelete(),
                defaultName  : this.state.name,
                focusInput   : () => this.focusInput(),
                changeInput  : (value) => this.changeInput(value),
                show         : this.state.confirmState.show,
                title        : this.state.confirmState.title,
                handle       : (type) => this.deleteConfirm(type)
            };
            return (
                <View {...param}/>
            );
        }
    };
};

module.exports = FundNameContainer;
