/**
 * @description 课时管理
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
        initDatePicker();
        getData();
    }

    /**
     * 初始化时间日期选择器
     */
    function initDatePicker() {
        layui.laydate.render({
            elem: '#jigsaw-time',
            format: 'HH:mm:ss',
            value: '00:20:00',
            type: 'time'
        });
        layui.laydate.render({
            elem: '#writing-time',
            format: 'HH:mm:ss',
            value: '00:20:00',
            type: 'time'
        });
    }


    /**
     * @description 获取数据
     */
    function getData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.study_hour.setting.get,
            type: 'POST',
            success: function (res) {
                if (res.Result) {
                    if (res.Data.length <= 0) {
                        initAddModule();
                    } else {
                        var fun_data = {
                            modify: res.Data[0]
                        }
                        initModifyModule(fun_data);
                    }
                }
            }
        })
    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 函数内部传递的数据
        let fun_data = {};
        formSubmit(fun_data);

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};

            //监听提交
            layui.form.on('submit(modify)', function (data) {

                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData)
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.setting.add,
                    data: sendData
                });


                return false;
            });
        }


    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule(fun_data) {

        // 初始化表单
        initForm(fun_data);
        // 表单提交
        formSubmit(fun_data);

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.study_hour.setting.modify,
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
            let form = $('form');
            // 成语闪卡速度
            form.find('input[name=register]').val(fun_data.modify.Register || 0);
            // 成语闪卡次数
            form.find('input[name=complete]').val(fun_data.modify.Complete || 0);
            // 成语抓小偷速度
            form.find('input[name=invitation]').val(fun_data.modify.Invitation || 0);
            layui.form.render();
        }
    }
});