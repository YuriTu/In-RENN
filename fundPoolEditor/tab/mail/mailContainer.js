const React = require("react");

const Component = React.Component;

const MailContainer = (View) => {
    "use strict";
    return class extends Component{
        getMailList(value, dealList){
            this.props.changeMailParam(value, dealList);
        }
        render(){
            const param = {
                toggleOpen : true,
                poolId     : this.props.fund.poolId,
                warning    : this.props.mailWarning,
                getMails   : (value, dealList) => this.getMailList(value, dealList)
            };
            return (
                <View {...param}/>
            );
        }
    };
};

module.exports = MailContainer;
