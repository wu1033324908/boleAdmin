/**
 * @description 预约管理
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


    init();
    /**
     * @description 页面初始化
     */
    function init() {
        getData();
    }




    /**
     * @description 获取数据
     */
    function getData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.updateCountTimeCount.get,
            type: 'POST',
            success: function (res) {
                if (res.Result) {
                    if (res.Count >= 0) {
                        initAddModule(res.Count);
                    } else {
                        // var fun_data = {
                        //     modify: res.Data[0]
                        // }
                        // initModifyModule(fun_data);
                    }
                }
            }
        })
    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule(data) {

        initForm(data)

        formSubmit();

        /**
         * @description 表单提交
         */
        function formSubmit() {
            let sendData = {};

            //监听提交
            layui.form.on('submit(modify)', function (data) {

                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData)
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.updateCountTimeCount.set,
                    data: sendData
                });


                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(data) {
            // 修改模块表单
            let form = $('form');
            // 成语闪卡速度
            form.find('input[name=courseTimeCount]').val(data || 0);
            layui.form.render();
        }
    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {

        // 初始化表单
        initForm();
        // 表单提交
        formSubmit();

        /**
         * @description 表单提交
         */
        function formSubmit() {
            let sendData = {};

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                // console.log(sendData);

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.updateCountTimeCount.set,
                    data: sendData
                })
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm() {
            // 修改模块表单
            let form = $('form');
            // 成语闪卡速度
            form.find('input[name=courseTimeCount]').val(0);
            layui.form.render();
        }
    }
});