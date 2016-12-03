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

let that;

const key = 1;
export class CompanyFilter extends Component{
    constructor(){
        super();
        that = this;
    }

    /**
     * 点击业绩一级目录
     * @param {objecg}type code "w"name "近一周"sortID 4
     * @param {boolean} update force update
     * @return {null} null
     */
    handleClickAchieveList(type, update){
        if (type.code === this.state.fundAchieveParam.activeItem && !(update === true) && (!!this.state.fundAchieveParam.showChild)){

            return that.closeAchieveList.call(this);
        }
        that.renderAchieveList.call(this, type, update);

    }
    renderAchieveList(type){
        const dataArr = this.basicConfig.openFundParam;
        const htmlArr = [];
        const temp = this.state.fundAchieveParam;

        for (let i = 0;i < dataArr.length;i++){
            htmlArr.push(
                <li
                    className={`childParamItem${this.state.noteAchieveChildItem[type.code] === dataArr[i].code ? " fl-activeChildParam" : ""}`}
                    onClick = {that.handleClickAchieveItem.bind(this, type, dataArr[i])}
                    key = {`业绩${type.name}:${dataArr[i].name}`}
                >
                    {dataArr[i].name}
                </li>
            );
        }
        htmlArr.push(
            <li
                className="childParamItem no-right-margin"
                key = {`业绩${type.name}:自定义`}
            >
                <Option
                    optionName = "收益率"
                    dir = {1}
                    showPer = {true}
                    getOptionFilter = {that.getOptionFilter.bind(this, type)}
                ></Option>
            </li>
        );

        temp.isAny = false;
        temp.activeItem = type.code;
        temp.achieveData = htmlArr;
        temp.showChild = true;
        temp.param = type;

        this.setState({
            fundAchieveParam: temp
        });
    }
    // 点击已经打开的二级菜单
    // 已有选择 -》 回到被选中的菜单高亮
    // 未有选择 -》 回到不限
    closeAchieveList(){
        const temp = this.state.fundAchieveParam;

        if (Object.getOwnPropertyNames(this.state.noteAchieveChildItem).length > 0){ // 有被选中的
            const selectNameArr = Object.getOwnPropertyNames(this.state.noteAchieveChildItem);
            let hasValueItem;
            for (let i = selectNameArr.length - 1;i >= 0;i--){ // 找到最近的被选中的项目
                if ( this.state.noteAchieveChildItem [selectNameArr [i]] !== -1){
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
            fundAchieveParam: temp
        });
    }

    /**
     * 记录高亮信息
     * @param {object}superParam {code: name: sortID}
     * @param {object}childParam { code: name:}
     * @return {null} null
     */
    noteAchieveActiveItem(superParam, childParam){
        const noteAchieveChildItem = this.state.noteAchieveChildItem;
        noteAchieveChildItem[superParam.code] = childParam.code;

        this.setState({
            noteAchieveChildItem: noteAchieveChildItem,
        });
        that.renderAchieveList.call(this, superParam);
    }


    /**
     * 特定子组件方法 —— 业绩
     * @handleClickAchieveItem 添加排名
     * @getOptionFilter 取得自定义的数据
     */

    handleClickAchieveItem(superParam, child){
        // 添加到备选参数项
        const tempParam = {
            name : superParam.name,
            code : superParam.code,
            
            childName       : child.name,
            childCode       : child.code,
            childOptionName : "",
            childOptionCode : "",
            sortID          : superParam.sortID
        };
        if (!that.chcekAlreadyIn.call(this, tempParam)){
            this.ParamForSave.achieve.push(tempParam);
        }
        that.noteAchieveActiveItem.call(this, superParam, child);
        this.ParamForSave.sortList.push(superParam.sortID);
        Render.renderFilterResultList.call(this, 1, this.ParamForSave.achieve);
        // 自动筛选


    }
    getOptionFilter(superParam, data){
        // 非数子不处理,警告文案组件内处理
        const temp = this.state.fundAchieveParam;
        if (isNaN(data) || data === undefined || data === ""){
            temp.warning = true;
            this.setState({
                fundAchieveParam: temp
            });
            return;
        } else {
            temp.warning = false;
            this.setState({
                fundAchieveParam: temp
            });
        }

        const tempParam = {
            name            : superParam.name,
            code            : superParam.code,
            childName       : "",
            childCode       : "",
            childOptionName : `大于等于${data}`,
            childOptionCode : data
        };
        if (!that.chcekAlreadyIn.call(this, tempParam)){
            this.ParamForSave.achieve.push(tempParam);
        }
        const noteParam = {
            name : "option",
            code : `option${data}`
        };
        that.noteAchieveActiveItem.call(this, superParam, noteParam);
        this.ParamForSave.sortList.push(superParam.sortID);
        Render.renderFilterResultList.call(this, 1, this.ParamForSave.achieve);

    }
    chcekAlreadyIn(tempParam){
        const list = this.ParamForSave.achieve;
        for (let i = 0;i < list.length;i++){
            if (list[i].name === tempParam.name){
                this.ParamForSave.achieve[i] = tempParam;
                return true;
            }
        }
        return false;
    }
}

module.exports = CompanyFilter;
