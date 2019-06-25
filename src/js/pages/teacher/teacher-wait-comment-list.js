/**
 * @description 教师还没有批改过的作文列表
 * @author zhengshenli
 * @createAt 2018-03-12
 */

 
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {

    console.log(layui.form)

    /**
     * @description datatable 对象
     */
    var _TABLE;


    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化表格
        initTable();
        // 初始化表格搜索
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.teacher.not_commented_list);
        // 初始化添加模块
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();
        // 初始化富文本
        // initUeEditor();

        $.showResourceInBrowser();

        // 上传文件
        initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            order: [[ 2, 'asc' ]],
            ajax: {
                url: _HOST.add_rort + _HOST.teacher.not_commented_list,
                type: 'POST',
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, {
                    title: '操作',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'btn-td show-detail-td',
                    render: (data, type, row, meta) => {
                        return `
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改">详情</button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>
                        
                        `;
                    }
                },
                {
                    title: '手机号',
                    data: 'Phone',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '昵称',
                    data: 'NickName',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '无';
                        if(data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '阶段名称',
                    data: 'StageDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '课次名称',
                    data: 'CouresDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '创建时间',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                }
            ],
            drawCallback: function (settings) {
                var api = this.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate(this);
            }
        });
        // datatables 的样式设置
        $.datatablesStyle();

    }

    /**
     * 添加 成语输入框
     * @param {Object} $button 触发事件的对象
     * @param {Object} $wrap 动态生成对象的wrap
     */
    function addPhraseInput($button, $wrap) {
        let input_count = 2;
        $button.on('click', (e) => {
            $wrap.append(`
                <div class="layui-form-item">
                    <label class="col col-sm-2 label-control">成语${input_count}</label>
                    <div class="col col-sm-5">
                        <input type="text" name="phrase-${input_count++}" class="layui-input" lay-verify="required" autocomplete="off">
                    </div>
                </div>
            `);
        });
    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 函数内部传递的数据
        let fun_data = {};
        $('.tool-container').on('click', '.btn-add', () => {
            layui.layer.open({
                zIndex: 100,
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    layui.layer.full(index);

                    formSubmit(fun_data);
                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};

            //监听提交
            layui.form.on('submit(add)', function (data) {

                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }
                console.log(sendData)
                // $.ajaxRequestTemplate({
                //     url: _HOST.add_rort + _HOST.course.stage.add,
                //     data: sendData
                // })


                return false;
            });
        }


    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        var fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            console.log(fun_data)
            
            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#modify-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    layui.layer.full(index);

                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });


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
                sendData.id = fun_data.modify.Id;
                console.log(sendData);

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.stage.modify,
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
            let form = $('#modify-module form');
            // 课程名称
            form.find('input[name=Phone]').val(fun_data.modify.Phone || '');
            // 排序值
            form.find('input[name=NickName]').val(fun_data.modify.NickName || '');
            form.find('input[name=StageDescribe]').val(fun_data.modify.StageDescribe || '');
            form.find('input[name=CouresDescribe]').val(fun_data.modify.CouresDescribe || '');
            var $composition_img_box = form.find('.composition-img-box');
            if($composition_img_box.children().length === 0) {
                fun_data.modify.ArticleThumbnailUrl.forEach((ele, index) => {
                    $composition_img_box.append(`
                        <div class="item">
                            <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.ArticleUrl[index]}" title="${fun_data.modify.ArticleUrl[index]}" alt="">
                        </div>
                    `)
                });
            }
            var $comments_img_box = form.find('.comments-img-box');
            if($comments_img_box.children().length === 0) {
                fun_data.modify.CorrectThumbnailUrl.forEach((ele, index) => {
                    $comments_img_box.append(`
                        <div class="item">
                            <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.CorrectUrl[index]}" title="${fun_data.modify.CorrectUrl[index]}" alt="">
                        </div>
                    `)
                });
            }
        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            console.log($this.data('modify'))
            let Id = $this.data('modify').Id;
            layui.layer.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.course.stage.delete,
                        data: {
                            Id: Id
                        },
                        successMsg: '删除成功'
                    })
                }
            })
        });
    }

    /**
     * @description 初始化富文本
     */
    function initUeEditor() {
        var editor1 = $('#editor').CustomUeEditor({
            button: {
                chooseImage: {
                    ajax: {
                        url: _GLOBAL.adminRoot + 'assets/imageList.json',
                        type: 'GET',
                        async: false
                    },
                    className: 'btn btn-primary'
                },
                uploadImage: false
            }
        })
    }

    /**
     * @description 上传文件
     */
    function initUpload() {

        // 图片上传插件
        var uploader = $("#add-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                },
                {
                    title: "Zip files",
                    extensions: "zip,avi"
                },
                {
                    title: '视频文件',
                    extensions: 'mp4,avi'
                }
            ],

            // Rename files by clicking on their titles
            rename: true,

            // Sort files
            sortable: true,

            // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
            dragdrop: true,

            // Views to activate
            views: {
                list: true,
                thumbs: true, // Show thumbs
                active: 'thumbs'
            }
        });
        // 图片上传插件
        var uploader = $("#modify-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                },
                {
                    title: "Zip files",
                    extensions: "zip,avi"
                },
                {
                    title: '视频文件',
                    extensions: 'mp4,avi'
                }
            ],

            // Rename files by clicking on their titles
            rename: true,

            // Sort files
            sortable: true,

            // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
            dragdrop: true,

            // Views to activate
            views: {
                list: true,
                thumbs: true, // Show thumbs
                active: 'thumbs'
            }
        });
    }
});