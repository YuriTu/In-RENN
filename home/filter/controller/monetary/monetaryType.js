/**
 * 首页筛选逻辑层
 *
 * VC分离实验
 *
 */

const React = require("react");

const Component = React.Component;

const RenderFilter = require("../common/renderFilterResultList");
const Render = new RenderFilter();

let that;
export class ScaleFilter extends Component{
    constructor(){
        super();
        that = this;
    }

    handleClickType(name, code){
        const param = this.state.fundTypeParam;
        param.isAny = false;
        param.activeItem = code;
        this.setState({
            fundTypeParam: param
        });
        // 开始渲染结果选项
        const type = {
            name : name,
            code : code,
        };
        Render.renderFilterResultList.call(this, 3, type);
    }
}

module.exports = ScaleFilter;
