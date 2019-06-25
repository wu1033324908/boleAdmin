/**
 * @description 关于我们
 * @author zhengshenli
 * @createAt 2018-04-07
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    console.log(layui.form)

    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 获取数据
        getData();
    }

    /**
     * @description 获取数据
     */
    function getData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.rich_text.get,
            type: 'POST',
            data: {
                type: 1
            },
            success: function (res) {
                console.log(res)
                if (res.Result) {
                    var fun_data = {
                        rich_text: res.RichText || ''
                    }
                    initModifyModule(fun_data);
                }
            }
        })
    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule(fun_data) {
        var editor1 = $('#editor').CustomUeEditor({
            button: {
                chooseImage: false,
                uploadImage: {
                    className: 'btn btn-primary'
                }
            }
        })
        fun_data.ue = editor1.ue;

        // 初始化表单
        initForm();
        // 表单提交
        formSubmit();

        /**
         * @description 表单提交
         */
        function formSubmit() {
            let sendData = {
                type: 1
            };

            //监听提交
            layui.form.on('submit()', function (data) {
                sendData.richtext = Base.encode(fun_data.ue.getContent());
                console.log(sendData)

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.rich_text.modify,
                    data: sendData
                })
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm() {
            let form = $('form');
            setTimeout(function () {
                if(fun_data.rich_text) {
                    fun_data.ue.setContent(Base.decode(fun_data.rich_text));
                }
            }, 500);

        }
    }

});