/**
 * @description 学生列表
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
        // 初始化表格搜索
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.student.list_all);
        // 初始化修改模块
        initModifyModule();
        initModifyHourModule();

        // 删除学生
        initDeleteModule();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.student.list_all,
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
                            <button type="button" class="btn btn-default size-S btn-modify-hour" data-modify='${JSON.stringify(row)}' title="修改课时">修改课时</button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>
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
                        if (data) {
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
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '课时',
                    data: 'Hour',
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
                    title: '委托批改课时',
                    data: 'CompositionCount',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '省份',
                    data: 'AddressCapital',
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
                    title: '城市',
                    data: 'AddressDistrict',
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
                    title: '区',
                    data: 'AddrssElement',
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
                    title: '学校',
                    data: 'School',
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
                    title: '年级',
                    data: 'Grade',
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
                zIndex: 100,
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

            form.find('.stage').text(fun_data.modify.StageDescribe || '');
            form.find('.section').text(fun_data.modify.CourseDescribe || '');
            form.find('.hour').text(fun_data.modify.Hour || '');
            form.find('.tel').text(fun_data.modify.Phone || '');
            form.find('.nickname').text(fun_data.modify.NickName || '');
            form.find('.capital').text(fun_data.modify.AddressCapital || '');
            form.find('.city').text(fun_data.modify.AddressDistrict || '');
            form.find('.area').text(fun_data.modify.AddrssElement || '');
            form.find('.school').text(fun_data.modify.School || '');
            form.find('.grade').text(fun_data.modify.Grade || '');
        }
    }

    /**
     * @description 修改课时
     */
    function initModifyHourModule() {
        var fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify-hour', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            console.log(fun_data)

            // 初始化表单
            initForm();
            formSubmit();

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#modify-hour-module'),
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
        function initForm() {
            // 修改模块表单
            let form = $('#modify-hour-module form');
            console.log(fun_data.modify)
            form.find('.origin-hour').text(fun_data.modify.Hour || '');
            form.find('.origin-entrust-hour').text(fun_data.modify.CompositionCount	 || '');
            form.find('input[name=hour]').val(fun_data.modify.Hour || '');
            form.find('input[name=compositionCount]').val(fun_data.modify.CompositionCount	 || '');
        }

        /**
         * @description 表单提交
         */
        function formSubmit() {
            let sendData = {
                studentid: fun_data.modify.Id || false,
            };

            //监听提交
            layui.form.on('submit(modify-hour)', function (data) {
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }

                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.student.modify_hour,
                    data: sendData
                })
                return false;
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
                        url: _HOST.add_rort + _HOST.student.delect,
                        data: {
                            studentId: Id
                        },
                        successMsg: '删除成功'
                    })
                }
            })
        });
    }
});