/*! functions.js */

/**
 * 开发者添加用户页面
 *
 */

$(function() {
    var url = 'http://bigfk.gemini-galaxy.com/Task/GetTimeline';

    var vm = new Vue({
        el: '#demo1',
        data: {
            result: null
        }
    });

    $.ajax({
        url: url,
        type: 'POST',
        success: function(res) {
            console.log(res)
            vm.result = res.Data;
        }
    });


});