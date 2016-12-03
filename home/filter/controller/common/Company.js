/**
 * 首页筛选逻辑层
 *
 * VC分离实验
 *
 */

const React = require("react");

const Component = React.Component;

const Service = require("../../../../common/service/service");
const S = new Service();


const RenderFilter = require("./renderFilterResultList");
const Render = new RenderFilter();

// 需要的相关数据

// 基金公司名称
let companyNameList = [];

// 临时参数 渲染参数保存者

let that;
export class CompanyFilter extends Component{
    constructor(){
        super();
        that = this;
    }

    /** 组件交互
     * 一级选项交互
     * @handleCilckCompanyList 基金公司的字母
     * @handleClickAchieveList 基金业绩的选项
     * @handleClickScale 基金规模金额
     * @handleClickType 类型选项
     * @handleShowOption 展开自定义面板
     */
    
    
    getFundCompanyName(){
        S.getFundCompany({ fundType: "" })
            .then( (rs) => {
                companyNameList = rs;
            });
    }
    handleCilckCompanyList(type){
        const dataArr = companyNameList.list[type].list;
        // 将数据带出函数是作用于考虑
        const htmlArr = [];
        for (let i = 0;i < dataArr.length;i++){
            htmlArr.push(
                <li
                    className={`childParamItem${this.state.noteCompanyActiveItem[dataArr[i].companyName] === true ? " fl-activeChildParam" : ""}`}
                    onClick = {that.handleClickCompanyItem.bind(this, dataArr[i].companyName, dataArr[i].companyCode, type)}
                    key = {dataArr[i].companyName}
                >
                    {dataArr[i].companyName}
                </li>

            );

        }
        this.setState({
            fundCompanyParam: {
                isAny       : false,
                activeItem  : type,
                companyData : htmlArr,
            }
        });
    }

    /**
     * 特定子组件方法 —— 公司
     * @handleClickCompanyItem 添加公司名
     * @isAlreadyIn 判断是否已经存在于队列
     * @addToParam
     * @deleteFormParam
     */
    // 1.添加 2.删减  1.高亮  2.添加/删减 到上方的展示面板 3.添加/删减 到备选参数
    handleClickCompanyItem(name, code, type){
        if ( that.isAlreadyIn.call(this, name, code) ){
            that.deleteFormParam.call(this, name, code);
            that.delteCompanyActiveItem.call(this, type, name);
        } else {
            that.addToParam.call(this, name, code);
            that.noteCompanyActiveItem.call(this, type, name);
        }
        // 给二级元素加加蓝事件
    }
    // 判断是否已经存在于队列
    isAlreadyIn(name, code){
        const codeList = this.ParamForSave.company.code;
        const newArr = [];
        codeList.forEach( (item) => {
            if (item !== code){
                newArr.push(item);
            }
        });
        if (newArr.length === codeList.length){
            return false;
        } 
        
        return true;
        
    }

    /**
     * 特定子组件方法 —— 公司
     * @handleClickCompanyItem 添加公司名
     * @isAlreadyIn 判断是否已经存在于队列
     * @addToParam
     * @deleteFormParam
     * @return {null} null
     */

    /**
     * 添加公司名称
     * @param {string} name 公司名称
     * @param {string} code 公司代码
     * @return {null}  null
     */
    addToParam(name, code){
        this.ParamForSave.company.name.push(name);
        this.ParamForSave.company.code.push(code);
        Render.renderFilterResultList.call(this, 0, this.ParamForSave.company);
    }
    deleteFormParam(name, code){
        const names = this.ParamForSave.company.name;
        const codes = this.ParamForSave.company.code;
        const newNames = [];
        const newCodes = [];
        for ( let i = 0;i < codes.length;i++){
            if (codes[i] !== code && names[i] !== name){
                newNames.push(names[i]);
                newCodes.push(codes[i]);
            }
        }
        this.ParamForSave.company.name = newNames;
        this.ParamForSave.company.code = newCodes;
        Render.renderFilterResultList.call(this, 0, this.ParamForSave.company);
    }


    noteCompanyActiveItem(type, name){
        // 记录被选中的achieve的记录
        const noteCompanyActiveItem = this.state.noteCompanyActiveItem;
        noteCompanyActiveItem[name] = true;
        this.setState({
            noteCompanyActiveItem: noteCompanyActiveItem
        });
        that.handleCilckCompanyList.call(this, type);
    }
    delteCompanyActiveItem(type, name){
        const noteCompanyActiveItem = this.state.noteCompanyActiveItem;
        // 记录被选中的achieve的记录
        noteCompanyActiveItem[name] = false;
        this.setState({
            noteCompanyActiveItem: noteCompanyActiveItem
        });
        that.handleCilckCompanyList.call(this, type);
    }
}

module.exports = CompanyFilter;
