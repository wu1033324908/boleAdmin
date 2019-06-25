/**
 * @description test1页面（无用
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

    var _TABLE_OBJ = $('#table').dataTable({
        ajax: {
            url: _GLOBAL.adminRoot + 'assets/table.json',
            type: 'GET',
            dataSrc: (res) => {
                console.log(res)
                return res.Data;
            }
        },
        columns: [
            {
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
        initComplete: () => {
            $('.dataTables_paginate').append(`
                <span class="page-skip-container">
                    到第<input type="text" min="1" value="8" class="page-skip-input">页
                    <button type="button" class="btn-page-skip">确定</button>
                </span>
                `)
            $('.table-container').find('.no-footer').removeClass('no-footer');

        }
    });

    $('.tool-container').on('click', '.btn-add', () => {
        _LAYER.open({
            type: 1,
            title: '添加',
            content: $('#add-module'),
            maxmin: true,
            anim: 2,
            success: (layero, index) => {
                _LAYER.full(index)
                console.log(layero)
            },
            cancel: (index, layero) => {
                $('.layer-content-molude').css('display', 'none');
                _LAYER.close(index);
            }
        })
    });

});