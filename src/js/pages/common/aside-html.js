/**
 * @description 课程中的成语管理
 * @author zhengshenli
 * @createAt 2018-03-06
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');

$(function () {

    // 判断iframe中的显示页面是不是最顶层的页面
    // 只有最顶层的窗口才能执行这个请求
    if(self==top) {
        $.ajax({
            url: _HOST.add_rort + _HOST.admin.get_detail_info,
            type: 'POST',
            data: {
                adminid: Base.decode($.GetQueryString('i'))
            },
            async: false,
            success: (res) => {
                if (res.Result && res.Data[0]) {
                    // console.log(res.Data[0].Name)
                    sessionStorage.setItem('user_id', res.Data[0].Id);
                    sessionStorage.setItem('user_tel', res.Data[0].Tel);
                    sessionStorage.setItem('user_type', res.Data[0].Type);
                    sessionStorage.setItem('role_name', JSON.stringify(res.Data[0].Name));
                }
            }
        })
    }

    var $aside = $('#frame-aside');
    var $menu_drop = $aside.children('.menu_dropdown');

    var user_name = sessionStorage.getItem('user_tel') || '';
    var role_name = JSON.parse(sessionStorage.getItem('role_name')) || '';
    var role_id = sessionStorage.getItem('role_id') || '';

    console.log(role_name)
    // admin账号显示所有菜单，其他用户根据角色名称来显示
    if (user_name !== 'admin') {
        $aside.find('dl').each((index, ele) => {
            let $this = $(ele);
            $this.hide();
            for(let i in role_name){
                if ($this.data('title') == role_name[i]) {
                    $this.show();
                }
            }

        });
    }
    // 显示菜单模块
    $menu_drop.css('display', 'block');
});