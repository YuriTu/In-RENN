/**
 * Created by Lever on 17/3/7.
 */
const React = require("react");

const Component = React.Component;

const FileUpload = require("matrix-fileupload");

const Service = require("../../../../common/service/service");

const S = new Service();

const _ = require("../../../../common/util/util");

const $ = require("jquery");

class Upload extends Component{
    constructor(props){
        super(props);
        const store = this.props.store,
            formState = store.getState().form;
        this.state = {
            file: formState[this.props.field] || ""
        };
        this.beforeUpload = files => {
            const name = files[0].name || files;
            const ext = name.match(/\.([^\.]+)$/)[1];
            // TODO: IE8 文件大小限制
            if (_.isIEVersion(8)) {
                $(".btn-upload").next("input").attr("name", "file");
                return this.props.fileTypes.some(type => type === ext);
            }
            $(".btn-upload").next("input").attr("name", "file");
            // const size = (files[0].size / 1024).toFixed(2);
            const uploadFiles = [];
            for (let i = 0; i < files.length; i++) {
                uploadFiles.push(files[i]);
            }
            if (this.props.fileTypes.some(type => type === ext)) {
                return true;
            }
            // this.setState({
            //     file        : uploadFiles[0],
            //     isUploading : "error",
            //     errorInfo   : "您上传的文件格式错误,请下载文件格式说明并修改上传文件"
            // });

            return false;
        };
        this.doUpload = files => {
            if (this.uploadCount > 0) {
                return;
            }
            this.uploadCount++;
            const uploadFiles = [];
            // 兼容IE8对files对象进行判断
            if (_.isString(files)) {
                uploadFiles.push(files);
            } else {
                for (let i = 0; i < files.length; i++) {
                    uploadFiles.push(files[i]);
                }
            }
            // this.setState({
            //     file        : uploadFiles[0],
            //     isUploading : "uploading"
            // });
            let uploadProgress = 0;
            this.uploadTimer = setInterval(() => {
                uploadProgress += 20;
                // this.setState({
                //     uploadProgress: `${uploadProgress > 90 ? 90 : uploadProgress}%`
                // });
            }, 50);
        };
        this.uploadSuccess = response => {
            this.uploadCount = 0;
            clearInterval(this.uploadTimer);
            +response.code === 0 && (this.keyWords = response.info || "upload");
            +response.code === 0 && this.setState({
                file           : response,
                isUploading    : "success",
                uploadProgress : "100%"
            }, () => {
                this.props.store.dispatch({
                    type : `CHANGE_FORM_${this.props.field}`,
                    data : response
                });
                this.props.changeSubmittingState && this.props.changeSubmittingState(this.props.field);
            });
            // response.code === 411 && this.setState({
            //     isUploading : "error",
            //     errorInfo   : "您上传的文件已超过500k,请重新上传"
            // });
            // response.code === 412 && this.setState({
            //     isUploading : "error",
            //     errorInfo   : "您上传的文件格式错误,请下载文件格式说明并修改上传文件"
            // });
        };
        this.uploadError = error => {
            clearInterval(this.uploadTimer);
            if (this.uploadCount === 0) {
                return;
            }
            this.setState({
                isUploading : "error",
                errorInfo   : _.type(error) === "Error" ? "您上传的文件格式错误,请下载文件格式说明并修改上传文件" : "网络传输发生错误,请重新上传"
            });
        };
        this.uploadFail = error => {
            clearInterval(this.uploadTimer);
            if (this.uploadCount === 0) {
                return;
            }
            this.setState({
                isUploading : "error",
                errorInfo   : "网络传输发生错误,请重新上传"
            });
        };
        this.options = {
            baseUrl         : S.uploadFileMaterial("guangfa"),
            chooseAndUpload : true,
            fileFieldName   : "file",
            paramAddToField : {
                matrixID : window.USER_ID,
                type     : this.props.field
            },
            beforeUpload   : this.beforeUpload,
            doUpload       : this.doUpload,
            uploading      : this.uploading,
            uploadSuccess  : this.uploadSuccess,
            uploadError    : this.uploadError,
            uploadFail     : this.uploadFail,
            accept         : props.fileTypes,
            requestHeaders : {
                "X-Requested-With": _.isIEVersion(8) ? "" : "AJAX"
            }
        };
    }
    componentWillReceiveProps(nextProps){
        const requestState = this.props.store.getState().request;
        if (this.state.file === "" && requestState[nextProps.field]){
            this.setState({
                file: {
                    fileName: requestState[nextProps.field]
                }
            });

        }
    }
    componentDidMount(){
        // IE9bug: IE9里面是创建了一个form表单，直接通过form表单完成的上传功能，这里手动把input的name值改为file
        $(".file-upload-container form .ajax_upload_hidden_input_file").attr("name", "file");
    }
    render(){
        return (
            <FileUpload options={this.options} className="file-upload-container">
                <input type="text" value={this.state.file && (this.state.file.fileName.length > 25 ? `${this.state.file.fileName.slice(0, 25)}...` : this.state.file.fileName)} disabled/>
                <div className="btn-upload" ref="chooseAndUpload">上传</div>
                {!!this.state.file && <i className="icon icon-checkmark" />}
                {_.isIEVersion(9) && (
                    <div className="hide">
                        <input type="hidden" name="type" value={this.props.field} />
                        <input type="hidden" name="matrixID" value={USER_ID}/>
                    </div>
                )}
            </FileUpload>
        );
    }
}
Upload.propTypes = {
    fileTypes: React.PropTypes.array
};

module.exports = Upload;
