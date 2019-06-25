/**
 * @description 首页
 * @author zhengshenli
 * @createAt 2017-12-25 11点55分
 * @updateBy
 * @updateAt
 */

var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    init();

    /**
     * @description 页面初始化
     */
    function init() {
        // init_verify();
    }

    /**
     * @description 验证码模块的初始化
     */
    function init_verify() {
        // 点击显示验证码组件的按钮
        let $btn_show_verify = $('button.verify');

        // 显示验证码组件的点击事件
        $btn_show_verify.on('click', function () {
            $('#verify-box').slideVerify({
                type: 2, //类型
                vOffset: 5, //误差量，根据需求自行调整
                vSpace: 5, //间隔
                imgName: ['../../assets/img/verify/1.jpg', '../../assets/img/verify/2.jpg'],
                imgSize: {
                    width: '400px',
                    height: '200px',
                },
                blockSize: {
                    width: '40px',
                    height: '40px',
                },
                barSize: {
                    width: '400px',
                    height: '40px',
                },
                ready: function () {},
                success: function () {
                    alert('验证成功，添加你自己的代码！');
                    //......后续操作
                },
                error: function () {
                    //		        	alert('验证失败！');
                }

            });
        });
    }



})