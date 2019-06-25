/**
 * @description 百度富文本案例
 * @author zhengshenli
 * @createAt 2018-01-10
 */

var _HOST = require('tool/host');
$(function () {

    /**
     * @description layui layer 对象
     */
    var _LAYER = layui.layer;

    init();


    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化添加模块
        initAddModule();
        // 初始化富文本
        initUeEditor();
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
                        type: 'GET'
                    },
                    className: 'btn btn-primary'
                },
                uploadImage: false
            }
        })
    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 点击添加按钮，显示表单
        $('.tool-container').on('click', '.btn-add', () => {
            _LAYER.open({
                zIndex: 100,
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: true,
                anim: 2,
                success: (layero, index) => {
                    _LAYER.full(index)

                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    _LAYER.close(index);
                }
            })
        });
    }

});