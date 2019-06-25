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
        // initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();
        // 初始化富文本
        // initUeEditor();

        // initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: 'http://qiaozhugeguanjia.com:60011/WgwMsg/List',
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
                    title: 'UserName',
                    data: 'UserName',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'QMsg',
                    data: 'QMsg',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: 'AMsg',
                    data: 'AMsg',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        let result = '';
                        if (data) {
                            result = `<div class="td-ellipsis" title="${data}">${data}</div>`;
                        }
                        return result;
                    }
                },
                {
                    title: 'AMsgAt',
                    data: 'AMsgAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        let result = '';
                        if (data) {
                            result = `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                        }
                        return result;
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
                sendData['Id'] = fun_data.Id;

                $.ajaxRequestTemplate({
                    url: 'http://qiaozhugeguanjia.com:60011/WgwMsg/Mod',
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
            form.find('input[name=UserName]').val(fun_data.UserName);
            form.find('textarea[name=QMsg]').text(fun_data.QMsg);
            form.find('textarea[name=AMsg]').text(fun_data.AMsg || '');
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
                        url: 'http://qiaozhugeguanjia.com:60011/WgwMsg/Del',
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