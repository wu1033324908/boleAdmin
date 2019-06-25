/**
 * @description 课程中的语音提示管理
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
        // 初始化表格
        initTable();
        // 初始化表格搜索
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.course.record.list);
        // 初始化添加模块
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();

        // 将的资源（图片，音频，视频）在浏览器中显示
        $.showResourceInBrowser();

        // 获取阶段select 的数据
        $.getSectionSelectData((res) => {
            // 添加模块
            let $add_wrap = $('#add-module select[lay-filter=stage]');
            // 修改模块
            let $modify_wrap = $('#modify-module select[lay-filter=stage]');

            // Id 是阶段的id
            res.Data.forEach((ele, idnex) => {
                $add_wrap.append(`
                    <option value="${ele.Id}">${ele.Describe}</option>
                `);
                $modify_wrap.append(`
                    <option value="${ele.Id}">${ele.Describe}</option>
                `);
            });
            layui.form.render('select');
        });

        // 阶段select 下拉选择事件
        layui.form.on('select(stage)', function (data) {
            console.log(data);
            // selected value
            let id = data.value;

            $.stageSelectChange(id);

        });
        // 初始化富文本
        // initUeEditor();

        // 上传文件
        initUpload();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.course.record.list,
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
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改">修改</button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>
                        
                        `;
                    }
                },
                {
                    title: '阶段名称',
                    data: 'StageDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '课次名称',
                    data: 'CourseDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '录音资源',
                    data: 'CourseDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详情">详情</button>`;
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
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 函数内部传递的数据
        let fun_data = {};

        $('#add-record1-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record1'] = response.Id;
            }
        });
        $('#add-record2-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record2'] = response.Id;
            }
        });
        $('#add-record3-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record3'] = response.Id;
            }
        });
        $('#add-record4-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record4'] = response.Id;
            }
        });
        $('#add-record5-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record5'] = response.Id;
            }
        });
        $('#add-record6-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record6'] = response.Id;
            }
        });
        $('#add-record7-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record7'] = response.Id;
            }
        });
        $('.tool-container').on('click', '.btn-add', () => {

            formSubmit(fun_data);

            layui.layer.open({
                zIndex: 100,
                type: 1,
                title: '添加',
                content: $('#add-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    layui.layer.full(index);
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
                    if (i.indexOf('section') > -1) {
                        sendData.courseid = data.field[i];
                    }
                }
                sendData.frontclassid = fun_data.record1;
                sendData.phrasecardid = fun_data.record2;
                sendData.phrasethiefid = fun_data.record3;
                sendData.puzzleid = fun_data.record4;
                sendData.stimulateid = fun_data.record5;
                sendData.articlelront = fun_data.record6;
                sendData.articlelater = fun_data.record7;

                console.log(sendData)
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.record.add,
                    data: sendData
                })

                return false;
            });
        }


    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        var fun_data = {};

        $('#modify-record1-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record1'] = response.Id;
            }
        });
        $('#modify-record2-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record2'] = response.Id;
            }
        });
        $('#modify-record3-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record3'] = response.Id;
            }
        });
        $('#modify-record4-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record4'] = response.Id;
            }
        });
        $('#modify-record5-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record5'] = response.Id;
            }
        });
        $('#modify-record5-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record6'] = response.Id;
            }
        });
        $('#modify-record5-uploader').on('uploaded', function (upload, file) {
            let response = JSON.parse(file.result.response);
            if (response.Result) {
                fun_data['record7'] = response.Id;
            }
        });

        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            fun_data.record1 = fun_data.modify.FrontClassId;
            fun_data.record2 = fun_data.modify.PhraseCardId;
            fun_data.record3 = fun_data.modify.PhraseThiefId;
            fun_data.record4 = fun_data.modify.PuzzleId;
            fun_data.record5 = fun_data.modify.StimulateId;
            fun_data.record6 = fun_data.modify.ArticleFrontId;
            fun_data.record7 = fun_data.modify.ArticleLaterId;
            console.log(fun_data)

            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                zIndex: 100,
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
            let sendData = {
                id: fun_data.modify.Id,
                courseid: fun_data.modify.CourseId
            };

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                for (let i in data.field) {
                    if (i.indexOf('section') > -1) {
                        sendData.courseid = data.field[i];
                    }
                }

                sendData.frontclassid = fun_data.record1;
                sendData.phrasecardid = fun_data.record2;
                sendData.phrasethiefid = fun_data.record3;
                sendData.puzzleid = fun_data.record4;
                sendData.stimulateid = fun_data.record5;
                sendData.articlelront = fun_data.record6;
                sendData.articlelater = fun_data.record7;

                console.log(sendData)
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.record.modify,
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

            // 阶段的默认值
            form.find('select[name=stage]').val(fun_data.modify.StageId);

            // 课程阶段select 下拉选择事件触发后的处理
            $.stageSelectChange(fun_data.modify.StageId, () => {
                // ajax 请求可能会在这段代码之后执行，所以需要在ajax请求结束后执行
                form.find('select[name=section]').val(fun_data.modify.CourseId);
                layui.form.render();
            });

            // 课前规范
            form.find('.origin-link.record-link1').text(fun_data.modify.FrontClassUrl);
            form.find('.origin-link.record-link1').attr('data-src', fun_data.modify.FrontClassUrl);
            form.find('.origin-link.record-link1').attr('title', fun_data.modify.FrontClassUrl);
            // 成语闪卡
            form.find('.origin-link.record-link2').text(fun_data.modify.PhraseCardUrl);
            form.find('.origin-link.record-link2').attr('data-src', fun_data.modify.PhraseCardUrl);
            form.find('.origin-link.record-link2').attr('title', fun_data.modify.PhraseCardUrl);
            // 成语抓小偷
            form.find('.origin-link.record-link3').text(fun_data.modify.PhraseThiefUrl);
            form.find('.origin-link.record-link3').attr('data-src', fun_data.modify.PhraseThiefUrl);
            form.find('.origin-link.record-link3').attr('title', fun_data.modify.PhraseThiefUrl);
            // 拼图
            form.find('.origin-link.record-link4').text(fun_data.modify.PuzzleUrl);
            form.find('.origin-link.record-link4').attr('data-src', fun_data.modify.PuzzleUrl);
            form.find('.origin-link.record-link4').attr('title', fun_data.modify.PuzzleUrl);
            // 拼图激励
            form.find('.origin-link.record-link5').text(fun_data.modify.Stimulate);
            form.find('.origin-link.record-link5').attr('data-src', fun_data.modify.Stimulate);
            form.find('.origin-link.record-link5').attr('title', fun_data.modify.Stimulate);
            // 写作
            form.find('.origin-link.record-link6').text(fun_data.modify.ArticleFrontUrl);
            form.find('.origin-link.record-link6').attr('data-src', fun_data.modify.ArticleFrontUrl);
            form.find('.origin-link.record-link6').attr('title', fun_data.modify.ArticleFrontUrl);
            // 课程结束
            form.find('.origin-link.record-link7').text(fun_data.modify.ArticleLaterUrl);
            form.find('.origin-link.record-link7').attr('data-src', fun_data.modify.ArticleLaterUrl);
            form.find('.origin-link.record-link7').attr('title', fun_data.modify.ArticleLaterUrl);

            layui.form.render();
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
                        url: _HOST.add_rort + _HOST.course.record.delete,
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

        // 课前规范
        var uploader = $("#add-record1-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 成语闪卡
        var uploader = $("#add-record2-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 成语抓小偷
        var uploader = $("#add-record3-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 拼图
        var uploader = $("#add-record4-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 拼图激励
        var uploader = $("#add-record5-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 写作
        var uploader = $("#add-record6-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 课程结束
        var uploader = $("#add-record7-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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


        // 课前规范
        var uploader = $("#modify-record1-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 成语闪卡
        var uploader = $("#modify-record2-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 成语抓小偷
        var uploader = $("#modify-record3-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 拼图
        var uploader = $("#modify-record4-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 拼图激励
        var uploader = $("#modify-record5-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 写作
        var uploader = $("#modify-record6-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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
        // 结束课程
        var uploader = $("#modify-record7-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            url: _HOST.add_rort + _HOST.resource.upload_file,

            // Specify what files to browse for
            filters: [],

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