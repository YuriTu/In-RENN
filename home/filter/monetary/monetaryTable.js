/**
 * Created by Lever on 16/8/12.
 */
const React = require("react");

const Component = React.Component;

const Table = require("../../../common/content/data-table");

const Config = require("../../../common/content/dataTableConfig_monetary");

const Loading = require("../../../common/loading-box/loading-box");

const Service = require("../../../common/service/service");

const S = new Service();

const $ = require("jquery");

class MonetaryTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            listData : [],
            param    : props.ajaxParam,
            urlParam : ""
        };
    }
    downloadHomeData(_filterParam = this.state.param){
        _filterParam.file = 205;
        const urlParam = $.param(_filterParam);

        this.props.getParamUrl && this.props.getParamUrl(urlParam);
    }
    getParam(param, isUseLoading = true, keepOriginData = false){
        this.downloadHomeData(param);
        if (keepOriginData) {
            this.setState({
                param: param
            }, () => {
                this.getFundList(param, isUseLoading);
            });

            return;
        }
        this.setState({
            listData : [],
            param    : param
        }, () => {
            this.getFundList(param, isUseLoading);
        });
    }
    setLoading(isloading = true){
        this.setState({
            isLoading: isloading
        });
    }
    getFundList(param = this.state.param, isUseLoading = true){
        if (this.isLoading) {
            param.page === 1 ? 1 : param.page --;
            
            return;
        }

        this.isLoading = true;

        this.setLoading(isUseLoading);
        S.getFilterFundList(param).then((rs) => {
            this.isLoading = false;
            const noLength = 0;
            this.setLoading(false);
            if (+rs.list.length === noLength) {
                param.page --;
                this.props.getDataLen && this.props.getDataLen(this.state.listData[noLength] ? this.state.listData[noLength].count : noLength);

                return;
            }

            const listData = this.state.listData;
            

            this.setState({
                listData: listData.concat(rs.list)
            }, () => {
                const start = 0;
                const len = !!this.state.listData[start] ? this.state.listData[start].count : start;
                this.props.getDataLen && this.props.getDataLen(len);
            });
        });
    }
    componentWillReceiveProps(nextProps){
        if (JSON.stringify(nextProps.ajaxParam) !== JSON.stringify(this.props.ajaxParam)) {
            this.downloadHomeData(nextProps.ajaxParam);
            this.getParam(nextProps.ajaxParam, true, false);
        }
    }
    componentDidMount(){
        this.getFundList();
    }
    render(){
        return (
            <div>
                <Loading isLoading={this.state.isLoading}></Loading>
                <Table
                    ref="dataTable"
                    zeroHeight="486"
                    leftWidth="25%"
                    rightWidth="75%"
                    leftFixed={false}
                    isUseScrollBar={false}
                    listData={this.state.listData}
                    dataParam={this.state.param}
                    updateParam={this.getParam.bind(this)}
                    Config={Config}
                    compareList={this.props.compareList}
                    addCompare={this.props.addCompare}
                    activeSort={2}
                />
            </div>
        );
    }
}

module.exports = MonetaryTable;

