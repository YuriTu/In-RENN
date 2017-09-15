/**
 * Created by Yuri on 2017/6/6.
 */
// 用户表单类通用container

const React = require("react");


// 修饰组件 进度条、导航栏、信息弹窗、拟态框
const Nav = require("../../common/secLevNavigation/app");
const Process = require("../processBar/app");
const Affirm = require("../../../../common/react-dialog/affirm");
const Dialog = require("../../../../common/react-dialog/react-dialog");
const Error = require("../../common/error/error");
const _ = require("../../../../common/util/util");
const Loading = require("../../../../common/loading-box/loading-box");
require("./form.scss");
class Form extends React.Component {
    constructor(props){
        super(props);
        this.storeState = props.store.getState().form || {};
        this.state = {
            isSubmitting: props.components.reduce((obj, cur) => {
                if (this.storeState[`error_${cur.field}`]){
                    obj[cur.field] = true;
                } else {
                    obj[cur.field] = false;
                }
                return obj;
            }, {})
        };
        // 这里的自动校检应该是这样的流程
        // 1.设立一个flag 意味 每次change触发检查
        // 2.在eeor内部是可以拿到检查规则和值的，直接进行比对，我们需要做的就是告诉他开始检查
        // 3.检查完成后关闭之
        // 4.本质上 siSubmitting 应该是可以完成这个功能对的
        // 5.每次为true以为这需要进行检查 false以为不检查
        // 6.一旦有onchange检查不比清楚之前的，因为后面的结果会进行覆盖
        this.changeSubmittingState = (field) => {
            if (!this.state.isSubmitting[field]){
                return;
            }
            this.setState({
                isSubmitting: {
                    ...this.state.isSubmitting,
                    [field]: false,
                }
            });
        };
        this.btnClick = (e, btn) => {
            if (this.checkPromise && this.clickPromise.state &&
                (this.clickPromise.state() === "pending")){
                return;
            }
            const form = this.props.store.getState().form;

            if (btn.checkRule){
                // 在这里对所有提交进行了检查
                this.setState({
                    isSubmitting: props.components.reduce((obj, cur) => {
                        obj[cur.field] = true;
                        return obj;
                    }, {})
                }, () => {
                    const newForm = this.props.store.getState().form;
                    // 筛选所有包含field的组件,
                    props.components.filter(item => !!item.field)
                        // 把所有的field变量编为一个数组
                        .map(item => item.field)
                        // 当任意field存在error则不执行回调
                        .some(key => newForm[`error_${key}`]) ||
                    (this.clickPromise = btn.onClick(newForm, this.props.check, props));
                    return;
                });
            } else {
                btn.onClick(form, this.props.check, props);
            }
            // check 是用来做 非法跳转检查的

        };
    }
    render(){
        const { components, btns, pageInfo, process, ...props } = this.props;
        return (
            <div className={`component-container ${props.className}`}>
                {
                    props.navConfig && <Nav config = {props.navConfig}/>
                }
                {
                    process && <Process config = {process}/>
                }
                <div className="form-container">
                    {
                        components.map((component, index) => {
                            return (
                                <div>
                                    <div
                                        className="form-item-container"
                                        key = {index.toString()}>
                                        {component.label &&
                                        <label htmlFor={`form-${component.field}`}>
                                            {component.label}
                                        </label>
                                        }
                                        {component.component &&
                                        component.component({
                                            ...props,
                                            changeSubmittingState: this.changeSubmittingState
                                        })
                                        }
                                        {
                                            _.isString(component.formInfo) ?
                                                <span className="form-info">{component.formInfo}</span>
                                                :
                                                component.formInfo
                                        }
                                    </div>
                                    <Error
                                        rule={component.rule}
                                        store={props.store}
                                        checkValue = {props.store.getState().form[component.field]}
                                        field={component.field}
                                        isSubmitting={this.state.isSubmitting[component.field]}
                                        isAutoCheckRule = {component.isAutoCheckRule}
                                    />

                                </div>

                                );

                        })
                    }
                    <div className="features">
                        {
                            btns.map((btn, key) => (
                                <div key={key.toString()}
                                     className = {`btn ${btn.className}`}
                                     onClick = {e => this.btnClick(e, btn)}
                                >
                                    {btn.name}
                                </div>
                            ))
                        }
                    </div>


                    {
                        pageInfo && <div className="pageInfo">
                            {pageInfo}
                        </div>
                    }

                </div>
                {

                    props.affirm && <Affirm
                        {...props.affirm(props)}
                    />
                }
                {
                    props.dialog && <Dialog
                        {...props.dialog(props)}
                    >
                        {props.dialog(props).content}
                    </Dialog>
                }
                {
                    props.loading && <Loading {...props.loading(props)}/>
                }

            </div>
        );
    }
}

Form.propType = {
    className: React.PropTypes.string, //组件类名名称
};

module.exports = Form;