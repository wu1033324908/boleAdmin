/**
 * @description 充值管理
 * @author wujunwei
 * @createAt 2018-03-21
 */
const _HOST = require('tool/host');
const _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    /**
     * @description layui layer 组件
     */
    var _LAYER = layui.layer;

    /**
     * @description layui form 组件
     */
    var _FORM = layui.form;

    /**
     * @description datatable 对象
     */
    var _TABLE;


    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化表格
        initTable();
        // 初始化添加模块
        // initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        // initDeleteModule();
        // 初始化富文本
        // initUeEditor();

        // 上传文件
        // initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.pay.get,
                type: 'POST',
                data: {
                },
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: 'Id',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, 
                {
                    title: '操作',
                    data: 'null',
                    className: 'btn-td',
                    render: (data, type, row, meta) => {
                        return `
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改"><i class="fa fa-edit"></i>修改</button>
                        `;
                    }
                },
                {
                    title: '富文本',
                    data: 'RichText',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis">${data}</div>`;
                    }
                }
            ],
            drawCallback: function (settings) {
                var api = this.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate(this);
            }
        });
        // datatables 的样式设置
        $.datatablesStyle();

    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {
        // 函数内部传递的数据
        let fun_data = {};
        $('.tool-container').on('click', '.btn-add', () => {
            //富文本
            var editor1 = $('#editor').CustomUeEditor({
                button: {
                    chooseImage: false,
                    uploadImage: {
                        className: "btn btn-primary"
                    }
                }
            });
            fun_data.ue = editor1.ue;

            _LAYER.open({
                zIndex: 100,
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    _LAYER.full(index);

                    formSubmit(fun_data);
                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            });
        });

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            //监听提交
            _FORM.on('submit(add)', function (data) {
                // console.log(data)
                let sendData = {};
                sendData.richText = Base.encode(fun_data.ue.getContent());
                $.ajax({
                    type: "post",
                    url: "http://47.100.33.5:60001/Admin/AddGathering",
                    data: {
                        richText:sendData.richText
                    },
                    success: function (res) {
                        if (res.result) {
                            layui.layer.open({
                                type: 0,
                                title: '结果',
                                content: "提交成功！",
                                btn: ['确认'],
                                yes: (index, layero) => {
                                    location.reload();
                                },
                                closeBtn: 2
                            });
                        } else {
                            layui.layer.open({
                                type: 0,
                                title: '结果',
                                content: "提交失败",
                                btn: ['确认'],
                                yes: (index, layero) => {
                                    layui.layer.close(index);
                                },
                                closeBtn: 2
                            });
                        }
                    }
                });
                

                return false;
            });
        }
    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            let fun_data = $this.data('modify');
            //富文本
            var editor2 = $('#editor1').CustomUeEditor({
                button: {
                    chooseImage: false,
                    uploadImage: {
                        className: "btn btn-primary"
                    }
                }
            });
            fun_data.ue1 = editor2.ue;
            // 打开一个弹出层
            _LAYER.open({
                zIndex: 100,
                type: 1,
                title: '修改',
                content: $('#modify-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    _LAYER.full(index);

                    // $('#modify-uploader').on('uploaded', function (upload, file) {
                    //     let response = JSON.parse(file.result.response);
                    // });

                    // 初始化表单
                    initForm(fun_data);
                    // 表单提交
                    formSubmit(fun_data);
                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            });
        });


        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            //监听提交
            _FORM.on('submit(modify)', function (data) {
                let sendData = {};
                sendData.richText = Base.encode(fun_data.ue1.getContent());
                $.ajax({
                    type: "post",
                    url: "http://47.100.33.5:60001/Admin/UpdateGathering",
                    data: {richText:sendData.richText},
                    success: function (res) {
                        if (res.result) {
                            layui.layer.open({
                                type: 0,
                                title: '结果',
                                content: "提交成功！",
                                btn: ['确认'],
                                yes: (index, layero) => {
                                    location.reload();
                                },
                                closeBtn: 2
                            });
                        } else {
                            layui.layer.open({
                                type: 0,
                                title: '结果',
                                content: "提交失败",
                                btn: ['确认'],
                                yes: (index, layero) => {
                                    layui.layer.close(index);
                                },
                                closeBtn: 2
                            });
                        }
                    }
                });
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            setTimeout(function () {
                fun_data.ue1.setContent(Base.decode(fun_data.RichText))
            }, 500)

        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            let Id = $this.data('modify').Id;
            console.log(Id)
            _LAYER.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: _HOST.addRort + _HOST.newsPage.del,
                        data: {
                            id: Id,
                            sign: _sign_del,
                            userId: _userId
                        },
                        successMsg: '删除成功'
                    })
                }
            })
        });
    }


    /**
     * @description 初始化富文本
     */
    function initUeEditor() {
        var editor1 = $('#editor').CustomUeEditor({
            button: {
                chooseImage: {
                    ajax: {
                        url: _GLOBAL.adminRoot + 'assets/imageList.json',
                        type: 'GET',
                        async: false
                    },
                    className: 'btn btn-primary'
                },
                uploadImage: false
            }
        })
    }

    /**
     * @description 上传文件
     */
    function initUpload() {

        // 图片上传插件-添加
        var uploader = $("#add-uploader").plupload({
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Maximum file size
            max_file_size: '2mb',

            chunk_size: '1mb',

            // Specify what files to browse for
            filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                },
                {
                    title: "Zip files",
                    extensions: "zip,avi"
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
        // 图片上传插件--修改
        var uploader = $("#modify-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.addRort + _HOST.resource.upload_file,

            // Maximum file size
            max_file_size: '2mb',

            chunk_size: '1mb',

            // Specify what files to browse for
            filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                },
                {
                    title: "Zip files",
                    extensions: "zip,avi"
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