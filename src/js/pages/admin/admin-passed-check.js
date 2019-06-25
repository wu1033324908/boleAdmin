/**
 * @description 子管理员审核通过
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

        initDescModule();
        // 设置权限
        setPermission();
    }

    /**
     * @description 表格
     */
    function initTable() {
        _TABLE_OBJ = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.admin.list_passed,
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
                        var result = `
                        <button type="button" class="btn btn-default size-S btn-desc" data-modify='${JSON.stringify(row)}' title="详情">详情</button>
                        <button type="button" class="btn btn-default size-S btn-set-permission" data-modify='${JSON.stringify(row)}' title="设置权限">设置权限</button>
                        <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>`;

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
                    title: '权限',
                    data: 'RoleName',
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
    function initDescModule() {
        let fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-desc', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            initForm();

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#desc-module'),
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

        function initForm() {
            let $form = $('#desc-module form');
            $form.find('input[name=Phone]').val(fun_data.modify.Phone);
            $form.find('input[name=RoleName]').val(fun_data.modify.RoleName);
        }

    }

    /**
     * 设置权限
     */
    function setPermission() {
        var fun_data = {}
        $('.dataTables_wrapper').on('click', 'tbody .btn-set-permission', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            initForm(fun_data);
            // 表单提交
            // formSubmit(fun_data);
            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#set-permission'),
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

        function initForm() {
            $.ajax({
                url: _HOST.add_rort + _HOST.admin.get_role_list,
                type: 'POST',
                data:{
                    id:fun_data.modify.Id
                },
                success: (res) => {
                    if (res.Result) {
                        let initData = res.Data[0]
                        let $form = $('#set-permission form');
                        
                        let $is_index = $form.find('input[lay-filter=isHome]');
                        let $is_course = $form.find('input[lay-filter=isCourse]');
                        let $is_teacher = $form.find('input[lay-filter=isTeacger]');
                        let $is_student = $form.find('input[lay-filter=isStudent]');
                        let $is_hundred = $form.find('input[lay-filter=isHundred]');
                        let $is_hour = $form.find('input[lay-filter=isHour]');
                        let $is_recharge = $form.find('input[lay-filter=isRecharge]');
                        let $is_bottom = $form.find('input[lay-filter=isBottom]');

                            // 首页管理
                            if (initData.isHome) {
                                $is_index.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_index.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            // 课程管理
                            if (initData.isCourse) {
                                $is_course.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_course.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            
                            // 教师管理
                            if (initData.isTeacger) {
                                $is_teacher.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_teacher.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            
                            // 学生管理
                            if (initData.isStudent) {
                                $is_student.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_student.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            
                            // 百分榜管理
                            if (initData.isHundred) {
                                $is_hundred.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_hundred.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            
                            // 课时管理
                            if (initData.isHour) {
                                $is_hour.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_hour.removeAttr('checked');
                                layui.form.render('checkbox');
                            }

                            // 充值管理
                            if (initData.isRecharge) {
                                $is_recharge.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_recharge.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                            // 页面底部
                            if (initData.isBottom) {
                                $is_bottom.attr('checked', 'checked');
                                layui.form.render('checkbox');
                            }else{
                                $is_bottom.removeAttr('checked');
                                layui.form.render('checkbox');
                            }
                        
                            // 表单提交
                            formSubmit(initData);
                        
                    }
                }
            })
        }


        /**
         * @description 表单提交
         */
        function formSubmit(initData) {
            let sendData = {
                adminid: fun_data.modify.Id,
            };

            let isHome, isCourse, isTeacger, isStudent, isHundred, isHour, isRecharge, isBottom;
            layui.form.on('switch(isHome)', function (data) {
                isHome = data.elem.checked
            });
            layui.form.on('switch(isCourse)', function (data) {
                isCourse = data.elem.checked
            });
            layui.form.on('switch(isTeacger)', function (data) {
                isTeacger = data.elem.checked
            });
            layui.form.on('switch(isStudent)', function (data) {
                isStudent = data.elem.checked
            });
            layui.form.on('switch(isHundred)', function (data) {
                isHundred = data.elem.checked
            });
            layui.form.on('switch(isHour)', function (data) {
                isHour = data.elem.checked
            });
            layui.form.on('switch(isRecharge)', function (data) {
                isRecharge = data.elem.checked
            });
            layui.form.on('switch(isBottom)', function (data) {
                isBottom = data.elem.checked
            });

            //监听提交
            $('#btn-submit-role').click(function () {
                sendData['isHome'] = isHome || initData.isHome
                sendData['isCourse'] = isCourse || initData.isCourse
                sendData['isTeacger'] = isTeacger || initData.isTeacger
                sendData['isStudent'] = isStudent || initData.isStudent
                sendData['isHundred'] = isHundred || initData.isHundred
                sendData['isHour'] = isHour || initData.isHour
                sendData['isRecharge'] = isRecharge || initData.isRecharge
                sendData['isBottom'] = isBottom || initData.isBottom


                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.admin.modify_permission,
                    data: sendData
                })
            })
            // layui.form.on('submit(submit)', function (data) {
            //     // sendData.roleId = data.field.permission;
            //     console.log(data)
                

                // console.log(sendData)
                // $.ajaxRequestTemplate({
                //     url: _HOST.add_rort + _HOST.admin.modify_permission,
                //     data: sendData
                // })


            //     return false;
            // });
        }
    }


});