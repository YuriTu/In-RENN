const React = require("react");

const Component = React.Component;

const Formate = require("../../../common/formatObject/formatObject");
const F = new Formate();

const superParamList = {
    0 : "净值型基金",
    1 : "货币理财",
};
const childParamList = {
    "101004"  : "货币型",
    "101006"  : "短期型",
    "101001"  : "股票型",
    "101002"  : "混合型",
    "101003"  : "债券型",
    "1010023" : "指数型",
    "101005"  : "QDII",
    "101007"  : "保本型",
};

// const childParamList

const FundTypeContainer = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                interactive : props.interactive[1].fundType,
                name        : ""
            };
            this.param = {
                superFundType : "",
                firstFundType : "",
            };
            this.changeChildType = (param) => {
                this.param.firstFundType = this.changeActive(param);
                // 更新view
                this.setState({
                    interactive: {
                        result: this.param.firstFundType,
                    }
                });
                this.setParam();
            };
            // 二级类型高亮逻辑
            this.changeActive = (param) => {
                const ar = this.state.interactive.result;
                let newArr = [];
                if (param.index === 0){
                    newArr = [{ index: 0, code: "all", name: "全部" }];
                    // 判断是增加还是删除
                } else if (this.isIN(ar, param)){
                    // 清空结果数组 准备数组去重
                    newArr = [];
                    ar.forEach((item) => {
                        if (item.code !== param.code) {
                            newArr.push(item);
                        }
                    });
                    // 删除是不是删除完了
                    if (newArr.length === 0){
                        newArr = [{ index: 0, code: "all", name: "全部" }];
                    }
                } else {
                    // 去掉开头的0
                    // ar[0].index === 0 ? ar.shift() : null;
                    ar[0].code === "all" ? ar.shift() : null;
                    newArr = ar;
                    newArr.push(param);
                }

                return newArr;
            };
            // 判断是否已被选中
            this.isIN = (ar, param) => {
                let isIn = false;
                ar.forEach((item) => {
                    if (item.code === param.code){

                        isIn = true;
                    }
                });
                return isIn;
            };

            this.getDefault = (data) => {
                if (!data) {
                    return;
                }
                const param = data.fundType;
                const inter = this.state.interactive;
                let firstList = param.firstFundType;
                // 转数组
                if (!!firstList){
                    firstList = firstList.split(",");
                    const newResult = firstList.map((item) => {
                        const ob = {
                            name : childParamList[item],
                            code : +item
                        };
                        return ob;
                    });
                    inter.result = newResult;
                } else {
                    inter.result = [{ index: "", code: "all" }];
                }

                this.setState({
                    name        : superParamList[param.superFundType],
                    interactive : inter
                });
            };
            this.formatData = (data) => {
                if (F.isEmpty(data)){
                    return;
                }
                const param = data;
                F.deleteEmptyProperty(param);
                const newPram = param.firstFundType.map((item) => {
                    return item.code;
                });

                return {
                    superFundType : this.props.fund.filterConditions ? this.props.fund.filterConditions.fundType.superFundType : 0,
                    firstFundType : newPram,
                };
            };
            this.setParam = () => {
                const str = JSON.stringify(this.param);
                let newParam = JSON.parse(str);
                newParam = this.formatData(newParam);
                if (newParam.firstFundType[0] === "all"){
                    delete newParam.firstFundType;
                }

                if (!!newParam.firstFundType ){
                    newParam.firstFundType = newParam.firstFundType.join(",");
                }
                this.props.changeParam(newParam, "fundType");
            };
        }

        componentWillReceiveProps(nextProps){
            nextProps.fund !== this.props.fund && this.getDefault(nextProps.fund.filterConditions);
        }
        componentDidMount(){
            this.getDefault(this.props.fund.filterConditions);
        }
        render(){
            const param = {
                name            : this.props.fund.filterConditions ? superParamList[this.props.fund.filterConditions.fundType.superFundType] : "",
                config          : this.props.fund.filterConditions ? this.props.config[this.props.fund.filterConditions.fundType.superFundType] : this.props.config[0],
                interactive     : this.state.interactive,
                result          : this.state.interactive.result,
                changeChildType : (value) => this.changeChildType(value)
            };
            return (
                <View{...param}/>
            );
        }
    };
};

module.exports = FundTypeContainer;
