/**
 * @description 学生课堂拼图
 * @author zhengshenli
 * @createAt 2018-03-14
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
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.student.jigsaw.list_all);
        // 初始化修改模块
        initModifyModule();
        // 点击图片，将在浏览器打开图片大图
        $.showResourceInBrowser();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.student.jigsaw.list_all,
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
                            // <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                    }
                },
                {
                    title: '手机号',
                    data: 'Phone',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if(data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '昵称',
                    data: 'NickName',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if(data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '阶段名称',
                    data: 'StageDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if(data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '课次名称',
                    data: 'CouresDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if(data) {
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
                        return `<button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详细信息">详情</button>`
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
            // 阶段名称
            form.find('.stage').text(fun_data.modify.StageDescribe || '');
            // 课次名称
            form.find('.section').text(fun_data.modify.CouresDescribe || '');
            // 手机号
            form.find('.Phone').text(fun_data.modify.Phone || '');
            // 昵称
            form.find('.NickName').text(fun_data.modify.NickName || '');

            // 设置拼图的属性
            form.find('.jigsaw-image').attr('src', fun_data.modify.ThumbnailUrl);
            form.find('.jigsaw-image').attr('data-src', fun_data.modify.Url);
            form.find('.jigsaw-image').attr('title', '查看大图');

        }
    }
});