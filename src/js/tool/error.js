/**
 * @description 项目配置
 */
var _PROJECT_CONFIG = require('../../../projectConfig.js');

window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log(arguments)
    /**
     * @description 错误信息
     */
    var message = {
        projectName: _PROJECT_CONFIG.projectName,   //项目名称
        'Message': msg, // 错误信息
        'URL': location.href + '---' + url, // 错误代码页面链接
        'Line': lineNo, // 错代码行数
        'Agent': window.navigator.userAgent // 客户端的信息
    };

    var substring = "script error";
    if (typeof msg === 'string') {
        message.Message = msg;
    }

    return false;
};