/**
 * @description 首页banner
 * @author zhengshenli
 * @createAt 2018-03-05
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

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

        // 在浏览器中显示资源
        $.showResourceInBrowser();
        // 初始化富文本
        // initUeEditor();

        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.home.banner.list);

        // 上传文件
        initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.home.banner.list,
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
                    className: 'btn-td show-detail-td',
                    render: (data, type, row, meta) => {
                        return `
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改">修改</button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>
                        
                        `;
                    }
                },
                {
                    title: '标题',
                    data: 'Name',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '描述',
                    data: 'Description',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详情">详情</button>`;
                    }
                },
                {
                    title: '创建时间',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
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

        var editor1 = $('#add-editor').CustomUeEditor({
            button: {
                chooseImage: false,
                uploadImage: {
                    className: 'btn btn-primary'
                }
            }
        })
        fun_data.ue = editor1.ue;

        $('.tool-container').on('click', '.btn-add', () => {

            // 图片上传成功保存数据
            $('#add-uploader').on('uploaded', function (upload, file) {
                let response = JSON.parse(file.result.response);
                if (response.Result) {
                    fun_data['ResourceId'] = response.Id;
                    console.log(fun_data)
                }
            });

            // 表单提交
            formSubmit(fun_data);

            layui.layer.open({
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    layui.layer.full(index);

                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            //监听提交
            layui.form.on('submit(add)', function (data) {
                console.log(data)

                // 资源存在
                if (fun_data.ResourceId) {
                    let sendData = {};
                    // 资源id
                    sendData.imgId = fun_data.ResourceId;
                    sendData.richtext = Base.encode(fun_data.ue.getContent());

                    for (let i in data.field) {
                        sendData[i] = data.field[i];
                    }
                    console.log(sendData)
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.home.banner.add,
                        data: sendData
                    })
                } else {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传图片',
                        offset: '20%',
                        anim: 2,
                        time: 3000
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
        var fun_data = {};
        var editor1 = $('#modify-editor').CustomUeEditor({
            button: {
                chooseImage: false,
                uploadImage: {
                    className: 'btn btn-primary'
                }
            }
        })
        fun_data.ue = editor1.ue;

        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            // 图片id
            fun_data.ResourceId = fun_data.modify.ImgId
            console.log(fun_data)

            $('#modify-uploader').on('uploaded', function (upload, file) {
                let response = JSON.parse(file.result.response);
                if (response.Result) {
                    fun_data['ResourceId'] = response.Id;
                    console.log(fun_data)
                }
            });

            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#modify-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    layui.layer.full(index);

                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });


        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};
            sendData.id = fun_data.modify.Id;
            //监听提交
            layui.form.on('submit(modify)', function (data) {
                // 图片资源存在
                if (fun_data.ResourceId) {
                    // 资源id
                    sendData.imgId = fun_data.ResourceId;
                    sendData.richtext = Base.encode(fun_data.ue.getContent());

                    // 请求数据
                    for (let i in data.field) {
                        sendData[i] = data.field[i];
                    }
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.home.banner.modify,
                        data: sendData
                    })
                } else {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传图片',
                        offset: '20%',
                        anim: 2,
                        time: 3000
                    });
                }
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            // 标题
            form.find('input[name=name]').val(fun_data.modify.Name);
            // 描述
            form.find('input[name=description]').val(fun_data.modify.Description || '无');
            // 详细信息
            setTimeout(function () {
                if(fun_data.modify.RichText) {
                    fun_data.ue.setContent(Base.decode(fun_data.modify.RichText));
                }
            }, 500);

            // 图片
            let $img_box = form.find('.img-box');
            $img_box.empty();
            $img_box.append(`
                <div class="item">
                    <img class="origin-image show_resource_in_browser" title="查看大图" src="${fun_data.modify.ThumbnailUrl}" data-src="${fun_data.modify.Url}" data-id="${fun_data.modify.ImgId}" alt="">
                    <span class="btn-close-origin">x</span>
                </div>
            `);

            // 点击图片右侧的按钮，清除这个资源
            form.find('.btn-close-origin').click((e) => {
                let $this = $(e.currentTarget);
                fun_data.ResourceId = null;
                $this.parent().remove();
            });

        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            console.log($this.data('modify'))
            let Id = $this.data('modify').Id;
            layui.layer.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.home.banner.delete,
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
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

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
            url: _HOST.add_rort + _HOST.resource.upload_file,

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