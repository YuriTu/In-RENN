/**
 *  基金池详情-名称
 *
 *  Author Yuri 2016/09/18
 */
const React = require("react");

const Component = React.Component;

require("./basic.scss");
require("../../../css/common.scss");
class LeftNav extends Component {
    constructor(props){
        super(props);
        this.state = {
            active: 0
        };
        this.isClick = false;
    }
    changeActive(i, distance){
        this.isClick = true;
        window.scrollTo(0, distance);
        this.setState({
            active: i
        });
        window.setTimeout( () => {
            this.isClick = false;
        });
    }
    renderList(config){
        return config.map((item, index) => {
            return (
                <li
                    key = {item.name}
                ><a
                    className={(this.state.active === index ? " active" : "")}

                    onClick={this.changeActive.bind(this, index, item.distance)}>{item.name}</a>
                </li>
            );
        });
    }
    scroll(){
        if (this.isClick){
            return;
        }
        const distance = document.body.scrollTop;
        let i = 0;
        if (distance >= 915) {
            i = 5;
        } else if (distance >= 790){
            i = 4;
        } else if (distance >= 612){
            i = 3;
        } else if (distance >= 432){
            i = 2;
        } else if (distance >= 140){
            i = 1;
        }
        this.setState({
            active: i
        });
    }
    componentDidMount(){
        $(window).on("scroll", this.scroll.bind(this));
    }
    render(){
        return (
            <div className="leftNav clearfix">
                <ul>
                    {this.renderList(this.props.config)}
                </ul>
            </div>
        );
    }
}

module.exports = LeftNav;
