/**
 * 首页筛选逻辑层
 *
 * 二级债基类型
 *
 */

const RenderFilter = require("../common/renderFilterResultList");
const Render = new RenderFilter();

// 删除逻辑
const Delete = require("../common/delete");
const Clear = new Delete();

let that;
export class OpenFundType{
    constructor(){
        that = this;
    }
    handleClickOpenFundType(data){
        let arr;
        const allSelect = 0;
        if (data.index !== 0){
            arr = this.state.openFundParam;
            const temp = [];
            let isIn = false;
            // 如果已经存在就删除之
            arr.forEach( (item) => {
                if ( item.index === data.index){
                    isIn = true;
                } else {
                    temp.push(item);
                }
            });
            // 不存在添加
            if (!isIn){
                temp.push(data);
            }
            // 去掉全部
            if (!!temp.length && temp[0].index === allSelect){
                temp.shift(0);
            }

            arr = temp;
            // 如果被删除完了变成全部
            if (arr.length === 0){
                arr = [{
                    index    : 0,
                    typeCode : ""
                }];
                this.ParamForSave.fundType.superParamArr = [];
                const param = this.state.fundTypeParam;
                param.isAny = true;
                param.activeItem = -1;
                Render.deleteThisFilterListItem.call(this, 3, arr);
                this.setState({
                    fundTypeParam: param
                });
            }
        } else {
            arr = [{
                index    : 0,
                typeCode : ""
            }];
            this.ParamForSave.fundType.superParamArr = [];
            const param = this.state.fundTypeParam;
            param.isAny = true;
            param.activeItem = -1;
            Render.deleteThisFilterListItem.call(this, 3, arr);
            this.setState({
                fundTypeParam: param
            });
        }

        this.setState({
            openFundParam: arr
        });

        const temp = [];
        arr.forEach((item) => {
            temp.push(item.typeCode);
        });
        that.needFundTypeShow.call(this, arr);
        if (arr[0].index !== 0){
            this.ParamForSave.fundType.superParamArr = temp;
            this.ParamForSave.fundType.superParamStr = temp.join(",");
        }

        Render.renderFilterResultList.call(this);

    }
    needFundTypeShow(arr){
        let needFundTypeShow = false;
        arr.forEach((item) => {
            if (item.index === 0 || item.index === 1 ){
                needFundTypeShow = true;
            }
        });
        const tempFundType = {
            isAny      : this.state.fundTypeParam.isAny,
            activeItem : this.state.fundTypeParam.activeItem,
            item       : this.state.fundTypeParam.item,
            show       : needFundTypeShow,
            name       : this.state.fundTypeParam.name
        };
        if (!needFundTypeShow){

            Clear.handleClickAny.call(this, 3);
            tempFundType.isAny = true;
            tempFundType.activeItem = -1;
        }
        if (arr.length === 1 && arr[0].index === 0){
            tempFundType.isAny = true;
            tempFundType.activeItem = -1;
        }
        this.setState({
            fundTypeParam: tempFundType
        });

    }
    handleClickMonetaryFundType(data){
        let arr;
        const allSelect = 0;
        if (data.index !== 0){
            arr = this.state.openFundParam;
            const temp = [];
            let isIn = false;
            // 如果已经存在就删除之
            arr.forEach( (item) => {
                if ( item.index === data.index){
                    isIn = true;
                } else {
                    temp.push(item);
                }
            });
            // 不存在添加
            if (!isIn){
                temp.push(data);
            }
            // 去掉全部
            if (!!temp.length && temp[0].index === allSelect){
                temp.shift(0);
            }

            arr = temp;
            // 如果被删除完了变成全部
            if (arr.length === 0){
                arr = [{
                    index    : 0,
                    typeCode : "both"
                }];
                this.ParamForSave.fundType.superParamArr = [];
            }
        } else {
            arr = [{
                index    : 0,
                typeCode : ""
            }];
            this.ParamForSave.fundType.superParamArr = [];
        }

        this.setState({
            openFundParam: arr
        });

        const temp = [];
        arr.forEach((item) => {
            temp.push(item.typeCode);
        });
        if (arr.length == 2){
            this.ParamForSave.fundType.superParamArr = ["both"];
            this.ParamForSave.fundType.superParamStr = [];
        } else if (arr[0].index !== 0){
            this.ParamForSave.fundType.superParamArr = temp;
            this.ParamForSave.fundType.superParamStr = temp.join(",");
        }

        Render.renderFilterResultList.call(this);

    }
    
}

module.exports = OpenFundType;
