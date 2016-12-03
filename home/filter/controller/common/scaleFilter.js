/**
 * 首页筛选逻辑层
 *
 * VC分离实验
 *
 */
const RenderFilter = require("./renderFilterResultList");
const Render = new RenderFilter();

const FilterNum = require("../../../../common/filter/filter");


let hasOption;
export class ScaleFilter{    
    handleClickScale(type){
        const tempState = this.state.fundScaleParam;
        tempState.isAny = false;
        tempState.activeItem = type;
        tempState.showOption = false;

        this.setState({
            fundScaleParam: tempState
        });
        // 开始渲染结果选项
        this.ParamForSave.scale = type;
        this.ParamForSave.sortList.push(this.basicConfig.scaleSort);
        Render.renderFilterResultList.call(this, 2, this.ParamForSave.scale);
    }

    handleShowOption(){
        const tempSc = this.state.fundScaleParam;
        if (this.state.fundScaleParam.showOption === true && !hasOption){ // 不填写收回
            if (!!this.state.fundScaleParam.activeItem){ // 之前有选择的
                tempSc.isAny = true;
                tempSc.showOption = false;
                if (tempSc.activeItem > 0){
                    tempSc.isAny = false;
                }
            }
        } else if (tempSc.showOption === false && hasOption){ // 填写收回
            tempSc.showOption = true;

        } else if (hasOption){ // 填写收回
            tempSc.isAny = false;
            tempSc.showOption = false;
            tempSc.activeOption = true;
            tempSc.showChild = false;
        } else {
            tempSc.isAny = false;
            tempSc.showOption = true;
            tempSc.showChild = false;
        }
        this.setState({
            fundScaleParam: tempSc
        });
    }



    handleSendScaleOption(){
        this.ParamForSave.sortList.push(this.basicConfig.scaleSort);
        
        let temp = {
            start : false,
            end   : false,
        };
        let s1 = parseFloat(this.ParamForSave.scaleOptionData.startSc);
        let s2 = parseFloat(this.ParamForSave.scaleOptionData.endSc);


        let name = `规模:${s1}-${s2}亿`;

        const warningSca1 = (this.ParamForSave.scaleOptionData.startSc === "" && this.ParamForSave.scaleOptionData.endSc === "") || (!(typeof s1 === "number") && !(this.ParamForSave.scaleOptionData.startSc === "") ) || (s1 > s2) || (s1 === s2) || (isNaN(s1) && !(this.ParamForSave.scaleOptionData.startSc === ""));
        const warningSca2 = !(this.ParamForSave.scaleOptionData.endSc === "") && !(typeof s2 === "number") || (isNaN(s2) && !(this.ParamForSave.scaleOptionData.endSc === ""));

        s1 = new FilterNum(s1);
        s1 = s1.numberFixedDigit(2).result;
        s2 = new FilterNum(s2);
        s2 = s2.numberFixedDigit(2).result;
        if (warningSca1){ // 1） 若未输入最低规模和最高规模 2） 若最低规模输入字母或格式不正确 4） 若最低规模大于最高规模
            temp = {
                start : true,
                end   : false,
            };
        } else if (warningSca2){ // 3） 若最高规模输入字母或格式不正确
            temp = {
                start : false,
                end   : true,
            };
        } else {
            if (this.ParamForSave.scaleOptionData.endSc === ""){ // 若只输入了最低规模
                name = `规模:${s1}亿以上`;
                this.ParamForSave.scaleOption.resultForAjax.sg = s1;
                this.ParamForSave.scaleOption.resultForAjax.st = "";
            } else if (this.ParamForSave.scaleOptionData.startSc === ""){ // 若只输入了最高规模
                name = `规模:${s2}亿以下`;
                this.ParamForSave.scaleOption.resultForAjax.sg = "";
                this.ParamForSave.scaleOption.resultForAjax.st = s2;
            } else {
                this.ParamForSave.scaleOption.resultForAjax.sg = s1;
                this.ParamForSave.scaleOption.resultForAjax.st = s2;
                name = `规模:${s1}-${s2}亿`;
            }
            // 渲染结果
            this.ParamForSave.scaleOption.resultForRender = name;
            this.ParamForSave.scale = this.ParamForSave.scaleOption;
            Render.renderFilterResultList.call(this, 2, this.ParamForSave.scale);
        }

        this.setState({
            warningSc      : temp,
            fundScaleParam : {
                isAny      : false,
                activeItem : -1, // 被点击的公司字母
                showOption : true,
            }
        });
        // 清楚上一次的结果
        // scaleOptionData = {
        //     startSc : "",
        //     endSc   : "",
        // };
        // this.refs.fundScale.refs.startSc.value = "";
        // this.refs.fundScale.refs.endSc.value = "";

    }

    getStartSc(value){
        hasOption = true;
        this.ParamForSave.scaleOptionData.startSc = value;
    }
    getEndSc(value){
        hasOption = true;
        this.ParamForSave.scaleOptionData.endSc = value;
    }
}

module.exports = ScaleFilter;
