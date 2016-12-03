/**
 * Author : Yuri
 *
 * Created on 16/07/10.
 *
 * Component -- boxFundType (基金行情页筛选组件 - 基金规模)
 */

/* nico~nico~ni~ 妮可保佑,永无bug*/

/** ——————基本组件引用———————— */
const React = require("react");

const Component = React.Component;

const $ = require("jquery");

/** ——————基本组件引用完成———————— */


require("./box.scss");

/**
 *  /filter/web/sc 筛选页面接口
 *  @uid int 用户id
 *  @page number当前页面
 *  @pageSize number分页数量
 *  @sortedBy number 按字段排序： 月收益率：1、波动率：2、基金规模：3
 *      @wanpernav      (1  , "万份收益"   )
 *      @yield7day      (2  , "七日年化"   )
 *      @yield28day     (3  , "28日年化"   )
 *      @yieldMoth1     (4  , "近1月收益"  )
 *      @yieldMoth3     (5  , "近3月收益"  )
 *      @yieldMoth12    (6  , "近1年收益"  )
 *      @establishment  (7  , "成立至今"   )
 *  @sortedDirection number 倒序：1、正序：0
 *  @rank number  排行前（10，20，50，100）名
 *  @companyCodes string 基金公司代码
 *  @yieldRanks: string  近（1周，1月，3月，1年）收益排行 ；如：w,m,m3,y
 *  @currencyType: number // 货其类型 (1,2,3)如     A类： 1， 其他类型：2，B类: 3
 *  @TypeType:number //基金规模 (1,2,3,4,5)如   少于100亿：1，100～200：2， 200～500：3，500~1000： 4， 大于1000亿: 5
 *  默认按照7日年化从高到低排序
 */


class FundType extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    handleCilck(type, code){
        this.props.handleCilck(type, code);
    }
    handleClickAny(type){
        this.props.handleClickAny(type);
    }

    renderList(itemData){
        const jsx = [];
        itemData.forEach((item) => {
            jsx.push(
                <li 
                    className={(this.props.fundTypeParam.activeItem === item.code ? "fl-activeParam" : "")}
                    onClick = {this.handleCilck.bind(this, item.name, item.code)}
                    key = {`${item.name}:${item.code}`}
                >{item.name}</li>
            );
        });
        return jsx;
    }
    render(){
        return (
            <div className={`fundType$${this.props.fundTypeParam.show ? " show" : " hide"}`}>
                <span className="f-intro">{this.props.fundTypeParam.name}:</span>
            <div className="fl-fundTypeContainer">
                <ul className="superParam">
                    <li
                        className={(this.props.fundTypeParam.isAny ? " fl-activeParam" : "")}
                        onClick = {this.handleClickAny.bind(this, 3)}
                    >不限</li>
                    {this.renderList(this.props.fundTypeParam.item)}
                </ul>
            </div>
            </div>
        );
    }
}




module.exports = FundType;

