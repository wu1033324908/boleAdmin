/**
 * @description 首页标题每次
 * @author zhengshenli
 * @createAt 2018-03-06
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {
    let qr_code;
    /**
     * @description datatable 对象
     */
    var _TABLE;

    let _ImgUrl;
    $('#add-uploader').on('uploaded', function (upload, file) {
        let response = JSON.parse(file.result.response);
        if (response.Result) {
            _ImgUrl = response.Url;
            console.log(_ImgUrl)
        }
    });
    init();
    /**
     * @description 页面初始化
     */
    function init() {
        getData();
        initUpload();
        
    }


    /**
     * @description 获取数据
     */
    function getData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.home.title.get,
            type: 'POST',
            success: function (res) {
                if (res.Result) {
                    var fun_data = {
                        modify: res.Data[0]
                    }
                    initModifyModule(fun_data);
                }
            }
        })
    }
    

    /**
     * @description 初始化修改模块
     */
    function initModifyModule(fun_data) {

        // 初始化表单
        initForm();
        // 表单提交
        
        formSubmit();
        /**
         * @description 表单提交
         */
        function formSubmit(ImgUrl) {
            
            
            let sendData = {};
            sendData.id = fun_data.modify.Id;
            

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData);
                sendData.qrcode = _ImgUrl || qr_code || '';
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.home.title.modify,
                    data: sendData
                })
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm() {
            // 修改模块表单
            let form = $('form');
            // 标题一
            form.find('input[name=titleup]').val(fun_data.modify.TitleUp || '');
            // 标题二
            form.find('input[name=titledown]').val(fun_data.modify.TitleDown || '');
            // 标题三
            form.find('input[name=middleup]').val(fun_data.modify.MiddleUp || '');
            // 标题四
            form.find('input[name=middledown]').val(fun_data.modify.MiddleDown || '');
            // 标题五
            form.find('input[name=videoup]').val(fun_data.modify.VideoUp || '');
            // 标题六
            form.find('input[name=videodown]').val(fun_data.modify.VideoDown || '');

            form.find('.re_img').find('img').attr("src",fun_data.modify.QRCode || '')
            qr_code = fun_data.modify.QRCode
            layui.form.render();
        }
    }
        /**
     * @description 上传文件
     */
    function initUpload() {

        // 图片上传插件
        var uploader = $("#add-uploader").plupload({
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: "http://47.100.33.5:60001/Admin/UploadFill",

            // Maximum file size
            max_file_size: '222mb',

            // chunk_size: '1mb',

            // Specify what files to browse for
            filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                },
                {
                    title: "Zip files",
                    extensions: "zip,avi"
                },
                {
                    title: '视频文件',
                    extensions: 'mp4,avi'
                }
            ],

            // Rename files by clicking on their titles
            rename: true,

            // Sort files
            sortable: true,

            // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
            dragdrop: true,

            // Views to activate
            views: {
                list: true,
                thumbs: true, // Show thumbs
                active: 'thumbs'
            }
        });
    }
});