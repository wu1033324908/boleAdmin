/**
 * @description 教师待审核
 * @author zhengshenli
 * @createAt 2018-03-12
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    console.log(layui.form)

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
        // 初始化表格搜索
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.teacher.list_check);
        // 初始化修改模块
        initModifyModule();

        $.showResourceInBrowser();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            order: [
                [2, 'asc']
            ],
            ajax: {
                url: _HOST.add_rort + _HOST.teacher.list_check,
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
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详细信息">详情</button>
                        `;
                    }
                },
                {
                    title: '手机号',
                    data: 'Phone',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详细信息">详情</button>`;
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
     * @description 初始化修改模块
     */
    function initModifyModule() {
        var fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            console.log(fun_data)

            // 初始化表单
            initForm(fun_data);

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
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            // 课程名称
            form.find('.tel').text(fun_data.modify.Phone);
            form.find('.tel').attr('data-id', fun_data.modify.Id);
            var $img_box = form.find('.img-box');
            $img_box.empty();
            fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                $img_box.append(`
                    <div class="item">
                        <img class="origin-image jigsaw-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.Url[index]}" />
                    </div>
                `);
            });
        }
        $('.btn-pass').on('click', (e) => {
            layui.layer.open({
                type: 0,
                title: '注意',
                content: '是否审核通过？',
                offset: '20%',
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    $.ajax({
                        url: _HOST.add_rort + _HOST.teacher.yes,
                        type: 'POST',
                        data: {
                            teacherid: fun_data.modify.Id
                        },
                        success: function (res) {
                            if (res.Result) {
                                layui.layer.open({
                                    type: 0,
                                    title: '提示',
                                    content: '操作成功',
                                    offset: '20%',
                                    end: function () {
                                        location.reload();
                                    }
                                })
                            } else {
                                layui.layer.open({
                                    type: 0,
                                    title: '提示',
                                    content: '操作失败',
                                    offset: '20%'
                                })
                            }
                        }
                    })
                }
            })
        });
        $('.btn-refuse').on('click', (e) => {
            layui.layer.open({
                type: 0,
                title: '注意',
                content: '是否拒绝通过？',
                offset: '20%',
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    console.log(arguments)
                    $.ajax({
                        url: _HOST.add_rort + _HOST.teacher.no,
                        type: 'POST',
                        data: {
                            teacherid: fun_data.modify.Id
                        },
                        success: function (res) {
                            if (res.Result) {
                                layui.layer.open({
                                    type: 0,
                                    title: '提示',
                                    content: '操作成功',
                                    offset: '20%',
                                    end: function () {
                                        location.reload();
                                    }
                                })
                            } else {
                                layui.layer.open({
                                    type: 0,
                                    title: '提示',
                                    content: '操作失败',
                                    offset: '20%'
                                })
                            }
                        }
                    })
                }
            })
        });
    }

});