/**
 * @description 无用
 * @author zhengshenli
 * @createAt 2018-01-05
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
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
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();
        // 初始化富文本
        // initUeEditor();

        // 上传文件
        initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: 'http://qiaozhugeguanjia.com:60011/WgwCarouselImg/List',
                type: 'POST',
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, {
                    title: '操作',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'btn-td',
                    render: (data, type, row, meta) => {
                        return `
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改"><i class="fa fa-edit"></i></button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                        
                        `;
                    }
                },
                {
                    title: 'Name',
                    data: 'Name',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'ImgUrl',
                    data: 'ImgUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}"><img src="${data}"></div>`;
                    }
                },
                {
                    title: 'ToUrl',
                    data: 'ToUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'CreatedAt',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                }
            ],
            drawCallback: function (settings) {
                var api = _TABLE.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate(_TABLE);
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
            _LAYER.open({
                zIndex: 100,
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    _LAYER.full(index);

                    $('#add-uploader').on('uploaded', function (upload, file) {
                        let response = JSON.parse(file.result.response);
                        if (response.Result) {
                            fun_data['ResrouceId'] = response.ImgId;
                        }
                    });

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
        function formSubmit() {
            //监听提交
            _FORM.on('submit(add)', function (data) {
                console.log(data)
                let sendData = {};
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData);
                if (fun_data.ResrouceId) {
                    sendData['ResrouceId'] = fun_data.ResrouceId;
                    $.ajaxRequestTemplate({
                        url: 'http://qiaozhugeguanjia.com:60011/WgwCarouselImg/Add',
                        data: sendData
                    })
                } else {
                    layui.layer.open({
                        zIndex: 100,
                        type: 0,
                        content: '请先上传文件',
                        offset: '20%',
                        maxmin: true,
                        anim: 2,
                        time: 1500
                    });
                }

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
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: 'http://qiaozhugeguanjia.com:60011/WgwCarouselImg/Mod',
                    data: sendData
                })
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            form.find('input[name=ToUrl]').val(fun_data.ToUrl);
            form.find('input[name=Name]').val(fun_data.Name);
            form.find('.origin-image').attr('src', fun_data.ImgUrl);


        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            let Id = $this.data('modify').Id;
            _LAYER.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: 'http://qiaozhugeguanjia.com:60011/WgwCarouselImg/Del',
                        data: {
                            Id: Id
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

        // 图片上传插件
        var uploader = $("#add-uploader").plupload({
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            // url: "http://qiaozhugeguanjia.com:60011/WgwCarouselImg/UploadImg",
            url: "http://qiaozhugeguanjia.com:60011/Student/Test1",
            // url: "http://bigfk.gemini-galaxy.com/Admin/Resource/UploadFile1",

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
        // 图片上传插件
        var uploader = $("#modify-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: "http://qiaozhugeguanjia.com:60011/WgwCarouselImg/UploadImg",

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