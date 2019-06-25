/**
 * @description test1页面（无用）
 * @author zhengshenli
 * @createAt 2018-01-05
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
$(function () {

    /**
     * @description layui table 组件
     */
    var _LAYUI_TABLE = layui.table;
    /**
     * @description layui layer 组件
     */
    var _LAYER = layui.layer;

    init();
    /**
     * @description 页面初始化
     */
    function init() {
        initAddModule();
    }

    var _TABLE_OBJ = $('#table').dataTable({
        ajax: {
            url: _GLOBAL.adminRoot + 'assets/table.json',
            type: 'GET',
            dataSrc: (res) => {
                console.log(res)
                return res.Data;
            }
        },
        columns: [{
                title: 'ID',
                data: 'id'
            },
            {
                title: '用户名',
                data: 'username'
            },
            {
                title: '性别',
                data: 'sex'
            }
        ],
        drawCallback: function() {
            console.log(this.api)
            $('.dataTables_paginate').append(`
                <span class="page-skip-container">
                    到第<input type="text" min="1" value="8" class="page-skip-input">页
                    <button type="button" class="btn-page-skip">确定</button>
                </span>
                `)
        },
        initComplete: () => {
            $('.table-container').find('.no-footer').removeClass('no-footer');

        }
    });

    $('#cp1').ColorPicker({
        onSubmit: function (hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
        },
        onBeforeShow: function () {
            $(this).ColorPickerSetColor(this.value);
        }
    })

    /**
     * @description 初始化colorpicker
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
            onSubmit: function(hsb, hex, rgb, el) {
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
            onSubmit: function(hsb, hex, rgb, el) {
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




});