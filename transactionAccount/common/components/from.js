/**
 * 赎回组件
 *
 * 需要的props
 */


const React = require("react");

const comSelect = require("../../../common/input/commonSelect").radioSelect;
const Select = require("../../../common/input/select");
const InpSelect = comSelect(Select);
const Affirm = require("../../../common/react-dialog/affirm");
const Dialog = require("../../../common/react-dialog/react-dialog");
const WarInput = require("./warningInput");
const _ = require("../../../common/christina/christina");
const until = require("../../../common/util/util");



class From extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showAff     : false,
            affSubTitle : null,
        };
        this.isShowAff = () => {
            if (this.props.isDisableBtn){
                return;
            }
            let param;
            this.props.isShowAff && ( param = this.props.isShowAff());

            if (!!param.amount){
                this.setState({
                    showAff     : true,
                    affSubTitle : this.getAffSubtitle(param.fundName,
                        param.amount,
                        param.type),
                });
            }

        };
        this.closeAff = () => {
            this.setState({
                showAff: false
            });
        };
        this.sureAff = () => {
            this.props.finish && this.props.finish();
        };
        this.affirmConfig = {
            title         : this.props.affirmTitle,
            close         : () => this.closeAff(),
            sure          : () => this.sureAff(),
            customizeHead : false
        };
    }
    getAffSubtitle(fundName, amount, type){
        return (
            <span>尊敬的客户，您好<br/>
                <span>您将{type ? "赎回" : "申购"}{fundName}
                    <span className="affirm-info">{amount}</span>{type ? "份" : "元"}，请确认该操作
                </span>
            </span>
        );
    }
    componentWillReceiveProps(nextProps){
        // 当出现warning时，把确认弹窗关闭
        if (nextProps.warningDia && (nextProps.warningDia.isShow !== this.props.warningDia.isShow)){
            this.closeAff();
        }
    }

    render(){
        return (
            <div className="red-from-container">
                <div className="container">
                    {
                        this.props.list.map((item, index) => {
                            if (_.isEmptyObject(item)){
                                return <div key={`null-item-${index}`}></div>;
                            }
                            item.option && (item.option.onSelect = (indexType) => this.props.onSelect(indexType, item.index));
                            item.input && (item.input.onChange = (e) => this.props.onChange(e, index));
                            item.input && (item.input.onClick = (indexParam) => this.props.onClick(indexParam));
                            return (
                                <div
                                    className={`form-item-container form-item-${item.index} clearfix`}
                                    key={`form-item-index-${index}`}
                                >
                                    <span className="item-label">{item.label}</span>
                                    {
                                        item.option ?
                                            <InpSelect {...item.option} />
                                            :
                                            <span className="value-text">{item.text}</span>
                                    }
                                    {
                                        item.input && (<WarInput
                                            {...item.input}
                                        />)
                                    }
                                </div>
                            );
                        })
                    }
                    <div
                        className={`confirm-btn ${this.props.isDisableBtn ? "disabled" : ""}`}
                         onClick={this.isShowAff.bind(this)}
                    >{this.props.affirmTitle}</div>
                    <div className="info-text">
                        {this.props.info}
                    </div>
                </div>
                <Affirm
                    {...this.affirmConfig}
                    subTitle = {this.state.affSubTitle}
                    isShow = {this.state.showAff}
                />
                {
                    this.props.warningDia && <Dialog
                        {...this.props.warningDia}
                    >
                        {this.props.warningDia.children}
                    </Dialog>
                }

            </div>
        );
    }
}



module.exports = From;