/**
 * @description 教师注册教程和模板
 * @author zhengshenli
 * @createAt 2018-03-12
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    console.log(layui.form)

    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化表格
        getData();
        // 初始化添加模块
        // initAddModule();
        // 初始化修改模块
        // initModifyModule();
        // 删除模块
        // initDeleteModule();
        // 初始化富文本
        // initUeEditor();


        // 在浏览器中显示资源
        $.showResourceInBrowser();

        // 上传文件
        initUpload();

    }

    /**
     * @description 初始化表格
     */
    function getData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.teacher.template.list,
            type: 'POST',
            success: function (res) {
                console.log(res)
                if (res.Result) {
                    if (res.Data.length <= 0) {
                        initAddModule();
                    } else {
                        var fun_data = {
                            modify: res.Data[0]
                        }
                        initModifyModule(fun_data);
                    }
                }
            }
        })
    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 函数内部传递的数据
        let fun_data = {};

        var editor1 = $('#editor').CustomUeEditor({
            button: {
                chooseImage: false,
                uploadImage: {
                    className: 'btn btn-primary'
                }
            }
        })
        fun_data.ue = editor1.ue;
        console.log(editor1)

        // 教师批改的模板
        fun_data.image = [];

        // 上传教师批改模板图片
        $('#uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data.image.push(response.Id);
            }
        });

        formSubmit(fun_data);
        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {
                id: [],
            };

            //监听提交
            layui.form.on('submit()', function (data) {
                if (fun_data.image.length <= 0) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传教师要批改的作文图片',
                        offset: '20%',
                    });
                } else {
                    sendData.Description = Base.encode(fun_data.ue.getContent());
                    sendData.id = fun_data.image.slice();
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.teacher.template.add,
                        data: sendData

                    })
                }


                console.log(sendData)


                return false;
            });
        }


    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule(fun_data) {
        var editor1 = $('#editor').CustomUeEditor({
            button: {
                chooseImage: false,
                uploadImage: {
                    className: 'btn btn-primary'
                }
            }
        })
        fun_data.ue = editor1.ue;

        // 教师批改的模板
        fun_data.image = fun_data.modify.ImgId.slice();

        $('#uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data.image.push(response.Id);
            }
        });

        // 初始化表单
        initForm(fun_data);
        // 表单提交
        formSubmit(fun_data);

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {
                templateid: fun_data.modify.Id,
                imgid: []
            };

            //监听提交
            layui.form.on('submit()', function (data) {
                console.log(fun_data)
                if (fun_data.image.length <= 0) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传教师要批改的作文图片',
                        offset: '20%',
                    });
                } else {
                    sendData.Description = Base.encode(fun_data.ue.getContent());
                    sendData.imgid = fun_data.image.slice();
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.teacher.template.modify,
                        data: sendData
                        
                    })
                }
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            let form = $('form');
            setTimeout(function () {
                fun_data.ue.setContent(Base.decode(fun_data.modify.Describe));
            }, 500);

            let $img_box = form.find('.img-box');
            $img_box.empty();
            fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                $img_box.append(`
                    <div class="item">
                        <img class="origin-image show_resource_in_browser" title="${fun_data.modify.Url[index]}" src="${ele}" data-src="${fun_data.modify.Url[index]}" data-id="${fun_data.modify.ImgId[index]}" alt="">
                        <span class="btn-close-origin">x</span>
                    </div>
                `);
            });

            form.find('.img-box .btn-close-origin').click((e) => {
                let $this = $(e.currentTarget);
                let img_id = $this.siblings('img').data('id');
                fun_data.image.forEach((ele, index) => {
                    if (ele == img_id) {
                        fun_data.image.splice(index, 1);
                        return false;
                    }
                });
                $this.parent().remove();
            });

        }
    }

    /**
     * @description 上传文件
     */
    function initUpload() {

        // 图片上传插件
        var uploader = $("#uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            // filters: [{
            //         title: "Image files",
            //         extensions: "jpg,gif,png"
            //     },
            //     {
            //         title: "Zip files",
            //         extensions: "zip,avi"
            //     },
            //     {
            //         title: '视频文件',
            //         extensions: 'mp4,avi'
            //     }
            // ],

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