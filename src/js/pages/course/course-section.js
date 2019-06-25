/**
 * @description 课程中的课次管理
 * @author zhengshenli
 * @createAt 2018-03-06
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
    /**
     * 初始化时间日期选择器
     */
    function initDatePicker() {
        layui.laydate.render({
            elem: '#school-time',
            // format: 'HH:mm:ss',
            // value: '00:20:00',
            type: 'datetime'
        });
        layui.laydate.render({
            elem: '#school-time-mod',
            // format: 'HH:mm:ss',
            // value: '00:20:00',
            type: 'datetime'
        });
        layui.laydate.render({
            elem: '#school-time2',
            // format: 'HH:mm:ss',
            // value: '00:20:00',
            type: 'datetime'
        });
        layui.laydate.render({
            elem: '#school-time-mod2',
            // format: 'HH:mm:ss',
            // value: '00:20:00',
            type: 'datetime'
        });
    }

    init();
    /**
     * @description 页面初始化
     */
    function init() {

        initDatePicker()

        // 初始化表格
        initTable();
        // 初始化表格搜索
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.course.section.list);

        // 初始化添加模块
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();
        // 获取阶段select 的数据
        $.getSectionSelectData((res) => {
            // 添加模块
            let $add_wrap = $('#add-module select[lay-filter=stage]');
            // 修改模块
            let $modify_wrap = $('#modify-module select[lay-filter=stage]');

            // Id 是阶段的id
            res.Data.forEach((ele, idnex) => {
                $add_wrap.append(`
                    <option value="${ele.Id}">${ele.Describe}</option>
                `);
                $modify_wrap.append(`
                    <option value="${ele.Id}">${ele.Describe}</option>
                `);
            });
            layui.form.render('select');
        });


        // 阶段select 下拉选择事件
        layui.form.on('select(stage)', function (data) {
            console.log(data);
            // selected value
            let id = data.value;

            $.ajax({
                url: _HOST.add_rort + _HOST.course.section.get_last_index,
                type: 'POST',
                data: {
                    stageid: id
                },
                success: (res) => {
                    console.log(res)
                    if (res.Result) {
                        $('#add-module form').find('input[name=modules]').val(res.StageRank);
                        $('#modify-module form').find('input[name=modules]').val(res.StageRank);
                    }else{
                        $('#add-module form').find('input[name=modules]').val(1);
                    }
                }
            });

        });
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.course.section.list,
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
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改"><i class="fa fa-edit"></i></button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                        
                        `;
                    }
                },
                {
                    title: '阶段名称',
                    data: 'CouresDescribe',
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
                    title: '课次名称',
                    data: 'ModuleDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                // {
                //     title: '开课时间',
                //     data: 'BeginAt',
                //     className: 'show-detail-td',
                //     render: (data, type, row, meta) => {
                //         var result = '';
                        
                //         return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                //     }
                // },
                // {
                //     title: '结束时间',
                //     data: 'EndAt',
                //     className: 'show-detail-td',
                //     render: (data, type, row, meta) => {
                //         var result = '';
                        
                //         return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                //     }
                // },
                {
                    title: '课次序号',
                    data: 'Modules',
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
                    title: '课程是否开启',
                    data: 'IsBegin',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '是';
                        if (!data) {
                            result = '否';
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '课程成语闪卡',
                    data: 'IsFlash',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '是';
                        if (!data) {
                            result = '否';
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '贴图是否画圈',
                    data: 'IsCircle',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '是';
                        if (!data) {
                            result = '否';
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


            formSubmit();

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
        function formSubmit() {
            let sendData = {};

            // 是否开启
            layui.form.on('switch(is-open)', function (data) {
                // console.log(data)
                sendData.isbegin = data.elem.checked;
            });
            // 是否画圈
            layui.form.on('switch(is-draw)', function (data) {
                // console.log(data)
                sendData.iscircle = data.elem.checked;
            });
            // 是否成语闪卡
            layui.form.on('switch(is-flash)', function (data) {
                // console.log(data)
                sendData.isflash = data.elem.checked;
            });

            //监听提交
            layui.form.on('submit(add)', function (data) {

                for (let i in data.field) {
                    if (i.indexOf('isbegin') <= -1) {
                        sendData[i] = data.field[i];
                    }
                }
                // console.log(sendData)
                sendData.description = Base.encode(fun_data.ue.getContent());

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.section.add,
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
            console.log(fun_data)

            // 打开一个弹出层
            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);

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
            let sendData = {
                isbegin: fun_data.modify.IsBegin || false,
                isflash: fun_data.modify.IsFlash || false,
                iscircle: fun_data.modify.IsCircle || false,
                id: fun_data.modify.Id
            };

            // 是否开启的变化
            layui.form.on('switch(is-open)', function (data) {
                // console.log(data)
                sendData.isbegin = data.elem.checked;
            });
            // 是否开启的变化
            layui.form.on('switch(is-draw)', function (data) {
                // console.log(data)
                sendData.iscircle = data.elem.checked;
            });

            // 是否成语闪卡
            layui.form.on('switch(is-flash)', function (data) {
                // console.log(data)
                sendData.isflash = data.elem.checked;
            });

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                for (let i in data.field) {
                    if (i.indexOf('isbegin') <= -1) {
                        sendData[i] = data.field[i];
                    }
                }
                sendData.description = Base.encode(fun_data.ue.getContent());

                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.section.modify,
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
            // 课次名称
            form.find('input[name=describe]').val(fun_data.modify.ModuleDescribe);
            // 开课时间
            form.find('input[name=beginAt]').val(fun_data.modify.BeginAt.replace("T"," "));
            // 结束时间
            form.find('input[name=endAt]').val(fun_data.modify.EndAt.replace("T"," "));
            // 课次序号
            form.find('input[name=modules]').val(fun_data.modify.Modules);

            // 是否开启
            let $is_begin = form.find('input[lay-filter=is-open]');
            if (fun_data.modify.IsBegin) {
                $is_begin.attr('checked', 'checked');
            } else {
                $is_begin.removeAttr('checked');
            }

            // 是否画圈
            let $is_draw = form.find('input[lay-filter=is-draw]');
            if (fun_data.modify.IsCircle) {
                $is_draw.attr('checked', 'checked');
            } else {
                $is_draw.removeAttr('checked');
            }

            // 是否成语闪卡
            let $is_flash = form.find('input[lay-filter=is-flash]');
            if (fun_data.modify.IsFlash) {
                $is_flash.attr('checked', 'checked');
            } else {
                $is_flash.removeAttr('checked');
            }
            // 阶段设置selected
            form.find('select[lay-filter=stage]').val(fun_data.modify.StageId);

            setTimeout(function () {
                if (fun_data.modify.Description) {
                    fun_data.ue.setContent(Base.decode(fun_data.modify.Description));
                }
            }, 500);

            layui.form.render();
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
                        url: _HOST.add_rort + _HOST.course.section.delete,
                        data: {
                            Id: Id
                        },
                        successMsg: '删除成功'
                    })
                }
            })
        });
    }

});