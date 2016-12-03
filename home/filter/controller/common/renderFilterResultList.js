/**
 * render 逻辑
 */
const React = require("react");

const Component = React.Component;

const Ajax = require("./ajax");

const ajax = new Ajax();

let _Render;
export class RenderFilterResult extends Component{
    constructor(){
        super();
        _Render = this;
    }

    /**
     * 筛选选项结果面板
     * @renderFilterResultList 渲染整个面板
     */   

    renderFilterResultList(Paramtype, Param){
        _Render.formatData.call(this, Paramtype, Param);
        const company = _Render.renderCompanyResult.call(this, this.ParamForSave.company.name);
        const achieve = _Render.renderAchieveResult.call(this, this.ParamForSave.achieve);

        let scale;
        if (typeof this.ParamForSave.scale === "number"){
            scale = _Render.renderScaleResult.call(this, this.ParamForSave.scale);
        } else {
            scale = _Render.renderScaleOption.call(this, this.ParamForSave.scale);
        }
        const type = _Render.renderTypeResult.call(this, this.ParamForSave.type);

        const fundType = _Render.renderFundTypeResult.call(this, this.ParamForSave.fundType);
        const volatility = _Render.renderOpenFundParamResult.call(this, this.ParamForSave.volatilityParam.forRender, "波动率:", "volatilityParam", 4);
        const sharp = _Render.renderOpenFundParamResult.call(this, this.ParamForSave.sharpParam.forRender, "夏普:", "sharpParam", 5);
        const kama = _Render.renderOpenFundParamResult.call(this, this.ParamForSave.kamaParam.forRender, "卡玛:", "kamaParam", 6);
        const retracement = _Render.renderOpenFundParamResult.call(this, this.ParamForSave.retracementParam.forRender, "最大回撤:", "retracementParam", 7);
        
        const rating = _Render.renderRatingParamResult.call(this, this.ParamForSave.ratingParam);
        
        
        const temp = [];
        temp.push(company);
        temp.push(achieve);
        temp.push(scale);
        temp.push(type);
        temp.push(fundType);
        temp.push(volatility);
        temp.push(sharp);
        temp.push(kama);
        temp.push(retracement);
        temp.push(rating);


        const newParam = ajax.setParamForAjax(this.ParamForSave);
        
        // 读取是否有上次保存的情况
        if (this.ParamForAjax.sortForUnMount > 0){
            newParam.sortedBy = this.ParamForAjax.sortForUnMount;
            this.ParamForAjax.sortForUnMount = -1;
        }
        if (this.ParamForAjax.sortDirForUnMount > 0){
            newParam.sortedDirection = this.ParamForAjax.sortDirForUnMount;
            this.ParamForAjax.sortDirForUnMount = -1;
        }
        // 渲染筛选结果
        this.setState({
            ParamForPanel : temp,
            ajaxParam     : newParam
        });
    }

    // 渲染公司结果
    renderCompanyResult(names){
        // 判断个数,如果是>1个就加公司名称
        if (names.length !== 0){
            const tempArr = [];
            let tempText = "公司:";
            for (let i = 0;i < names.length;i++){
                // 公司在2个以下 公司: xx xx
                if (i < 2){
                    tempText = `${tempText}\t${names[i]}`;
                } else if (i === 2) {
                    // 2个以上 公司: xx xx ...
                    tempText = `${tempText}...`;
                }
            }
            tempArr.push(

                <li className="filterItem" key = {tempText}>
                    <div style={{ "wordSpacing": "6px" }}>{tempText}</div>
                    <i onClick = {_Render.deleteThisFilterListItem.bind(this, 0)} className="icon icon-cancel-circle"></i>
                </li>
            );
            return tempArr;
        }
        // 等于零删除之
        return null;
        
    }
    // 渲染业绩结果
    renderAchieveResult(data){
        this.ParamForSave.achieveParam = [];
        const tempArr = [];
        data.forEach( (item) => {
            // 渲染结果处理
            let tempText;
            let objectForDeleteInfo;
            if (item.childOptionName === ""){
                tempText = `${item.name} : ${item.childName}`;
                objectForDeleteInfo = {
                    date : item.code,
                    rank : item.childCode,
                    sort : item.sortID
                };
            } else {
                tempText = `${item.name} : ${item.childOptionName}`;
                objectForDeleteInfo = {
                    date : item.code,
                    rank : item.childOptionCode,
                    sort : item.sortID
                };
            }
            tempArr.push(
                <li className="filterItem" key = {tempText}>
                    <div>{tempText}</div>
                    <i onClick = {_Render.deleteAchieveListItem.bind(this, objectForDeleteInfo)} className="icon icon-cancel-circle"></i>
                </li>
            );
            const paramForAjax = {
                yieldRank : item.code,
                minyield  : item.childOptionCode,
                maxyield  : "",
                rank      : item.childCode.toString()
            };
            this.ParamForSave.achieveParam.push(paramForAjax);
        });
        return tempArr;
    }

    // 渲染规模结果
    renderScaleResult(data){
        if (data){
            let tempText = "";
            const tempArr = [];
            switch (data){
                case 1:tempText = location.hash.indexOf("monetary") > -1 ? "规模:50亿以上" : "规模:2亿以上";
                    break;
                case 2:tempText = location.hash.indexOf("monetary") > -1 ? "规模:100亿以上" : "规模:5亿以上";
                    break;
                case 3:tempText = location.hash.indexOf("monetary") > -1 ? "规模:200亿以上" : "规模:10亿以上";
                    break;
                case 4:tempText = location.hash.indexOf("monetary") > -1 ? "规模:500亿以上" : "规模:20亿以上";
                    break;
                case 5:tempText = location.hash.indexOf("monetary") > -1 ? "规模:1000亿以上" : "规模:50亿以上";
                    break;
                case 6:tempText = "规模:100亿以上";
                    break;
            }
            tempArr.push(
                <li className="filterItem" key = {tempText}>
                    <div>{tempText}</div>
                    <i onClick = {_Render.deleteThisFilterListItem.bind(this, 2)} className="icon icon-cancel-circle"></i>
                </li>
            );
            this.ParamForSave.scale = data;
            return tempArr;
        }
        return null;
    }
    // 渲染自定义规模结果
    renderScaleOption(data){
        if (!!data && !!data.resultForRender){
            const resultForRender = data.resultForRender;
            const resultForAjax = data.resultForAjax;
            const tempArr = [];
            tempArr.push(
                <li className="filterItem" key = {resultForRender}>
                    <div>{resultForRender}</div>

                    <i onClick = {_Render.deleteThisFilterListItem.bind(this, 2)} className="icon icon-cancel-circle"></i>

                </li>
            );
            return tempArr;
        }
    }
    // 渲染类型结果
    renderTypeResult(data){
        if (!!data.name){
            const tempText = `类型:${data.name}`;
            const tempArr = [];
            
            tempArr.push(
                <li className="filterItem" key = {tempText}>
                    <div>{tempText}</div>
                    <i onClick = {_Render.deleteThisFilterListItem.bind(this, 3)} className="icon icon-cancel-circle"></i>
                </li>
            );
            this.ParamForSave.type = data;
            return tempArr;
        }
        return null;
        
    }
    // 
    /**
     * 渲染债券二级基金类型
     * @param {arr} data 数组
     * @return {tempArr}  jaxArray
     */
    renderFundTypeResult(data){
        if (data.childParam){
            const tempText = `类型:${data.childParam.name}`;
            const tempArr = [];

            tempArr.push(
                <li className="filterItem" key = {tempText}>
                    <div>{tempText}</div>
                    <i onClick = {_Render.deleteThisFilterListItem.bind(this, 3)} className="icon icon-cancel-circle"></i>
                </li>
            );
            // 获得之前的字符串
            const param = this.ParamForSave.fundType.superParamArr;
            // 之前肯定有101003,去掉之
            const newParam = [];
            if (!!param){
                param.forEach((item) => {
                    if (item !== 101003){
                        newParam.push(item);
                    }
                });
            }
            this.ParamForSave.fundType.superParamArr = newParam;
            this.ParamForSave.fundType.childBondParamArr = [data.childParam.code];
            return tempArr;
        }        
        return null;
    }
    // 渲染开放式基金结果
    renderOpenFundParamResult(data, name, param, intNum, sort){
        const tempArr = [];
        if (data){
            data.forEach( (item) => {
                if (!!item.str){
                    const trueName = name.substr(0, name.length - 1);
                    const tempText = `${trueName}-${item.str}`;


                    tempArr.push(
                        <li className="filterItem" key = {tempText}>
                            <div>{tempText}</div>
                            <i onClick = {_Render.deleteThisFilterListItem.bind(this, intNum, item, item.sort)} className="icon icon-cancel-circle"></i>
                        </li>
                    );
                }
            });
            return tempArr;
        }
        return null;
    }
    // 渲染基金评级结果
    renderRatingParamResult(data){
        if (data.forRender){
            const tempArr = [];
            let key, value;
            for (const x in data.forRender){
                key = x;
                value = data.forRender[x].join("、");
                if (value !== ""){
                    const tempText = `${key}: ${value}`;

                    tempArr.push(
                        <li className="filterItem" key = {tempText}>
                            <div>{tempText}</div>
                            <i onClick = {_Render.deleteThisFilterListItem.bind(this, 8, key)} className="icon icon-cancel-circle"></i>
                        </li>
                    );
                }
            }
            return tempArr;
        }
        return null;
    }

    deleteSortList(arr, num){
        const newarr = [];
        arr.forEach( (item) => {
            if (item !== num){
                newarr.push(item);
            }
        });
        return newarr;
    }

    /**
     * 批量删除对比项
     * @param {array} arr 存放的结果
     * @param {array} numList 需要删除的项目数组
     * @return {array} rs
     */
    deleteSortForAny(arr, numList){
        let resultArr = arr;
        for (let i = 0;i < numList.length;i++){
            resultArr = this.deleteSortList(resultArr, numList[i]);
        }
        return resultArr;
    }
    // 删除此筛选备选项
    deleteThisFilterListItem(type, data, sort){
        switch (type){
            case 0:{

                this.ParamForSave.company.name = [];
                this.ParamForSave.company.code = [];
                const newObject = {};
                for (const x in this.state.noteCompanyActiveItem){
                    newObject[x] = this.state.noteCompanyActiveItem[x];
                    newObject[x] = false;
                }
                this.setState({
                    fundCompanyParam: {
                        isAny       : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem  : -1, // 被点击的公司字母
                        companyData : [],
                    },
                    noteCompanyActiveItem: newObject
                });
            }
                break;

            case 1:_Render.deleteAchieveListItem.call(this, data);
                break;
            case 2:{
                // 删除规模排序
                this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, this.basicConfig.scaleSort);
                

                this.ParamForSave.scale = null;
                this.setState({
                    fundScaleParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        showOption : false,
                    }
                });
                // 清楚input里面的placeholder
                
                this.refs.fundScale.refs.startSc.value = "";
                this.refs.fundScale.refs.endSc.value = "";

            }
                break;
            case 3:{
                if (window.location.href.indexOf("monetary") >= 0){
                    this.ParamForSave.type = {
                        name : null,
                        code : "",
                    };
                } else {
                    this.ParamForSave.fundType.childParam = null;
                    this.ParamForSave.fundType.childBondParamArr = [];
                    this.ParamForSave.fundType.childBondParamStr = [];

                    let has101003 = false;
                    try {
                        data.forEach( (item) => {
                            if (item.index === 1){
                                has101003 = true;
                            }
                        });
                    } catch (error){
                        this.state.openFundParam.forEach( (item) => {
                            if (item.index === 1){
                                has101003 = true;
                            }
                        });
                    }


                    if (has101003){
                        this.ParamForSave.fundType.superParamArr.push(101003);
                    }


                }


                this.setState({
                    fundTypeParam: {
                        isAny      : true, // 不限 是否被点击 ——是否展示二级页面
                        activeItem : -1, // 被点击的公司字母
                        item       : this.state.fundTypeParam.item,
                        show       : this.state.fundTypeParam.show,
                        name       : this.state.fundTypeParam.name,
                    }
                });
            }
                break;

            case 4:{
                const noteName = "noteVolatilityActiveItem";
                this.ParamForSave.volatilityParam = _Render.formatOpenParamAfterDelete(this.ParamForSave.volatilityParam, data.name);
                if (!!sort){
                    this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, sort);
                }
                _Render.deleteOpenParamListItem.call(this, data, noteName);
            }
                break;
            case 5:{
                const noteName = "noteSharpActiveItem";
                this.ParamForSave.sharpParam = _Render.formatOpenParamAfterDelete(this.ParamForSave.sharpParam, data.name);
                // 删除开放式排序
                if (!!sort){
                    this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, sort);
                }
                _Render.deleteOpenParamListItem.call(this, data, noteName);
            }
                break;
            case 6:{
                const noteName = "noteKamaActiveItem";
                this.ParamForSave.kamaParam = _Render.formatOpenParamAfterDelete(this.ParamForSave.kamaParam, data.name);

                if (!!sort){
                    this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, sort);
                }
                _Render.deleteOpenParamListItem.call(this, data, noteName);
            }
                break;
            case 7:{
                const noteName = "noteRetracementActiveItem";
                this.ParamForSave.retracementParam = _Render.formatOpenParamAfterDelete(this.ParamForSave.retracementParam, data.name);
                if (!!sort){
                    this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, sort);
                }
                
                _Render.deleteOpenParamListItem.call(this, data, noteName);
            }
                break;
            case 8:{
                this.ParamForSave.ratingParam = _Render.formatRatingParamAfterDelete(this.ParamForSave.ratingParam, data);
                _Render.deleteRatingListItem.call(this, data);
            }
                break;
        }
        _Render.renderFilterResultList.call(this);
    }
    
    deleteAchieveListItem(data){
        const noteAchieveChildItem = this.state.noteAchieveChildItem;
        if (!!data){
            this.ParamForSave.sortList = _Render.deleteSortList(this.ParamForSave.sortList, data.sort);    
        }
        
        try {
            const newParam = [];
            // 数组去重,获得新的用于渲染的数据
            this.ParamForSave.achieve.forEach((item) => {
                if (item.code !== data.date){
                    newParam.push(item);
                }
            });

            this.ParamForSave.achieve = newParam;
            noteAchieveChildItem[data.date] = -1;
            this.setState({
                noteAchieveChildItem: noteAchieveChildItem
            });

            const temp = {
                isAny       : this.state.fundAchieveParam.isAny,
                activeItem  : this.state.fundAchieveParam.activeItem,
                achieveData : this.state.fundAchieveParam.achieveData,
                showOption  : this.state.fundAchieveParam.showOption,
                showChild   : this.state.fundAchieveParam.showChild,
            };
            // 如果项目还有被选中的 模拟点击选中之
            // if (Object.getOwnPropertyNames(this.ParamForSave.achieve).length > 0){  for be
            if (this.ParamForSave.achieve.length > 0){
                const lastLight = this.ParamForSave.achieve[this.ParamForSave.achieve.length - 1];
                const tempParam = {
                    code   : lastLight.code,
                    name   : lastLight.name,
                    sortID : lastLight.sortID,
                };
                this.refs.fundAchieve.handleCilck(tempParam);

            } else {
                 // 没有任何被选中的项目了
                temp.isAny = true;
                temp.activeItem = -1;
                temp.showChild = false;
                temp.showOption = false;
                this.setState({
                    fundAchieveParam: temp
                });
            }
            return _Render.renderFilterResultList.call(this);
        } catch (error) {
            this.ParamForSave.achieve = [];
        }
        // 清除与不限 的情况
        this.ParamForSave.achieve = [];
        this.setState({
            fundAchieveParam: {
                isAny       : true, // 不限 是否被点击 ——是否展示二级页面
                activeItem  : -1, // 被点击的公司字母
                achieveData : [],
                showOption  : false,
            },
            noteAchieveChildItem: {}
        });

        _Render.renderFilterResultList.call(this);
    }

    /**
     * 开放四项的panel删除
     * @param {object}data panle信息
     * @param {string} noteName state记录信息
     * @returns {*} null
     */
    deleteOpenParamListItem(data, noteName){

        const noteOpenChildItem = this.state[noteName];
        // 取得state钩子
        const fundOpenParamString = noteName.substring(4, noteName.indexOf("Active"));
        const newParam = `fund${fundOpenParamString}Param`;
        // 取得ParamSave钩子
        const paramSaveIndexName = `${fundOpenParamString.toLocaleLowerCase()}Param`;
        // 取得refs的钩子
        const refIndex = `fund${fundOpenParamString}`;
        try {

            const newParamArr = [];
                // 数组去重,获得新的用于渲染的数据
            this.ParamForSave[paramSaveIndexName].forRender.forEach((item) => {
                if (item.code !== data.name){
                    newParamArr.push(item);
                }
            });

            this.ParamForSave[paramSaveIndexName].forRender = newParamArr;
            noteOpenChildItem[data.name] = -1;
            this.setState({
                [noteName]: noteOpenChildItem
            });

            const temp = {
                isAny      : this.state[newParam].isAny,
                activeItem : this.state[newParam].activeItem,
                childData  : this.state[newParam].childData,
                showChild  : this.state[newParam].showChild,
                id         : this.state[newParam].id,
            };

            if (this.ParamForSave[paramSaveIndexName].forRender.length > 0){
                let lastLightIndex = "";
                for (const x in noteOpenChildItem){
                    if (noteOpenChildItem[x] > 0 ){
                        lastLightIndex = x;
                    }
                }
                // 为自定义状态下的兼容
                if (lastLightIndex === ""){
                    temp.isAny = true;
                    temp.activeItem = -1;
                    temp.showChild = false;
                    temp.showOption = false;
                    this.setState({
                        [newParam]: temp
                    });
                    return _Render.renderFilterResultList.call(this);
                }
                let tempParam = {};
                if (lastLightIndex === "untilNow"){
                    tempParam = {
                        superName : "成立至今",
                        superCode : "untilNow",
                        sortID    : 2
                    };
                } else {
                    tempParam = {
                        superName : "近1年",
                        superCode : "year",
                        sortID    : 1
                    };
                }
                this.refs[refIndex].handleCilck(tempParam);

            } else {
                // 没有任何被选中的项目了
                temp.isAny = true;
                temp.activeItem = -1;
                temp.showChild = false;
                temp.showOption = false;
                this.setState({
                    [newParam]: temp
                });
            }
            return _Render.renderFilterResultList.call(this);
        } catch (error) {
            this.ParamForSave[paramSaveIndexName].forRender = [];
        }
        // 清除与不限 的情况
        this.ParamForSave[paramSaveIndexName].forRender = [];
        this.setState({
            [newParam]: {
                isAny       : true, // 不限 是否被点击 ——是否展示二级页面
                activeItem  : -1, // 被点击的公司字母
                achieveData : [],
                showOption  : false,
            },
            [noteName]: {}
        });
        _Render.renderFilterResultList.call(this);
    }
    deleteRatingListItem(data){
        const noteRatingActiveItem = this.state.noteRatingActiveItem;
        try {
            const newParam = [];
            // 数组去重,获得新的用于渲染的数据
            // let indexKey;
            for (const key in this.ParamForSave.ratingParam.forRender){

                if (this.ParamForSave.ratingParam.forRender[key] === data){
                    // indexKey = key;
                    this.ParamForSave.ratingParam.forRender[key] = [];
                }
            }
            noteRatingActiveItem[data] = [];
            this.setState({
                noteRatingActiveItem: noteRatingActiveItem
            });

            const temp = {
                isAny      : this.state.fundRatingParam.isAny,
                activeItem : this.state.fundRatingParam.activeItem,
                childData  : this.state.fundRatingParam.childData,
                showOption : this.state.fundRatingParam.showOption,
                id         : this.state.fundRatingParam.id,
            };
            // 如果项目还有被选中的 模拟点击选中之
            // if (Object.getOwnPropertyNames(this.ParamForSave.achieve).length > 0){  for be
            let hasFlag = false;
            let hasKey;
            for (const key in this.ParamForSave.ratingParam.forRender){

                if (this.ParamForSave.ratingParam.forRender[key].length > 0){
                    hasFlag = true;
                    hasKey = key;
                }
            }
            if (hasFlag){
                let clickName = "";
                switch (hasKey){
                    case "海通评级":clickName = "haitong";
                        break;
                    case "上证评级":clickName = "shangzheng";
                        break;
                    case "招商评级":clickName = "zhaoshang";
                        break;
                    case "济安评级":clickName = "jian";
                }
                const tempParam = {
                    code : clickName,
                    name : hasKey,
                };
                this.refs.fundRating.handleCilck(tempParam);

            } else {
                // 没有任何被选中的项目了
                temp.isAny = true;
                temp.activeItem = -1;
                temp.showChild = false;
                temp.showOption = false;
                this.setState({
                    fundRatingParam: temp
                });
            }
            return _Render.renderFilterResultList.call(this);
        } catch (error) {
            this.ParamForSave.ratingParam.forRender = [];
        }
        // 清除与不限 的情况
        this.ParamForSave.ratingParam.forRender = [];
        this.setState({
            fundRatingParam: {
                isAny       : true, // 不限 是否被点击 ——是否展示二级页面
                activeItem  : -1, // 被点击的公司字母
                achieveData : [],
                showOption  : false,
            },
            noteRatingActiveItem: {}
        });
        _Render.renderFilterResultList.call(this);
    }
    formatData(type, data){
        switch (type){
            case 0:{
                this.ParamForSave.company = data;
            }
                break;
            case 1:{
                this.ParamForSave.achieve = data;
            }
                break;
            case 2:{
                this.ParamForSave.scale = data;
            }
                break;
            case 3:{
                this.ParamForSave.type = data;
            }
                break;
            case 33:{
                this.ParamForSave.fundType.childParam = data;
            }
                break;
            case 4:{
                this.ParamForSave.volatilityParam = data;
            }
                break;
            case 5:{
                this.ParamForSave.sharpParam = data;
            }
                break;
            case 6:{
                this.ParamForSave.kamaParam = data;
            }
                break;
            case 7:{
                this.ParamForSave.retracementParam = data;
            }
                break;
            case 8:{
                this.ParamForSave.ratingParam = data;
            }
                break;
        }
    }

    // 删除后的初始化参数
    formatOpenParamAfterDelete(saveParam, index){
        const tempParam = saveParam.forAjax;
        // 处理渲染参数 此处是因为 ajax使用1year 而render 使用了year 自己作死
        if (index === "year"){
            saveParam.forRender[0].str = null;
            // 处理请求参数
            tempParam["1year"] = {
                rank : "",
                min  : "",
                max  : "",
            };
        } else {
            saveParam.forRender[1].str = null;
            tempParam[index] = {
                rank : "",
                min  : "",
                max  : "",
            };
        }
        return saveParam;
    }
    formatRatingParamAfterDelete(saveParam, index){
        // 处理渲染参数
        saveParam.forRender[index] = [];
        let ajaxParam;
        switch (index){
            case "海通评级":ajaxParam = "haitong";
                break;
            case "招商评级":ajaxParam = "zhaoshang";
                break;
            case "上证评级":ajaxParam = "shangzheng";
                break;
            case "济安评级":ajaxParam = "jian";
                break;
        }
        saveParam.forAjax[ajaxParam] = [];

        return saveParam;
    }
}

module.exports = RenderFilterResult;
