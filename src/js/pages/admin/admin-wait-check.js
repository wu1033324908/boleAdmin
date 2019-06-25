/**
 * @description 管理员待审核列表
 * @author zhengshenli
 * @createAt 2018-03-29
 */

require('tool/jquery-extend');

var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
$(function () {

    /**
     * @description layui layer 组件
     */
    var _LAYER = layui.layer;

    /**
     * @description 表格对象
     */
    var _TABLE_OBJ = null;

    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 显示缩略图的大图
        $.showResourceInBrowser();
        // 表格
        initTable();

        // 审核通过或拒绝操作
        operation();
    }

    /**
     * @description 表格
     */
    function initTable() {
        _TABLE_OBJ = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.admin.list_wait,
                type: 'POST',
                dataSrc: (res) => {
                    if (res.Result) {
                        return res.Data;
                    } else {
                        $.datatableRequestFailTip(1, res);
                    }
                },
                error: () => {
                    $.datatableRequestFailTip(2);
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
                        var result = `<button type="button" class="btn btn-default size-S btn-pass" data-modify='${JSON.stringify(row)}' title="通过">通过</button><button type="button" class="btn btn-default size-S btn-refuse" data-modify='${JSON.stringify(row)}' title="拒绝">拒绝</button>`;

                        return result;
                    }
                },
                {
                    title: '手机号',
                    data: 'Phone',
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
                    title: '创建时间',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                }
            ],
            // 表格重绘完成后
            drawCallback: function () {
                var api = this.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                // 序号
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });
                // 表格跳页
                $.datatablesSkipPagigate(this);
            },
            // 表格初始化完成
            initComplete: function () {
                // 表格样式
                $.datatablesStyle();
            }
        });

    }

    /**
     * 审核通过或拒绝
     */
    function operation() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-pass', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            let id = $this.data('modify').Id;

            layui.layer.open({
                type: 0,
                title: '提示',
                content: '这条记录是否通过审核?',
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.admin.operate_pass,
                        data: {
                            adminid: id
                        }
                    });
                },
                btn2: function (index, layero) {
                    layui.layer.close(index);
                }
            })
        });
        $('.dataTables_wrapper').on('click', 'tbody .btn-refuse', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            let id = $this.data('modify').Id;

            layui.layer.open({
                type: 0,
                title: '提示',
                content: '这条记录是否拒绝?',
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.admin.operate_refuse,
                        data: {
                            adminid: id
                        }
                    });
                },
                btn2: function (index, layero) {
                    layui.layer.close(index);
                }
            })
        });
    }


});