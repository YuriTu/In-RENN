

const React = require("react");

const Component = React.Component;

require("babel-polyfill");

require("./header.scss");
class HeaderIndex extends Component{

    renderItem(config, interactive){
        const jsx = [];
        for (let i = 0; i < config.length;i++){
            jsx.push(
                <li className={`item ${interactive.header.active === i ? " active" : ""}`} key={`item-index${i}`}>
                    <div className="name" key={`item-name${i}`}>{config.item[i].title}</div>
                    <div className="index" key={`item-index-${i}`}>{config.item[i].index}</div>
                </li>
            );
            const flag = i + 1;
            if (flag !== config.length){
                jsx.push(
                    <li className="point" key={`item-point${i}`}><div className="">............................................</div></li>
                );
            }
        }
        return jsx;
    }

    render(){
        return (
            <div className="fp-header">
                <ul className="container" key="fp-header-container">
                    {this.renderItem(this.props.config, this.props.interactive)}
                </ul>
            </div>
        );
    }
}

module.exports = HeaderIndex;
