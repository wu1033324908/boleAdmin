/**
 * @description 登录页面（无用）
 * @author zhengshenli
 * @createAt 2017-12-25 11点55分
 * @updateBy
 * @updateAt
 */

require('tool/jquery-extend.js');
var _HOST = require('tool/host.js');
var _VIEW = require('tool/view.js');
$(function () {

    //登陆uri
    var _LOGIN_URL = _HOST.login.login;
    //获取公钥的uri
    var _GET_PUBLICK_KEY_URL = _HOST.login.get_publick_key;

    init();

    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化验证码
        verify_code();
        // 表单验证
        form_verify();
        // 表单提交
        form_submit();
    }

    /**
     * @description 验证码模块的初始化
     */
    function verify_code() {
        // 点击显示验证码组件的按钮
        var $btn_show_verify = $('.btn-verify');

        // 验证码组件
        var $verify_code_box = $('#verify-code-box');

        // 显示验证码组件的点击事件
        $btn_show_verify.on('click', function () {
            $verify_code_box.empty();
            $verify_code_box.slideVerify({
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
                ready: function () {
                    // 显示验证码组件
                    $verify_code_box.addClass('active');
                },
                success: function () {
                    // 隐藏验证码组件
                    $verify_code_box.removeClass('active');
                    // 设置按钮的样式
                    $btn_show_verify.attr('disabled', '');
                    $btn_show_verify.html('验证通过<i class="layui-icon">&#xe618;</i>');
                    $btn_show_verify.addClass('layui-btn').removeClass('layui-btn-primary');
                    $btn_show_verify.data('verify', true);

                    // alert('验证成功，添加你自己的代码！');
                    //......后续操作
                },
                error: function () {
                    //		        	alert('验证失败！');
                }

            });
        });
    }

    /**
     * @description 表单验证模块
     */
    function form_verify() {
        var form = layui.form;
        form.verify({
            username: function (value, item) {
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
            },
            password: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            'verify-code': function (value, item) {
                // 点击显示验证码组件的按钮
                var $btn_show_verify = $('.btn-verify');
                if (!$btn_show_verify.data('verify')) {
                    return '验证码还未验证通过！';
                }
            }
        })
        // console.log(form)
    }

    /**
     * @description 表单提交
     */
    function form_submit() {
        var form = layui.form;
        var layer = layui.layer;
        console.log(layer)
        form.on('submit(login)', function (data) {
            let loading_layer = layer.load();

            console.log(data);
            let field = data.field;

            let username = field.username;
            let password = field.password;

            // 提交按钮
            var $btn_submit = $('form .btn-submit');
            //点击登陆按钮后禁用，防止重复提交数据
            $btn_submit.attr('disabled', 'disabled');


            //登陆的请求
            $.ajax({
                url: _HOST.addRort + _GET_PUBLICK_KEY_URL,
                type: 'POST',
                data: {
                    username: username
                },
                success: function (res) {
                    if (res.Result) {

                        //设置最大位数
                        setMaxDigits(131);
                        //获得公钥
                        var key = new RSAKeyPair(res.Exponent, '', res.Modulus);
                        //对密码进行RSA加密
                        var encrypetedPassword = encryptedString(key, base64encode(password));

                        $.ajax({
                            url: _HOST.addRort + _LOGIN_URL,
                            type: 'POST',
                            data: {
                                username: username,
                                password: encrypetedPassword
                            },
                            complete: () => {
                                layer.close(loading_layer);
                            },
                            success: function (res) {
                                console.log(res);
                                if (res.Result) {
                                    //设置用户ID
                                    sessionStorage.setItem('userId', res.UserId);
                                    //设置token
                                    sessionStorage.setItem('accessToken', res.AccessToken);
                                    //设置角色名
                                    sessionStorage.setItem('role', res.RoleName);
                                    //设置name
                                    sessionStorage.setItem('username', res.UserName);

                                    layer.open({
                                        title: '成功',
                                        content: '登录成功！',
                                        btn: [],
                                        success: () => {
                                            setTimeout(function () {
                                                location.href = _GLOBAL.adminRoot + _VIEW.index.url;
                                            }, 2000);
                                        }
                                    });
                                } else {
                                    layer.open({
                                        title: '失败',
                                        content: res.Desc,
                                        yes: (index, layero) => {
                                            $btn_submit.removeAttr('disabled');
                                            layer.close(index)
                                        }
                                    });
                                }
                            },
                            error: function (err) {
                                layer.open({
                                    title: '失败',
                                    content: '请求失败，请稍后再试！',
                                    yes: (index, layero) => {
                                        $btn_submit.removeAttr('disabled');
                                        layer.close(index)
                                    }
                                });
                            }
                        });
                    }
                },
                error: function (err) {
                    layer.open({
                        title: '失败',
                        content: '请求失败，请稍后再试！',
                        yes: (index, layero) => {
                            $btn_submit.removeAttr('disabled');
                            layer.close(index)
                        }
                    });
                }
            });
        });
    }


})