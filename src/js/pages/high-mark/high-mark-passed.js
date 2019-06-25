/**
 * @description 百分榜通过审核
 * @author zhengshenli
 * @createAt 2018-01-29
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
        // 初始化表格搜索
        $.initSearchTable(_TABLE_OBJ, _HOST.add_rort + _HOST.student.high_mark.list_passed);
        // 添加模块
        initAddModule();

        // 详情
        initDescModule();
        initDeleteModule();
    }

    /**
     * @description 表格
     */
    function initTable() {
        _TABLE_OBJ = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.student.high_mark.list_passed,
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
                        var result = `<button type="button" class="btn btn-default size-S btn-desc" data-modify='${JSON.stringify(row)}' title="详情">详情</button><button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>`;

                        return result;
                    }
                },
                {
                    title: '手机号',
                    data: 'Tel',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '昵称',
                    data: 'NickName',
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
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '城市',
                    data: 'AddressDistrict',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '年级',
                    data: 'Grade',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '作文标题',
                    data: 'Headline',
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
                        return `<button type="button" class="btn btn-default size-S btn-desc" data-modify='${JSON.stringify(row)}' title="修改">查看</button>`;
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
     * @description colorpicker
     */
    function init_color_picker() {
        console.log(1)
        $('#front-color div').css('background-color', '#000000');
        $('#back-color div').css('background-color', '#ffffff');
        console.log($('#back-color div'))
        // 前景色
        $('#front-color').ColorPicker({
            color: '#000000',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onSubmit: function (hsb, hex, rgb, el) {
                $(el).ColorPickerHide();
            },
            onChange: function (hsb, hex, rgb) {
                $('#front-color div').css('background-color', '#' + hex);
                $('#front-color').data('color', '#' + hex);
            }
        })
        // 背景色
        $('#back-color').ColorPicker({
            color: '#ffffff',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onSubmit: function (hsb, hex, rgb, el) {
                $(el).ColorPickerHide();
            },
            onChange: function (hsb, hex, rgb) {
                $('#back-color div').css('background-color', '#' + hex);
                $('#back-color').data('color', '#' + hex);
            }
        })
    }


    /**
     * @description 添加模块
     */
    function initAddModule() {
        $('.tool-container').on('click', '.btn-add', () => {
            _LAYER.open({
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    _LAYER.full(index)
                    init_color_picker();
                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            })
        });

        //监听提交
        layui.form.on('submit(add)', function (data) {
            let sendData = {};
            for (let i in data.field) {
                sendData[i] = data.field[i];
            }
            console.log(sendData);

            // $.ajaxRequestTemplate({
            //     url: 'http://qiaozhugeguanjia.com:60011/Area/Mod',
            //     data: sendData
            // })
            return false;
        });
    }


    /**
     * @description 详情
     */
    function initDescModule() {
        // 函数内部传递的数据
        let fun_data = {};

        $('.dataTables_wrapper').on('click', 'tbody .btn-desc', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            // 初始化表单
            initForm(fun_data);
            // // 表单提交
            formSubmit(fun_data);

            // 打开一个弹出层
            _LAYER.open({
                type: 1,
                title: '详情',
                content: $('#desc-module'),
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    _LAYER.full(index);

                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            });
        });

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#desc-module form');
            form.find('input[name=Tel]').val(fun_data.modify.Tel);
            form.find('input[name=NickName]').val(fun_data.modify.NickName);
            form.find('input[name=Headline]').val(fun_data.modify.Headline);
            form.find('input[name=AddressCapital]').val(fun_data.modify.AddressCapital);
            form.find('input[name=AddressDistrict]').val(fun_data.modify.AddressDistrict);
            form.find('input[name=Grade]').val(fun_data.modify.Grade);

            let $img_box = form.find('.img-box');
            if($img_box.children().length === 0) {
                fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                    $img_box.append(`
                        <div class="item">
                        <img class="origin-image show_resource_in_browser" title="${fun_data.modify.Url[index]}" src="${ele}" data-src="${fun_data.modify.Url[index]}">
                        </div>
                    `);
                });
            }
        }

        /**
         * 表单提交
         */
        function formSubmit() {
            let sendData ={
                hundredid: fun_data.modify.Id
            }
            // 审核通过
            layui.form.on('submit(confirm)', function (data) {
                layui.layer.open({
                    type: 0,
                    title: '提示',
                    content: '这条记录是否通过审核?',
                    btn: ['确认', '取消'],
                    yes: function(index, layero) {
                        $.ajaxRequestTemplate({
                            url: _HOST.add_rort + _HOST.student.high_mark.pass,
                            data: sendData
                        });
                    },
                    btn2: function(index, layero) {
                        layui.layer.close(index);
                    }
                })
            });
            // 审核拒绝
            layui.form.on('submit(refuse)', function (data) {
                layui.layer.open({
                    type: 0,
                    title: '提示',
                    content: '这条记录是否拒绝审核?',
                    btn: ['确认', '取消'],
                    yes: function(index, layero) {
                        $.ajaxRequestTemplate({
                            url: _HOST.add_rort + _HOST.student.high_mark.refuse,
                            data: sendData
                        });
                    },
                    btn2: function(index, layero) {
                        layui.layer.close(index);
                    }
                })
            });
        }
    }

    /**
     * 撤回未审核通过的记录
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            console.log($this.data('modify'))
            let modify = $this.data('modify');

            layui.layer.open({
                title: '删除',
                content: '确认删除该记录?',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.student.high_mark.delete_passed,
                        data: {
                            hundredid: modify.HundredId,
                            studentid: modify.Id
                        },
                        successMsg: '删除成功'
                    })
                }
            })
        });
    }


});