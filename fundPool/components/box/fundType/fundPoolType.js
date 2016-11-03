const React = require("react");

const Component = React.Component;

const FundType = require("../../../../common/commonFilter/fundChildType/fundChildType");

const ReactRouter = require("react-router");

const Link = ReactRouter.Link;

const $ = require("jquery");

require("../basic.scss");
class FundPoolType extends Component{
    constructor(props){

        super(props);
        this.state = {
            interactive : props.interactive[1].fundChildTypeParam,
            warning     : false,
        };
        this.param = {
            superFundType : "",
            firstFundType : "",
        };
    }
    // 一级类型选中逻辑
    selectType(type){
        // 重置二级类型
        const defaultValue = [{ index: 0, code: "", name: "all" }];
        // 修改顶部header样式
        this.props.changeHeader(type);
        // 保存一级类型
        this.param.superFundType = type;

        this.setState({
            // 二级类型初始化
            interactive: {
                result : defaultValue,
                active : type
            },
            warning: false,
        });
    }

    // 二级类型选中逻辑
    changeChildType(param){
        this.param.firstFundType = this.changeActive(param);
        // 更新view
        this.setState({
            interactive: {
                result : this.param.firstFundType,
                active : this.state.interactive.active,
            }
        });
    }
    // 二级类型高亮逻辑
    changeActive(param){
        const ar = this.state.interactive.result;
        let newArr = [];
        if (param.index === 0){
            newArr = [{ index: 0, code: "", name: "all" }];
            // 判断是增加还是删除
        } else if (this.isIN(ar, param)){
            // 清空结果数组 准备数组去重
            newArr = [];
            ar.forEach((item) => {
                if (item.index !== param.index) {
                    newArr.push(item);
                }
            });
            // 删除是不是删除完了
            if (newArr.length === 0){
                newArr = [{ index: 0, code: "", name: "all" }];
            }
        } else {
            // 去掉开头的0
            ar[0].index === 0 ? ar.shift() : null;
            newArr = ar;
            newArr.push(param);
        }

        return newArr;
    }
    // 判断是否已被选中
    isIN(ar, param){
        let isIn = false;
        ar.forEach((item) => {
            if (item.index === param.index){
                isIn = true;
            }
        });
        return isIn;
    }
    // 下一步点击的判断
    handleNext(e){
        if (this.param.superFundType !== "" || this.state.interactive.active > 0){
            // 格式化参数
            const param = this.formatData(this.param);
            // 改变参数
            this.props.changeAjaxCacheParam(param, "fundType");
            this.props.changeInteractive(this.state.interactive, "fundChildTypeParam");
            this.props.changeHeaderItem(1);
        } else {
            e.preventDefault();
            this.setState({
                warning: true
            });
        }
    }
    formatData(data){
        const rs = {
            superFundType: data.superFundType,
        };
        // 如果第二项不是全部的话

        // if (data.firstFundType && data.firstFundType[0].code){
        if (!!data.firstFundType){
            // 如果是数组
            if (typeof data.firstFundType === "object"){
                const str = [];
                data.firstFundType.forEach((item) => {
                    str.push(item.code);
                });
                rs.firstFundType = str.join(",");
            } else {
                // 未修改的字符串
                rs.firstFundType = data.firstFundType;
            }

        }
        return rs;
    }


    componentDidMount(){
        // 每个组价加载时该做的
        // 1.清空当前页之后的数据2.更新参数 param 与 inter(复现正常的交互)填写自定义
        this.param = this.props.param.fundType;
        this.props.cleanAfterData(0);

    }

    render(){
        return (
            <div className="fp-t-container clearfix">
                <Item
                    index = {1}
                    name = "货币理财"
                    active = {this.state.interactive.active}
                    handleClick = {this.selectType.bind(this)}
                    shortList = {true}
                >
                    <FundType
                        config = {this.props.typeConfig[1][1].fundChildTypeParam.config}
                        result = {this.state.interactive.result}
                        handleClick = {this.changeChildType.bind(this)}
                    ></FundType>
                </Item>
                <Item
                    index = {0}
                    active = {this.state.interactive.active}
                    name = "净值型基金"
                    handleClick = {this.selectType.bind(this)}
                >
                    <FundType
                        config = {this.props.typeConfig[0][1].fundChildTypeParam.config}
                        result = {this.state.interactive.result}
                        handleClick = {this.changeChildType.bind(this)}
                    ></FundType>
                </Item>
                <span className={this.state.warning ? " warning" : "none"}>请选择基金类型</span>
                <Link to="FundCompany"><div className="btn submit next" onClick={this.handleNext.bind(this)}>下一步</div></Link>

            </div>
        );
    }
}

class Item extends Component{
    render(){
        return (
            <div
                className="boxContainer"

            >
                <div
                    className={`item${this.props.index === this.props.active ? " active" : ""}`}
                    onClick={() => this.props.handleClick(this.props.index)}
                >
                    <span>{this.props.name}</span>
                    <div className={`${ this.props.index === this.props.active ? " selectedIcon" : " hide"}`}><i className="icon icon-checkmark"></i> </div>
                </div>

                <div
                    className={`list${this.props.index === this.props.active ? " show" : " hide"} ${this.props.shortList ? " shortList" : ""}`}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = FundPoolType;
