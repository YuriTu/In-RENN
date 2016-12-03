/**
 * 首页筛选逻辑层
 * 
 * 二级债基类型
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
        this.setState({
            fundTypeParam: {
                isAny      : false,
                activeItem : code,
                item       : this.state.fundTypeParam.item,
                show       : this.state.fundTypeParam.show,
                name       : this.state.fundTypeParam.name,
            }
        });
        // 开始渲染结果选项
        const type = {
            name : name,
            code : code,
        };
        Render.renderFilterResultList.call(this, 33, type);
    }
}

module.exports = ScaleFilter;
