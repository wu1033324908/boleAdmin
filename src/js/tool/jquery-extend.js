var _HOST = require('tool/host');
$.fn.extend({
    /**
     * time: 2016-12-29
     * 点击增加信息按钮,替换content-wrapper模块，并为此模块添加回调函数和返回按钮
     * addInfoUrl: 点击添加信息按钮要替换的模块
     * callback: 加载添加信息模块后的回调函数
     *
     * $(".add-info").loadAddInfoForm("*.html #div", function() {console.log("回调函数")});
     */
    'loadAddInfoForm': function (addInfoUrl, callback) {
        this.click(function () {
            //跳转模块
            $('.content-wrapper').load(addInfoUrl, function () {
                //如果有回调函数就执行
                if (callback) {
                    callback();
                }
            });
        });
    },
    /**
     *          * time: 2016-12-29
     * 点击增加信息按钮,替换content-wrapper模块，并为此模块添加回调函数和返回按钮
     * addInfoUrl: 点击添加信息按钮要替换的模块
     * callback: 加载添加信息模块后的回调函数
     *
     * $(".add-info").loadAddInfoForm("*.html #div", function() {console.log("回调函数")});
     */
    'loadModifyInfoForm': function (addInfoUrl, data, callback) {
        //跳转模块
        $('.content-wrapper').load(addInfoUrl, function () {
            //如果有回调函数就执行
            if (callback) {
                var result = null;
                if (data) {
                    if (data.IDcardPhoto && data.IDcardPhoto != 'null') {
                        result = {
                            IDcardPhoto: data.IDcardPhoto,
                            headPhoto: data.headPhoto
                        }
                    } else if (data.photo && data.photo != 'null') {
                        result = data.photo;
                    } else if (data.groupPhoto && data.groupPhoto != 'null') {
                        result = data.groupPhoto;
                    } else if (data.headPhoto && data.headPhoto != 'null') {
                        result = data.headPhoto;
                    }
                }
                callback(result);
            }

        });
    },
    /**
     * time: 2016-12-29
     * 添加信息页面的返回按钮事件，返回列表信息界面
     * backBtnUrl: 添加信息模块的返回按钮
     *
     * $(".back-btn").backBtnClickEvent("*.html", function() {console.log("回调函数")});
     */
    'backBtnClickEvent': function (backBtnUrl, callback) {
        return this.click(function () {
            location.href = backBtnUrl;
            //如果有回调函数就执行
            if (callback) {
                callback();
            }
        });
    },
    /**
     * time: 2017-01-02
     * 添加信息表单按钮的切换
     * obj: 要显示隐藏的表单内容
     *
     * $(".form-tab-btns .btn").formTabsChange(".form-tab");
     */
    'formTabsChange': function (obj) {
        return this.each(function (index) {
            $(this).click(function () {
                obj.eq(index).addClass('show').removeClass('hidden');
                obj.eq(index).siblings().addClass('hidden').removeClass('show');
            });
        });
    },
    /**
     * 移除table 的border-bottom 样式
     * time： 2017-01-06
     *
     * $('#example2').removeTableFooterBorder();
     */
    'removeTableFooterBorder': function () {
        return this.each(function () {
            $(this).removeClass('no-footer');
            $(this).parent('.dataTables_scrollBody').addClass('no-border');
            $('.dataTables_wrapper .dataTables_processing').css('z-index', '1');
            $('.dataTables_wrapper .dataTables_processing').css('height', '60px');
        })
    },
    /**
     * 点击搜索按钮，过滤表格数据
     * @param {Object} table            datatables对象
     * @param {String} searchUrl        带有搜索条件的请求url 
     * @param {String} noSearchUrl      没有搜索条件的请求url 
     * @param {Boolean} hasDay          日期格式是否有day，如2000-02是没有带day的格式
     */
    'clickSearchBtn': function (table, searchUrl, noSearchUrl, hasDay) {
        /*
         * 以下参数都能为空
         * 
         * IsSearchLike： 是否模糊搜索，ture为精准搜索
         * SearchRecordState： 
         * 收款记录中审核通过的记录状态记为1，默认不传或传空是搜索所有收款记录
         * 待审核 = 0,
         * 正常 = 1,
         * 审核未通过 = 2,
         * 主动撤回 = 3,
         * 出纳撤回 = 4,
         * 
         * SearchBegin: 开始搜索时间
         * SearchEnd： 结束搜索时间
         * SearchKey：搜索条件
         * SearchValue：搜索条件的值
         * 
         */
        var defaultSearchObj = {
            "IsSearchLike": false,
            "SearchBegin": "",
            "SearchEnd": "",
            "SearchKey": "",
            "SearchValue": ""
        };

        var multipleSearchObj = []; //多重搜索内容


        return this.click(function () {
            var singleSearchObj = $.extend(true, {}, defaultSearchObj); //单次搜索内容
            var sendUrl = ''; //请求的url

            //数据处理中时显示提示框
            // var dialog = $.createBXDialog();

            $('body').removeClass('no-padding-right');

            var $form = $('.table-search-container form');

            var selectValue = $form.find('select[name=searchSelect]').val(); //搜索select的值
            var inputValue = $form.find('input[name=searchValue]').val().replace(/\s/g, ''); //搜索input的值
            var searchBeginForDay = $form.find('input[name=startTimeForDay]').val(); //开始时间
            var searchEndForDay = $form.find('input[name=endTimeForDay]').val(); //结束时间
            var searchBeginNotDay = $form.find('input[name=startTimeNotDay]').val(); //开始时间
            var searchEndNotDay = $form.find('input[name=endTimeNotDay]').val(); //结束时间
            var searchRecordState = $form.find('select[name=SearchRecordState]').val(); //审核状态码
            var isSearchLike = $form.find('input[name=isSearchLike]').is(':checked'); //是否精准搜索
            var isSearchInResult = $form.find('input[name=searchInResult]').is(':checked'); //是否在结果中搜索

            var searchStr = ''; //搜索的拼接URL
            var searchTimeStr = ''; //搜索时间的条件
            var searchStateStr = ''; //搜索状态的条件，收款记录中审核通过的记录
            var isSearchLikeStr = ''; //精准搜索的条件

            // 多重搜索
            if (isSearchInResult) {
                // 所有能成为searchValue 的wrap
                var $change_box = $('.table-search-container .change-box');

                singleSearchObj.SearchKey = selectValue;
                $change_box.each(function (index, ele) {
                    var $this = $(ele);
                    // 设置显示的元素的值为 搜索值
                    if ($this.css('display') !== 'none') {
                        if ($this.hasClass('datetime-box')) {
                            singleSearchObj.SearchBegin = $('#start-datetime').val() || '2000-01-01';
                            singleSearchObj.SearchEnd = $('#end-datetime').val() || '2222-11-11';
                        } else {
                            singleSearchObj.SearchValue = $this.children().val();
                        }
                        return false;
                    }

                });

                //精确搜索为true,默认不传或传空是模糊搜索
                if (!isSearchLike) {
                    singleSearchObj.IsSearchLike = true;
                }

                multipleSearchObj.push(singleSearchObj); //多重搜索的数组
                console.log(multipleSearchObj);
                console.log(JSON.stringify(multipleSearchObj));

                //重新加载表格数据的url
                var reloadStr = searchUrl + '?sms=' + JSON.stringify(multipleSearchObj);

                table.api().ajax.url(reloadStr).load();
            } else {
                // 所有能成为searchValue 的wrap
                var $change_box = $('.table-search-container .change-box');

                singleSearchObj.SearchKey = selectValue;
                $change_box.each(function (index, ele) {
                    var $this = $(ele);
                    // 设置显示的元素的值为 搜索值
                    if ($this.css('display') !== 'none') {
                        if ($this.hasClass('datetime-box')) {
                            singleSearchObj.SearchBegin = $('#start-datetime').val() || '2000-01-01';
                            singleSearchObj.SearchEnd = $('#end-datetime').val() || '2222-11-11';
                        } else {
                            singleSearchObj.SearchValue = $this.children().val();
                        }
                        return false;
                    }

                });

                /*
                 * 单次搜索
                 */

                /*
                 * 精确搜索为true,默认不传或传空是模糊搜索
                 */
                if (!isSearchLike) {
                    singleSearchObj.IsSearchLike = true;
                }

                multipleSearchObj = [];
                multipleSearchObj.push(singleSearchObj);
                console.log(multipleSearchObj);

                //重新加载表格数据的url
                var reloadStr = searchUrl + '?sms=' + JSON.stringify(multipleSearchObj);
                console.log(table.api())
                table.api().ajax.url(reloadStr).load();
            }
        });
    },
    /**
     * 搜索input中输入搜索信息结束后，按回车键触发搜索按钮事件
     * @param {Object} $searchBtn 搜索按钮的jQuery对象
     */
    'pressEnterAfterSearchInput': function ($searchBtn) {
        return this.on('keypress', function (e) {
            if (e.keyCode == 13) {
                //防止实现的逻辑出现阻塞，导致keypress（会被阻塞）和onsubmit（不影响）异步
                setTimeout(function () {
                    $searchBtn.click();
                }, 0);
                return false; //阻止默认事件
            }
        });
    }
});
$.extend({
    /**
     * 为table添加导出按钮，适用datatable v.1.10以上的版本
     * time: 2016-12-30
     * @param {Object}   table: $("#table").DataTable()生成的对象，不是jq对象
     * @param {Object} #buttons 容纳button的容器
     *
     * var buttons = $.addExportBtnForTable(table);
     */
    'addExportBtnForTable': function (table) {
        return new $.fn.dataTable.Buttons(table, {
            buttons: [{
                    extend: 'excel',
                    text: '导出excel',
                    customizeData: function (obj) {
                        console.log(obj);
                        var header = obj.header;
                        var body = obj.body;
                        for (var i in body) {
                            for (var j in header) {
                                if (header[j] == '身份证' || header[j] == '家长电话' || header[j] == '电话') {
                                    body[i][j] = "'" + body[i][j];
                                }
                            }
                        }
                        console.log(obj.body);
                    }
                },
                {
                    extend: 'csv',
                    text: '导出csv',
                    charset: 'utf-8',
                    bom: true
                },
                {
                    extend: 'copy',
                    text: '复制'
                },
                {
                    extend: 'print',
                    text: '打印'
                }
            ]
        }).container().appendTo($('#buttons'));
    },
    /**
     * 点击发布或回收站按钮时加载新的数据填充表格
     * time: 2017-01-04
     * @param {Number} index        发布或回收按钮的jq对象下标
     * @param {Object} table        要重新加载数据的table
     * @param {String} publishUrl   发布所对应的数据源url
     * @param {String} removeUrl    回收所对应的数据源的url
     *
     * $.reloadTableData(index, table, "/backassets/json/test.json", "/backassets/json/aaa.json");
     */
    'reloadTableData': function (index, table, publishUrl, removeUrl) {
        if (index === 0) {
            table.ajax.url(publishUrl).load();
        } else {
            if (removeUrl) {
                table.ajax.url(removeUrl).load();
            }
        }
    },
    /**
     * 删除表格中的单条数据
     * tiem: 2017-01-06
     * @param {Object} table        要删除数据的表格对象，不是jq对象，datatalbe特有的对象
     * @param {Number} index        当前数据的id
     * @param {String} deleteurl    请求url
     *
     * $.deleteTableData(table, index, Host.v + "taskpoint/delete/");
     */
    'deleteTableData': function (table, deleteurl, sendData) {
        bootbox.confirm('确定删除？', function (result) {
            if (result) {
                //定义对话框
                var dialog = bootbox.dialog({
                    size: 'small',
                    message: '<p><i class="fa fa-spin fa-spinner"></i> 删除中，请稍候...</p>'
                });

                $.ajax({
                    url: deleteurl,
                    type: 'POST',
                    data: sendData,
                    complete: function () {
                        dialog.init(function () {
                            dialog.modal('hide');
                        });
                    },
                    success: function (res) {
                        //删除成功
                        if (res.result) {
                            bootbox.alert({
                                buttons: {
                                    ok: {
                                        label: '确定',
                                        className: 'btn-primary'
                                    }
                                },
                                size: 'small',
                                message: '删除成功！',
                                callback: function () {
                                    //重新加载表格数据
                                    table.ajax.reload();
                                }
                            });
                        } else { //删除失败
                            bootbox.alert({
                                buttons: {
                                    ok: {
                                        label: '确定',
                                        className: 'btn-primary'
                                    }
                                },
                                size: 'small',
                                message: res.desc,
                                callback: function () {}
                            });
                        }
                    },
                    error: function (res) {
                        bootbox.alert({
                            buttons: {
                                ok: {
                                    label: '确定',
                                    className: 'btn-primary'
                                }
                            },
                            size: 'small',
                            message: '请求失败，请稍候再试！',
                            callback: function () {}
                        });
                    }
                })
            }
        });
    },
    /**
     * @description 初始化flatpicker日期选择器插件
     */
    'initFlatpicker': function () {
        $('.flatpicker').flatpickr({
            //设置语言
            locale: 'zh',
            dateFormat: 'Y-m-d',
            disableMobile: true,
            onMonthChange: function () {
                //                  console.log(this._selectedDateObj.toLocaleDateString());
            }
        });
    },
    /**
     * @description 初始化flatpicker日期选择器插件，没有到天
     */
    'initFlatpickerNotDay': function () {
        $('.flatpicker').flatpickr({
            //设置语言
            locale: 'zh',
            dateFormat: 'Y-m',
            disableMobile: true,
            onMonthChange: function () {
                //                  console.log(this._selectedDateObj.toLocaleDateString());
            }
        });
    },
    /**
     * @description 显示提示框，如果有dialog，则执行dialog的方法隐藏其自身
     * @param(String) msg 要显示的字符串
     * @param(Object) dialog 要隐藏的dialog对象
     */
    'showBXAlert': function (msg, dialog, done) {
        var str = msg || '这是一个提示框!';
        bootbox.alert({
            buttons: {
                ok: {
                    label: '确定',
                    className: 'btn-primary'
                }
            },
            size: 'small',
            message: str,
            callback: function () {
                if (dialog) {
                    dialog.init(function () {
                        dialog.modal('hide');
                    });
                }
                if (done) {
                    done();
                }
            }
        });
    },
    /**
     * @description 创建一个bootbox.dialog对象，显示数据处理中
     */
    'createBXDialog': function () {
        return bootbox.dialog({
            size: 'small',
            message: '<p><i class="fa fa-spin fa-spinner"></i> 数据处理中，请稍候...</p>'
        });
    },
    /**
     * @description ajax请求的封装
     * @author zhengshenli
     * @createAt 2017-12-26、
     * @updateBy
     * @updateAt 2018-01-11
     * 
     * @param {String} url  请求url
     * @param {String} type  请求的类型 'GET|POST'
     * @param {Object} data  发送到服务器的数据
     * @param {String} successMsg  请求成功的提示信息
     * @param {Function} callback  请求成功的回调函数
     */
    'ajaxRequestTemplate': function (url, type, data, async, successMsg, callback) {

        var option = {
            url: '',
            type: 'POST',
            data: null,
            async: true,
            successMsg: '操作成功!',
            success: null
        }

        // 如果第一个参数是object类型
        if (typeof arguments[0] === 'object' && arguments[0].constructor === Object) {
            $.extend(true, option, arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            option.url = url;
            option.type = type;
            option.data = data;
            option.async = async;
            option.successMsg = successMsg;
            option.success = callback;
        } else {
            console.error('$.ajaxRequestTemplate()方法参数错误，请在 jquery-extend.js文件中查看使用方法');
            return;
        }

        // 如果最后一个参数是方法，则设置为回调函数
        if (typeof arguments[arguments.length - 1] === 'function') {
            option.success = arguments[arguments.length - 1];
        }

        $.ajax({
            url: option.url, //请求url
            type: option.type, //请求类型
            data: option.data, //发送到服务器的数据
            async: option.async, //是否异步
            success: (res) => { //请求成功
                console.log(res);
                if (res.Result) {
                    layui.layer.open({
                        type: 0,
                        title: '结果',
                        offset: '20%',
                        content: option.successMsg,
                        btn: ['确认'],
                        yes: (index, layero) => {
                            location.reload();
                        },
                        closeBtn: 2
                    });
                } else {
                    layui.layer.open({
                        type: 0,
                        title: '结果',
                        offset: '20%',
                        content: res.Desc || '操作失败',
                        btn: ['确认'],
                        yes: (index, layero) => {
                            layui.layer.close(index);
                        },
                        closeBtn: 2
                    });
                }
            },
            error: (res) => {
                layui.layer.open({
                    type: 0,
                    title: '结果',
                    offset: '20%',
                    content: '请求失败，请稍后再试！',
                    btn: ['确认'],
                    yes: (index, layero) => {
                        layui.layer.close(index);
                    },
                    closeBtn: 2
                });
            }
        });
    },
    /**
     * @description 获取详细的详细用于修改
     * @param {String} url  请求数据的url
     * @param {Object} sendData  请求数据的url
     * @param {Boolean} hasBackBtn  获取数据失败，是否点击返回按钮
     * @param {Object} dialog  请求数据前是否有dialog
     */
    'getDetailInfoForModify': function (url, sendData, hasBackBtn, dialog) {
        //deferred对象的含义就是"延迟"到未来某个点再执行。
        var defer = $.Deferred();
        $.ajax({
            url: url,
            type: 'POST',
            data: sendData,
            success: function (res) {
                if (res.result) {
                    defer.resolve(res);
                } else {
                    bootbox.alert({
                        buttons: {
                            ok: {
                                label: '确定',
                                className: 'btn-primary'
                            }
                        },
                        size: 'small',
                        message: res.desc,
                        callback: function () {
                            if (hasBackBtn) { //请求失败点击返回按钮
                                $(".back-btn").click();
                            } else if (dialog) { //请求失败，不点击返回按钮，隐藏dialog
                                dialog.init(function () {
                                    dialog.modal('hide');
                                });
                            }
                        }
                    });
                }
            },
            error: function (err) {
                bootbox.alert({
                    buttons: {
                        ok: {
                            label: '确定',
                            className: 'btn-primary'
                        }
                    },
                    size: 'small',
                    message: '请求失败，请稍候再试！',
                    callback: function () {
                        if (hasBackBtn) { //请求失败点击返回按钮
                            $(".back-btn").click();
                        } else if (dialog) { //请求失败，不点击返回按钮，隐藏dialog
                            dialog.init(function () {
                                dialog.modal('hide');
                            });
                        }
                    }
                });
            }
        });
        return defer.promise();
    },
    /**
     * @description layui layer 组件的默认参数
     * @aurhor zhenghsenli
     * @createAt 2018-01-11
     */
    layerDefaultOption: function () {
        var opt = {
            zIndex: 100,
            type: 1,
            title: '添加',
            content: $('#add-module'),
            maxmin: true,
            anim: 2,
            success: (layero, index) => {
                _LAYER.full(index)
            },
            cancel: (index, layero) => {
                $('.layer-content-molude').css('display', 'none');
                _LAYER.close(index);
            }
        }

        return opt;
    },
    /**
     * @description datatables的跳页操作
     */
    datatablesSkipPagigate: function (table) {
        /**
         * page 中有多个属性：
         * start: 当前页的第一个数据
         * end: 当前页的最后一个数据
         * page: 当前的页码 (实际页码要 +1)，第一页从0开始
         * pages: 总共多少页
         */
        var page = table.api().page.info();
        // console.log(page)
        $('.dataTables_paginate').append(`
        <span class="page-skip-container">
            到第<input type="text" min="1" max="${page.pages}" value="${page.pages === page.page + 1? page.pages: page.page + 2}" class="page-skip-input">页
            <button type="button" class="btn-page-skip btn btn-default">确定</button>
        </span>
        `);
        // 跳页按钮点击
        $('.btn-page-skip').click(function () {
            var index = parseInt($('.page-skip-input').val() - 1);
            if (index < 0) {
                index = 0;
            } else if (index > page.pages - 1) {
                index = page.pages - 1;
            }
            table.api().page(index).draw('page');
        });
        // 跳页输入框回车
        $('.page-skip-input').keydown(function (e) {
            if (e.which === 13) {
                $('.btn-page-skip').click();
            }
            return;
        });
    },
    /**
     * @description datatables 的样式设置,主要是移除`no-footer`类
     */
    datatablesStyle: function () {
        $('.table-container').find('.no-footer').removeClass('no-footer');
    },
    /**
     * 将的资源（图片，音频，视频）在浏览器中显示
     * 触发事件的对象需要带有属性 data-src,值为资源的url
     * @param {String} selector [事件触发对象的jQuery选择器]
     */
    showResourceInBrowser: function (selector, table) {
        var selector = selector || '.show_resource_in_browser';
        $('body').on('click', selector, (e) => {
            let $this = $(e.currentTarget);
            let src_url = $this.data('src');
            window.top.open(src_url);
        });
    },
    /**
     * 获取课程 阶段select 的数据
     * @param {Function} 回调函数
     */
    getSectionSelectData: function (callback) {
        $.ajax({
            url: _HOST.add_rort + _HOST.course.stage.all,
            type: 'POST',
            success: function (res) {
                callback && callback(res);
            }
        });
    },
    /**
     * 课程阶段select 下拉选择事件触发后的处理
     * @param {Number} id 阶段select id
     * @param {Function} callback 回调函数
     */
    stageSelectChange: function (id, callback) {
        let $select_wrap = $('select[lay-filter=section]');
        $select_wrap.empty().append(`
            <option value="">请选择课次</option>
        `);
        $.ajax({
            url: _HOST.add_rort + _HOST.course.section.get_section_by_stage_id,
            type: 'POST',
            data: {
                id: id
            },
            success: function (res) {
                res.Data.forEach((ele, idnex) => {
                    $select_wrap.append(`
                            <option value="${ele.Id}">${ele.ModuleDescribe}</option>
                        `);
                });
                layui.form.render();
                callback && callback();
            }
        });
    },

    /**
     * 初始化layui日期选择器
     */
    initLayuiDate: function () {
        var obj = $('input[data-layuidate=date]');
        obj.each((index, ele) => {
            var id = $(ele).attr('id');
            layui.laydate.render({
                elem: '#' + id
            });

        })
    },
    /**
     * 初始化表格搜索
     * @param table 表格实例对象
     * @param searchUrl 表格请求数据接口
     */
    initSearchTable: function (table, searchUrl) {
        // 初始化日期控件
        $.initLayuiDate();

        var $searchBtn = $('.table-search-container .serach-btn'); //表格的搜索按钮
        var $searchInput = $('.table-search-container input[name=searchValue]'); //搜索input
        var noSearchUrl = searchUrl;
        var _TABLE = table;
        $searchBtn.clickSearchBtn(_TABLE, searchUrl, noSearchUrl, false); //搜索按钮点击事件
        $searchInput.pressEnterAfterSearchInput($searchBtn); //input的搜索获取焦点,按回车键搜索
    },
    /**
     * tatatable 请求失败提示
     * @createAt 2018-03-29
     * 
     * @param type 提示内容的类型 {1|2}
     *  1: 网络请求成功，接口返回请求失败原因
     *  2：网络请求失败
     * @param data 提示数据源，可来自ajax返回的数据
     */
    datatableRequestFailTip: function(type, data) {
        if(type == 1) {
            layui.layer.open({
                type: 0,
                content: data.Desc,
                offset: '20%'
            });
        }else if(type == 2) {
            layui.layer.open({
                type: 0,
                content: '网络请求失败，请重试，或者联系管理员！',
                offset: '20%'
            });
        }
    },
    /**
     * 获取链接参数
     * @param {Object} name 参数名
     */
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


});