/**
 * @description 顶部
 * @author zhengshenli
 * @createAt 2018-03-06
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');

$(function () {

    // 顶部用户栏
    var $user_bar = $('#Hui-userbar');
    // 用户栏下的用户名和修改密码
    var $li = $user_bar.find('ul').children('li');

    var user_name = sessionStorage.getItem('user_tel') || '';
    var user_id = sessionStorage.getItem('user_id') || '';
    var role_name = sessionStorage.getItem('role_name') || '';
    var role_id = sessionStorage.getItem('role_id') || '';

    // 设置登录的用户名
    $li.eq(0).html(user_name);
    // 如果不是admin用户，移除修改密码模块
    if(user_name !== 'admin') {
        $li.eq(1).remove();
    }
    $li.eq(1).css('display', 'block');


    // 表单验证
    formVerify();
    // 点击修改密码
    $li.eq(1).click((e) => {
        let $this = $(e.currentTarget);
        layui.layer.open({
            type: 1,
            title: '修改密码',
            content: `
                <form class="layui-form">
                    <div class="layui-form-item">
                        <label class="col col-sm-2 label-control">旧密码</label>
                        <div class="col col-sm-10">
                            <input type="password" name="origin-password" class="layui-input" lay-verify="pass">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="col col-sm-2 label-control">新密码</label>
                        <div class="col col-sm-10">
                            <input type="password" name="password" class="layui-input" lay-verify="pass">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="col col-sm-2 label-control">重复新密码</label>
                        <div class="col col-sm-10">
                            <input type="password" name="double-password" class="layui-input" lay-verify="pass">
                        </div>
                    </div>
                    <div class="layui-form-item form-footer">
                        <label class="col col-sm-2 label-control"></label>
                        <div class="col col-sm-10">
                            <button type="button" class="btn btn-primary" lay-submit lay-filter="submit">立即提交</button>
                        </div>
                    </div>
                </form>
            `,
            success: (layero, index) => {
                layui.layer.full(index);
                layui.form.on('submit(submit)', function (data) {
                    let layer_index = layui.layer.load();
                    // 获得公钥
                    $.ajax({
                        url: _HOST.add_rort + _HOST.login.get_publick_key,
                        type: 'POST',
                        data: {
                            username: 'admin'
                        },
                        success: function (res) {
                            if (res.Result) {
                                //设置最大位数
                                setMaxDigits(131);
                                //获得公钥
                                var key = new RSAKeyPair(res.Exponent, '', res.Modulus);
                                //对密码进行RSA加密
                                let password = encryptedString(key, base64encode(data.field.password));
                                let origin_password = encryptedString(key, base64encode(data.field['origin-password']));
                                // 修改密码
                                $.ajax({
                                    url: _HOST.add_rort + _HOST.login.modify_admin_password,
                                    type: 'POST',
                                    data: {
                                        adminid: user_id,
                                        oldpwd: origin_password,
                                        newpwd: password
                                    },
                                    complete: function () {
                                        layui.layer.close(layer_index);
                                    },
                                    success: function (res) {
                                        if (res.Result) {
                                            layui.layer.open({
                                                type: 0,
                                                content: '操作成功',
                                                offset: '20%',
                                                anim: 2,
                                                end: () => {
                                                    layui.layer.close(index);
                                                }
                                            });
                                        } else {
                                            layui.layer.open({
                                                type: 0,
                                                content: res.desc || res.Desc || '操作失败',
                                                offset: '20%',
                                                anim: 2,
                                            });
                                        }
                                    }
                                })

                            }
                        }
                    })
                });
            }
        })
    });

        /**
     * form 表单验证
     */
    function formVerify() {
        layui.form.verify({
            username: function (value, item) { //value：表单的值、item：表单的DOM对象
                    if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                        return '用户名不能有特殊字符';
                    }
                    if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                        return '用户名首尾不能出现下划线\'_\'';
                    }
                    if (/^\d+\d+\d$/.test(value)) {
                        return '用户名不能全为数字';
                    }
                }

                //我们既支持上述函数式的方式，也支持下述数组的形式
                //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                ,
            pass: [
                /^[\S]{6,12}$/, '密码必须大于等于6位，且不能出现空格'
            ],
            'double-pass': function (value, item) {
                let pass = $('input[name=password]').val();
                if (value != pass) {
                    return '两次密码输入不正确';
                }
            }
        });
    }

});