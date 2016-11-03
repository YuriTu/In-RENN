const React = require("react");

const Component = React.Component;

const Service = require("../../../../common/service/service");

const S = new Service();
const Filter = require("../../../../common/filterReader/filterReader");

const FormatObject = require("../../../../common/formatObject/formatObject");
const F = new FormatObject();

const uitil = require("../../../../common/util/util");
const isOlderIE = uitil.isOldIE();

require("../basic.scss");
const FundResult = (View) => {
    "use strict";
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                active      : 0,
                warning     : false,
                warningText : "*重名！",
                showDrop    : false,
                updateText  : "每日刷新",
                warningMail : false,
                noticeTime  : "08:00",
                // IE8兼容
                showNamePH  : true,
                showMailPH  : true,
            };
            this.param = {
                fundPoolName : "基金池",
                userId       : window.USER_ID,
                noticeType   : 0,
                mailAddr     : "",
                noticeTime   : "08:00",
                pageNum      : 1,
                pageSize     : 20

            };
            this.temp = {
                nameList: []
            };

            this.finish = (e) => {
                e.preventDefault();
                // 传递数据
                props.changeAjaxCacheParam(this.param, "basicInfo");
                // 检查地址
                if (!!this.param.mailAddr){
                    props.finish();
                } else {
                    this.setState({
                        warningMail: true,
                    });
                }
            };
            this.getExistingList = () => {
                S.getPoolList({
                    userId: this.param.userId
                }).then((rs) => {
                    const list = rs.data.map((item) => {
                        return item && item.fundPoolName;
                    });
                    this.temp.nameList = list;
                    this.param.fundPoolName = this.initName();
                });
            };
            this.readName = (value) => {
                if (!!value && value !== " "){

                    // 非空 进行重复性验证
                    if (this.isNameExisted(this.temp.nameList, value)){
                        this.setState({
                            warning: true,
                        });
                    } else {
                        this.setState({
                            warning: false,
                        });
                        this.param.fundPoolName = value;
                    }
                }
                // 如果是空，则走默认字符
            };
            this.isNameExisted = (list, value) => {
                let flag = false;
                list.forEach((item) => {
                    if (item === value){
                        flag = true;
                    }
                });
                return flag;
            };
            this.initName = () => {

                const list = this.temp.nameList;

                const nameList = ["基金池1", "基金池2", "基金池3", "基金池4", "基金池5"];
                let rs = nameList[0];
                // 当有已存在名称
                let count = 0;
                if (!!list){
                    for (let i = 0;i < nameList.length;i++){

                        for (let j = 0;j < list.length;j++){
                            if (list[j] === nameList[i]){
                                count++;
                            }
                        }
                    }
                    rs = nameList[count];

                }
                return rs;
            };
            this.handleDrop = () => {
                this.setState({
                    showDrop: !this.state.showDrop
                });
            };
            this.sendUpdateData = (value, text) => {
                this.param.noticeType = value;
                this.handleDrop();
                this.setState({
                    updateText: text
                });
            };
            this.mailChange = event => {
                this.changePlaceHolder(event.target.value, 1);
                this.param.mailAddr = (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(event.target.value)
                    ? event.target.value : "";
            };
            this.getMail = (value) => {
                const isEmail = (str) => {
                    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    return reg.test(str);
                };
                let showWarning = false;
                if (isEmail(value)){
                    this.param.mailAddr = value;

                } else {
                    showWarning = true;
                }
                this.setState({
                    warningMail: showWarning
                });
            };
            this.judgeRoute = (config) => {
                this.props.changeHeaderItem(config[0].length - 1);
            };
            this.getNoticeTime = (value) => {
                this.param.noticeTime = value;
                this.setState({
                    noticeTime: value,
                });
            };
            this.dropEvent = () => {
                $(document).on("click", (event) => {
                    event.target.className.indexOf("dropdown") <= -1 && this.state.showDrop
                    && this.handleDrop();
                });
            };
            this.setFilterResult = (data) => {
                const paramJSON = JSON.parse(this.formatParam(data).filterConditions);
                F.deleteEmptyProperty(paramJSON);
                this.filterResult = new Filter(paramJSON);
                const list = this.filterResult.reader();
                const rs = list.map((item, index) => {
                    return (
                        <li key ={`lsit ${index + 1}`}>{index + 1} . {item.content}</li>
                    );
                });
                this.setState({
                    resultList: rs
                });

            };

            this.formatParam = (value) => {
                const cache = value;
                const param = {
                    filterConditions: {},
                };
                const rs = {};
                // 去重
                for (const key in cache){
                    if (!F.isEmpty(cache[key])){
                        if (key === "basicInfo"){
                            param[key] = cache[key];
                        } else {
                            param.filterConditions[key] = cache[key];
                        }
                    }
                }
                rs.filterConditions = JSON.stringify(param.filterConditions);
                for (const key in param.basicInfo){
                    rs[key] = param.basicInfo[key];
                }
                return rs;
            };
            this.judgeRoute = (config) => {
                let rs = "fundDetail";
                if (config[0].length === 4){
                    rs = "FundCIndex";
                }
                return rs;
            };
            this.handlePrev = (config) => {                
                // this.props.changeHeaderItem(config[0].length);
            };
            this.setHeader = () => {
                // 获得以前的参数
                const param = JSON.parse(window.sessionStorage.getItem("param"));
                this.props.setPropsState("param", param);
                const inter = JSON.parse(window.sessionStorage.getItem("interactive"));
                const activeHeader = inter[1].header.type;
                const activeHeaderItem = inter[1].header.active;

                this.props.changeHeader(activeHeader);
                this.props.changeHeaderItem(activeHeaderItem);
            };
            // ie8下对placeholder的伪造
            this.changePlaceHolder = (value,type) => {
                let show = false;
                let item = "showNamePH";
                if (isOlderIE){
                    if (value === ""){
                        show = true;
                    }
                    type ? item = "showMailPH" : item = "showNamePH";
                    this.setState({
                        [item]: show
                    });
                }



            };
            this.changeName = (e) => {
                this.changePlaceHolder(e.target.value,0);
            };

        }

        componentWillMount(){
            this.getExistingList();
        }
        componentWillReceiveProps(nextProps){
            if (JSON.stringify(this.props.param) !== JSON.stringify(nextProps.param)){
                this.setFilterResult(nextProps.param);
            }
        }
        componentDidMount(){
            this.setHeader();
            this.judgeRoute(this.props.config);
            this.dropEvent();
            this.setFilterResult(this.props.param);
            this.props.getResultCount();
        }
        render(){
            const param = {
                showDrop           : this.state.showDrop,
                curNoticeTime      : this.param.noticeTime,
                getTime            : value => this.getNoticeTime(value),
                updateText         : this.state.updateText,
                warningMail        : this.state.warningMail,
                handleDrop         : () => this.handleDrop(),
                sendUpdateData     : (value, text) => this.sendUpdateData(value, text),
                finish             : (e) => this.finish(e),
                readName           : (value) => this.readName(value),
                getMail            : (value) => this.getMail(value),
                resultList         : this.state.resultList,
                resultCount        : this.props.resultCount,
                resultCompanyCount : this.props.resultCompanyCount,
                route              : this.judgeRoute(this.props.config),
                handlePrev         : () => this.handlePrev(this.props.config),
                mailChange         : event => this.mailChange(event),
                changeName         : (e) => this.changeName(e),
                showNamePH         : this.state.showNamePH,
                showMailPH         : this.state.showMailPH,
                isOlderIE          : isOlderIE,
            };
            return (
                <View {...param}/>
            );
        }
    };
};
FundResult.propType = {

};


module.exports = FundResult;
