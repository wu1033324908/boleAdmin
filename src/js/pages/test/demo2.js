/**
 * @description test1页面
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

        initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: 'http://qiaozhugeguanjia.com:60011/Area/List',
                type: 'POST',
                dataSrc: (res) => {
                    console.log(res)
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: 'Id',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, {
                    title: '操作',
                    data: 'null',
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
                    title: 'EnCode',
                    data: 'EnCode',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'EnabledMark',
                    data: 'EnabledMark',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'SimpleSpelling',
                    data: 'SimpleSpelling',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'Layers',
                    data: 'Layers',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'Description',
                    data: 'Description',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'SortCode',
                    data: 'SortCode',
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
                console.log(_TABLE.api())
                console.log(this.api())
                var api = _TABLE.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate();
            }
        });
        // datatables 的样式设置
        $.datatablesStyle();

    }


    /**
     * @description 初始化添加模块
     */
    function initAddModule() {
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
                    formSubmit();
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
                let sendData = {};
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: 'http://qiaozhugeguanjia.com:60011/Area/Add',
                    data: sendData
                })
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
                    url: 'http://qiaozhugeguanjia.com:60011/Area/Mod',
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
            form.find('input[name=Id]').val(fun_data.Id);
            form.find('input[name=Name]').val(fun_data.Name);
            form.find('input[name=ParentId]').val(fun_data.ParentId);
            form.find('input[name=Layers]').val(fun_data.Layers);
            form.find('input[name=SimpleSpelling]').val(fun_data.SimpleSpelling);
            form.find('input[name=EnCode]').val(fun_data.EnCode);
            form.find('input[name=Description]').val(fun_data.Description);
            form.find('input[name=EnabledMark]').val(fun_data.EnabledMark);
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
                        url: 'http://qiaozhugeguanjia.com:60011/Area/Del',
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

        $('.tool-container').on('click', '.btn-upload', () => {
            _LAYER.open({
                zIndex: 100,
                type: 1,
                title: '上传',
                content: $('#upload-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    _LAYER.full(index);

                    $('#fileupload').fileupload({
                        dataType: 'json',
                        done: function (e, data) {
                            console.log(e)
                            console.log(data)
                            $.each(data.result.files, function (index, file) {
                                $('<p/>').text(file.name).appendTo(document.body);
                            });
                        }
                    });
                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            });
        });


    }
});