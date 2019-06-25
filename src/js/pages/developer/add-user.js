/**
 * @description 登录页面（无用）
 * @author zhengshenli
 * @createAt 2017-12-26 
 * @updateBy
 * @updateAt
 */

require('tool/jquery-extend.js');
var _Host = require('tool/host.js');
$(function () {

    init();

    /**
     * @description 页面初始化
     */
    function init() {
        // 表单验证
        form_verify();
        // 表单提交
        form_submit();
    }

    /**
     * @description 表单验证模块
     */
    function form_verify() {
        var form = layui.form;
        console.log(form)
        form.verify({
            username: (value, item) => {
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
            password: (value, item) => {
                if (!/^[\S]{6,12}$/.test(value)) {
                    return '密码必须6到12位，且不能出现空格';
                }
            },
            repassword: (value, item) => {
                let password1 = $('form input[name=password1]').val();
                if (password1 !== value) {
                    return '两次输入的密码不一致';
                }
            }
        })
    }

    /**
     * @description 表单提交
     */
    function form_submit() {
        var form = layui.form;
        form.on('submit()', (data) => {
            console.log(data);
            let field = data.field;

            let username = field.username;
            let password1 = field.password1;
            let password2 = field.password2;

            // 提交按钮
            var $btn_submit = $('form .btn-submit');
            //点击登陆按钮后禁用，防止重复提交数据
            $btn_submit.attr('disabled', 'disabled');

            //登陆的请求
            $.ajax({
                url: Global.mainframe + GetPulicKeyUri,
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
                            url: Global.mainframe + loginUri,
                            type: 'POST',
                            data: {
                                username: username,
                                password: encrypetedPassword
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

                                    dialog.init(function () {
                                        dialog.find('.bootbox-body').html('登陆成功!');
                                        setTimeout(function () {
                                            location.href = View.mainPage.url;
                                        }, 2000);
                                    });
                                } else {
                                    dialog.modal('hide');
                                    //登陆失败，使登陆按钮重新可用
                                    $btn_submit.removeAttr('disabled');
                                    //登陆失败的提示框
                                    bootbox.alert({
                                        buttons: {
                                            ok: {
                                                label: '确定',
                                                className: 'btn-primary'
                                            }
                                        },
                                        title: '登陆失败',
                                        message: res.Desc,
                                        callback: function () {}
                                    });
                                }
                            },
                            error: function (err) {
                                dialog.modal('hide');
                                //请求失败，使登陆按钮重新可用
                                $btn_submit.removeAttr('disabled');
                                //请求失败的提示框
                                bootbox.alert({
                                    buttons: {
                                        ok: {
                                            label: '确定',
                                            className: 'btn-primary'
                                        }
                                    },
                                    title: '请求失败',
                                    message: '请求失败，请稍后再试...',
                                    callback: function () {}
                                });
                            }
                        });
                    }
                },
                error: function (err) {
                    dialog.modal('hide');
                    //请求失败，使登陆按钮重新可用
                    $btn_submit.removeAttr('disabled');
                    console.log(err);
                    //请求失败的提示框
                    bootbox.alert({
                        buttons: {
                            ok: {
                                label: '确定',
                                className: 'btn-primary'
                            }
                        },
                        title: '请求失败',
                        message: '请求失败，请稍后再试...',
                        callback: function () {}
                    });
                }
            });
        });
    }


})