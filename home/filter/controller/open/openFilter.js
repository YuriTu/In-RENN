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

const Option = require("../../../../common/optionFilter/optionFIlter");

const Stars = require("../../../../common/starts/starts");



let that;
export class OpenFilter{
    constructor(data){
        that = this;
    }

    // 建立多个对象以完成分辨
    /**
     * 二级子菜单的选中
     * @param {object} superParam zj 成立至今 y今年以来
     * @param {string} itemName 波动率
     * @param {symbol} symbol 大于小于符号 0《= 1》=
     * @param {string} noteName 记录变量名称
     * @param {boolean} update 是否是update
     * @return {function} null
     */
    handleClickOpenParam(superParam, itemName, symbol, noteName, update){
        // 取得state钩子
        const fundOpenParamString = noteName.substring(4, noteName.indexOf("Active"));
        const newParam = `fund${fundOpenParamString}Param`;
        if (superParam.superCode === this.state[newParam].activeItem && !(update === true) && (!!this.state[newParam].showChild) ){
            that.closeOpenParamList.call(this, noteName, newParam);
            return;
        }
        that.renderOpenParamList.call(this, superParam, itemName, symbol, noteName, update);

    }
    renderOpenParamList(superParam, itemName, symbol, noteName, update){
        // 取得state钩子
        const fundOpenParamString = noteName.substring(4, noteName.indexOf("Active"));
        const newParam = `fund${fundOpenParamString}Param`;
        const dataArr = this.basicConfig.openFundParam;
        const htmlArr = [];
        const temp = this.state[newParam];

        let showPer = false;
        if (itemName.indexOf("波动") >= 0 || itemName.indexOf("回撤") >= 0){
            showPer = true;
        }


        for (let i = 0;i < dataArr.length;i++){
            htmlArr.push(
                <li
                    className={`childParamItem${this.state[noteName][superParam.superCode] === dataArr[i].code ? " fl-activeChildParam" : ""}`}
                    onClick = {that.handleClickOpenItem.bind(this, superParam, dataArr[i], itemName, noteName, symbol)}
                    key = {`${itemName}${superParam}:${dataArr[i].name}`}
                >
                    {dataArr[i].name}
                </li>
            );
        }
        const optionName = itemName.slice(0, -1);
        htmlArr.push(
            <li
                className=" no-right-margin"
                key = {`${itemName}${superParam}:自定义`}
            >
                <Option
                    dir = {symbol}
                    optionName = {optionName}
                    showPer = {showPer}
                    getOptionFilter = {that.getOptionFilter.bind(this, itemName, superParam, symbol, noteName)}
                ></Option>
            </li>
        );
        temp.isAny = false;
        temp.activeItem = superParam.superCode;
        temp.childData = htmlArr;
        temp.showChild = true;
        temp.param = superParam;
        this.setState({
            [newParam]: temp
        });
    }
    compareID(type, data){
        switch (type){
            case 0:{
                this.setState({
                    fundVolatilityParam: data
                });
            }
                break;
            case 1:{
                this.setState({
                    fundSharpParam: data
                });
            }
                break;
            case 2:{
                this.setState({
                    fundKamaParam: data
                });
            }
                break;
            case 3:{
                this.setState({
                    fundRetracementParam: data
                });
            }
                break;
        }
    }
    closeOpenParamList(noteName, newParam){
        const temp = this.state[newParam];
        if (Object.getOwnPropertyNames(this.state[noteName]).length > 0){ // 有被选中的
            const selectNameArr = Object.getOwnPropertyNames(this.state[noteName]);
            let hasValueItem;
            for (let i = selectNameArr.length - 1;i >= 0;i--){ // 找到最近的被选中的项目
                if ( this.state[noteName] [selectNameArr [i]] !== -1){
                    hasValueItem = selectNameArr [i];
                    break;
                }
            }
            if (hasValueItem !== undefined){ // 不能是添加后删除的
                if (hasValueItem === temp.activeItem){ // 被选中的 项目 与 被点击的相同 关闭子选项
                    temp.isAny = false;
                    temp.activeItem = hasValueItem;
                    // temp.achieveData =temp.htmlArr
                    temp.showChild = !temp.showChild;
                } else {  // 不同则为   关闭当前选项  高亮 被添加进分类的选项
                    temp.isAny = false;
                    temp.activeItem = hasValueItem;
                    // temp.achieveData = temp.htmlArr
                    temp.showChild = false;// 关闭选项,高亮已添加选项
                }
            } else { // 如果是添加后全删了  就是 无普通选择 底下一段是复制的 有自定义情况
                temp.isAny = true;
                temp.showChild = false;
                temp.activeItem = -1;
            }
        } else { // 无普通选择

            temp.isAny = true;
            temp.showChild = false;
            temp.activeItem = -1;
        }
        this.setState({
            [newParam]: temp
        });
    }

    /**
     * 星星评级
     * @param {object} superParam 海通等信息
     * @param {boolean} update 是否是update
     * @return {null} null
     */
    handleClickRatingsParam(superParam, update){
        if (superParam.code === this.state.fundRatingParam.activeItem && !(update === true) && (!!this.state.fundRatingParam.showChild) ){

            return that.closeRatingParamList.call(this, "fundRatingParam");
        }
        return that.renderRatingList.call(this, superParam, update);
    }
    renderRatingList(superParam, update){
        const dataArr = this.basicConfig.ratingChild;
        const htmlArr = [];
        const temp = this.state.fundRatingParam;


        for (let i = 0;i < dataArr.length;i++){
            htmlArr.push(
                <li
                    className={
                        `childParamItem${this.state.noteRatingActiveItem[superParam.name].toString().indexOf(dataArr[i].code) >= 0 ? " fl-activeChildParam" : ""}`
                    }
                    key = {dataArr[i].name}
                >
                    <Stars
                        key = {`${dataArr[i].name}start`}
                        starCount= {dataArr[i].code}
                        clickStar = {that.handleClickOpenItem.bind(this, superParam, dataArr[i], "rating", "noteRatingActiveItem", -1)}
                    ></Stars>
                </li>
            );
        }
        temp.isAny = false;
        temp.activeItem = superParam.code;
        temp.activeItemName = superParam.name;
        temp.childData = htmlArr;
        temp.showChild = true;
        temp.showOption = false;
        
        return temp;
    }
    closeRatingParamList(){
        const temp = this.state.fundRatingParam;
        let hasFlag = false;
        let hasKey;
        for (const x in this.state.noteRatingActiveItem){
            if (this.state.noteRatingActiveItem[x].length > 0){
                hasFlag = true;
                hasKey = x;
            }
        }
        if (hasFlag){ // 有被选中的
            let hasValueItem = "";
            switch (hasKey){
                case "海通评级":hasValueItem = "haitong";
                    break;
                case "上证评级":hasValueItem = "shangzheng";
                    break;
                case "招商评级":hasValueItem = "zhaoshang";
                    break;
                case "济安评级":hasValueItem = "jian";
            }
            if (hasValueItem !== undefined){ // 不能是添加后删除的
                if (hasValueItem === temp.activeItem){ // 被选中的 项目 与 被点击的相同 关闭子选项
                    temp.isAny = false;
                    temp.activeItem = hasValueItem;
                    // temp.achieveData =temp.htmlArr
                    temp.showChild = !temp.showChild;
                } else {  // 不同则为   关闭当前选项  高亮 被添加进分类的选项
                    temp.isAny = false;
                    temp.activeItem = hasValueItem;
                    // temp.achieveData = temp.htmlArr
                    temp.showChild = false;// 关闭选项,高亮已添加选项
                }
            } else { // 如果是添加后全删了  就是 无普通选择 底下一段是复制的 有自定义情况
                temp.isAny = true;
                temp.showChild = false;
                temp.activeItem = -1;
            }
        } else { // 无普通选择

            temp.isAny = true;
            temp.showChild = false;
            temp.activeItem = -1;
        }
        return temp;
    }

    /**
     * 点击开放四项二级选项
     * @param {object}superParam 一级选项
     * @param {object} childParam 二级选项
     * @param {string} itemName  pating
     * @param {string} noteName 记录变量名称
     * @param {symbol} symbol 大于小于符号 0《= 1》=
     * @return {null} null
     */
    handleClickOpenItem(superParam, childParam, itemName, noteName, symbol){
        this.ParamForSave.sortList.push(superParam.sortID);
        const objectForNote = {
            itemName : itemName,
            noteName : noteName,
            symbol   : symbol,
        };
        switch (itemName){
            case "波动率:":{
                this.ParamForSave.volatilityParam = that.formatOpenParam(this.ParamForSave.volatilityParam, superParam, childParam);

                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 4, this.ParamForSave.volatilityParam);
            }
                break;
            case "夏普:":{
                this.ParamForSave.sharpParam = that.formatOpenParam(this.ParamForSave.sharpParam, superParam, childParam);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 5, this.ParamForSave.sharpParam);
            }
                break;
            case "卡玛:":{
                this.ParamForSave.kamaParam = that.formatOpenParam(this.ParamForSave.kamaParam, superParam, childParam);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 6, this.ParamForSave.kamaParam);
            } break;
            case "最大回撤:":{
                this.ParamForSave.retracementParam = that.formatOpenParam(this.ParamForSave.retracementParam, superParam, childParam);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 7, this.ParamForSave.retracementParam);
            } break;
            case "rating":{

                const isIn = that.isRatingSeleted(this.ParamForSave.ratingParam, superParam, childParam);
                this.ParamForSave.ratingParam = that.formatRatingParam(this.ParamForSave.ratingParam, superParam, childParam, isIn);
                that.noteRatingItem.call(this, superParam, childParam, isIn);
                Render.renderFilterResultList.call(this, 8, this.ParamForSave.ratingParam);
            } break;
        }
    }

    /**
     * 开放四项格式化参数
     * @param {object} saveParam  存储对象引用
     * @param {object} superParam 父级参数
     * @param {object} childParam  子级参数
     * @returns {*} null
     */
    formatOpenParam(saveParam, superParam, childParam){
        if (saveParam.forRender.length === 0) {
            saveParam.forRender = [
                {
                    name : "year",
                    str  : null,
                    sort : 0,
                },
                {
                    name : "untilNow",
                    str  : null,
                    sort : 0,
                }
            ];
            saveParam.forAjax = {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            };

        }
        if (superParam.superCode === "year"){
            saveParam.forAjax["1year"] = {
                "rank" : childParam.code,
                "min"  : "",
                "max"  : ""
            };
            saveParam.forRender[0].str = `${superParam.superName} : ${childParam.name}`;
            saveParam.forRender[0].sort = superParam.sortID;
        } else {
            saveParam.forAjax["untilNow"] = {
                "rank" : childParam.code,
                "min"  : "",
                "max"  : ""
            };
            saveParam.forRender[1].str = `${superParam.superName} : ${childParam.name}`;
            saveParam.forRender[1].sort = superParam.sortID;
        }
        
        return saveParam;
    }
    // 格式化开放四项自定义参数
    // symlbol 0 《= 取得最大值 1 》= 最小值
    formatOptionParam(saveParam, superParam, symbol, inputData){
        if (saveParam.forRender.length === 0) {
            saveParam.forRender = [
                {
                    name : "year",
                    str  : null,
                },
                {
                    name : "untilNow",
                    str  : null,
                }
            ];
            saveParam.forAjax = {
                "1year": {
                    rank : "",
                    min  : "",
                    max  : "",
                },
                "untilNow": {
                    rank : "",
                    min  : "",
                    max  : "",
                }
            };
        }

        if (superParam.superCode === "year"){
            if (!!symbol){
                saveParam.forAjax["1year"] = {
                    "rank" : "",
                    "min"  : inputData,
                    "max"  : ""
                };
                saveParam.forRender[0].str = `${superParam.superName} : 大于等于 ${inputData}`;
            } else {
                saveParam.forAjax["1year"] = {
                    "rank" : "",
                    "min"  : "",
                    "max"  : inputData
                };
                saveParam.forRender[0].str = `${superParam.superName} : 小于等于 ${inputData}`;
            }
        } else if (!!symbol){
            saveParam.forAjax["untilNow"] = {
                "rank" : "",
                "min"  : inputData,
                "max"  : ""
            };
            saveParam.forRender[1].str = `${superParam.superName} : 大于等于 ${inputData}`;
        } else {
            saveParam.forAjax["untilNow"] = {
                "rank" : "",
                "min"  : "",
                "max"  : inputData
            };
            saveParam.forRender[1].str = `${superParam.superName} : 小于等于 ${inputData}`;
        }

        return saveParam;
    }
    isRatingSeleted(saveParam, superParam, childParam){
        // 判断是否已经加入了
        let isIn = false;
        saveParam.forRender[superParam.name].forEach( (item) => {
            if (item === childParam.name){
                isIn = true;
            }
        });
        return isIn;
    }
    formatRatingParam(saveParam, superParam, childParam, isIn){

        if (!isIn){
            saveParam.forRender[superParam.name].push(childParam.name);
            saveParam.forAjax[superParam.code].push(childParam.code);
        } else {
            const newRender = [];
            const newAjax = [];
            saveParam.forRender[superParam.name].forEach( (item) => {
                if (item !== childParam.name){
                    newRender.push(item);
                }
            });
            saveParam.forRender[superParam.name] = newRender;
            saveParam.forAjax[superParam.code].forEach( (item) => {
                if (item !== childParam.code){
                    newAjax.push(item);
                }
            });
            saveParam.forAjax[superParam.code] = newAjax;
        }

        return saveParam;
    }


    /**
     * 记录高亮列表
     * @param {string} noteName 用于记录sate的名称
     * @param {object} superParam sortID 11  superCode "year" superName "近1年"
     * @param {object} childParam code 10 name "前10名"
     * @param {objectForNote} objectForNote 存贮的临时值
     * @return {null}  null
     */
    noteOpenActiveItem(noteName, superParam, childParam, objectForNote){
        // 添加高亮对比
        const noteOpenActiveItem = this.state[noteName];
        noteOpenActiveItem[superParam.superCode] = childParam.code;
        this.setState({
            [noteName]: noteOpenActiveItem
        });
        // 强制进行两个点击帅新页面 ...
        // 参数为 superParam, itemName, symbol,noteName, update
        that.renderOpenParamList.call(this, superParam, objectForNote.itemName, objectForNote.symbol, objectForNote.noteName, true);

    }
    // 评级高亮列表

    noteRatingItem(superParam, childParam, isIn){
        // 四项评级的对比项目 。。评级
        const noteRatingActiveItem = this.state.noteRatingActiveItem;
        let fundRatingParam;
        if (isIn){
            const newList = [];
            noteRatingActiveItem[superParam.name].forEach((item) => {
                if (item !== childParam.code){
                    newList.push(item);
                }
            });
            noteRatingActiveItem[superParam.name] = newList;
            // 判断是否还有选项,有-》跳转之,没有 -》 点击any
            fundRatingParam = that.judgeRatingJump.call(this, this.basicConfig.ratingParam, noteRatingActiveItem);

        } else {
            this.ParamForSave.sortList.push(superParam.sortID);
            noteRatingActiveItem[superParam.name].push(childParam.code);
            fundRatingParam = that.renderRatingList.call(this, superParam);
        }
        this.setState({
            noteRatingActiveItem : noteRatingActiveItem,
            fundRatingParam      : fundRatingParam
        });

    }
    // 一级目录配置 记录高亮文件

    judgeRatingJump(config, noteData){
        // 找那个选项有值。length》0 记录
        let hasValueName = null;
        let rs = null;
        for (const x in noteData){
            if (noteData[x].length > 0){
                hasValueName = x;
            }
        }
        if (!!hasValueName){
            let superParam = {};
            config.forEach( (item) => {
                if (item.name === hasValueName){
                    superParam = item;
                }
            });
            // 删除对应的sortid
            this.ParamForSave.sortList.pop();
            
            rs = that.renderRatingList.call(this, superParam);
        } else {
            rs = {
                isAny          : true,
                activeItem     : -1,
                activeItemName : "",
                childData      : [],
                showChild      : false,
                id             : 4,
            };
            this.ParamForSave.sortList = Render.deleteSortForAny(this.ParamForSave.sortList, this.basicConfig.ratingSortList);

        }
        return rs;
    }

    /**
     * 开放四项的自定义菜单点击
     * @param {string} itemName 特征名
     * @param {object} superParam  父级参数
     * @param {num} symbol  大于符号参数
     * @param {string} noteName  state记录
     * @param {object} data  自定义用户输入数据
     * @return {null} null
     */
    getOptionFilter(itemName, superParam, symbol, noteName, data){
        this.ParamForSave.sortList.push(superParam.sortID);
        // 取得state钩子
        const fundOpenParamString = noteName.substring(4, noteName.indexOf("Active"));
        const newParam = `fund${fundOpenParamString}Param`;
        const temp = this.state[newParam];
        if (isNaN(data) || data === undefined || data === ""){
            temp.warning = true;
            this.setState({
                [newParam]: temp
            });
            return;
        } else {
            temp.warning = false;
            this.setState({
                [newParam]: temp
            });
        }
        const objectForNote = {
            itemName : itemName,
            noteName : noteName,
            symbol   : symbol,
        };
        const childParam = {
            code: 1
        };
        switch (itemName){
            case "波动率:":{
                this.ParamForSave.volatilityParam = that.formatOptionParam(this.ParamForSave.volatilityParam, superParam, symbol, data);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 4, this.ParamForSave.volatilityParam);
            }
                break;
            case "夏普:":{
                this.ParamForSave.sharpParam = that.formatOptionParam(this.ParamForSave.sharpParam, superParam, symbol, data);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 5, this.ParamForSave.sharpParam);
            }
                break;
            case "卡玛:":{
                this.ParamForSave.kamaParam = that.formatOptionParam(this.ParamForSave.kamaParam, superParam, symbol, data);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 6, this.ParamForSave.kamaParam);
            } break;
            case "最大回撤:":{
                this.ParamForSave.retracementParam = that.formatOptionParam(this.ParamForSave.retracementParam, superParam, symbol, data);
                that.noteOpenActiveItem.call(this, noteName, superParam, childParam, objectForNote);
                Render.renderFilterResultList.call(this, 7, this.ParamForSave.retracementParam);
            } break;
        }
    }


}

module.exports = OpenFilter;
