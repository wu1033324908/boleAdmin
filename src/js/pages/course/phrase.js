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
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.course.section.list);
        // 初始化添加模块
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        initDeleteModule();

        // 显示表格中缩略图的大图
        $.showResourceInBrowser();

        // 获取阶段select 的数据
        $.getSectionSelectData((res) => {
            // 添加模块
            let $add_wrap = $('#add-module select[name=stage]');
            // 修改模块
            let $modify_wrap = $('#modify-module select[name=stage]');
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

            // 
            let $section_select = $('select[lay-filter=section]');
            stageSelectChange($section_select, id);

        });

        // 移除 成语输入框
        removePhraseInput();

        // 初始化富文本
        // initUeEditor();

        // 上传文件
        initUpload();
    }

    /**
     * 阶段 select 触发 change 事件，ajax请求并改变下级课次 select list
     * @param $select 下级课次 seclet jquery 对象
     * @param stage_id 触发事件的阶段 select 对应的值
     * @param callback ajax请求成功并且课次 select 创建成功的回调函数
     */
    function stageSelectChange($select, stage_id, callback) {
        let $select_wrap = $select;
        $select_wrap.empty().append(`
            <option value="">请选择课次</option>
        `);
        $.ajax({
            url: _HOST.add_rort + _HOST.course.phrase.get_section_by_stage,
            type: 'POST',
            data: {
                courseid: stage_id
            },
            success: function (res) {
                res.Data.forEach((ele, idnex) => {
                    $select_wrap.append(`
                        <option value="${ele.Id}">${ele.CourseDescribe}</option>
                    `);
                });
                layui.form.render();
                callback && callback();
            }
        });
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.course.phrase.list,
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
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改"><i class="fa fa-edit"></i></button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                        
                        `;
                    }
                },
                {
                    title: '阶段',
                    data: 'StageDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '课次',
                    data: 'CourseDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                }, {
                    title: '成语',
                    data: 'Idiom',
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
     * @param {Number} startCount 指定成语的初始计数
     * @param {Function} eventerListener 监听文件上传
     */
    function addPhraseInput($button, $wrap, startCount, eventerListener) {
        // 初始化成语的计数
        let count = startCount || 1;
        // 有此参数，表示为修改模块
        if (startCount) {
            $button.click((e) => {
                $wrap.append(`
                    <div class="layui-form-item">
                        <label class="col col-sm-2 label-control phrase-label">成语${count}</label>
                        <div class="col col-sm-5">
                            <input type="text" data-label="成语${count}" class="layui-input phrase-input" lay-verify="required">
                        </div>
                        <div class="col col-sm-2">
                            <button type="button" class="btn-remove-phrase btn btn-primary">
                                <i class="fa fa-minus"></i>
                            </button>
                        </div>
                        <div class="col col-sm-10 col-offset-2">
                            <div class="upload-wrap">
                                <div id="modify-upload-${count++}">
    
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                // 上传组件id
                let upload_id = $wrap.find('.upload-wrap').last().children().attr('id');
                // 成语名称
                let phrase_label = $wrap.find('.phrase-label').last().text();
                $("#" + upload_id).plupload({
                    multi_selection: false,
                    // General settings
                    runtimes: 'html5,flash,silverlight,html4',
                    url: _HOST.add_rort + _HOST.resource.upload_file,

                    // Specify what files to browse for
                    // filters: [{
                    //         title: "Image files",
                    //         extensions: "jpg,gif,png"
                    //     },
                    //     {
                    //         title: "Zip files",
                    //         extensions: "zip,avi"
                    //     },
                    //     {
                    //         title: '视频文件',
                    //         extensions: 'mp4,avi'
                    //     }
                    // ],

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

                eventerListener && eventerListener({
                    id: upload_id,
                    label: phrase_label
                });
            });
        } else {
            $button.click((e) => {
                $wrap.append(`
                    <div class="layui-form-item">
                        <label class="col col-sm-2 label-control phrase-label">成语${count}</label>
                        <div class="col col-sm-5">
                            <input type="text" data-label="成语${count}" class="layui-input phrase-input" lay-verify="required">
                        </div>
                        <div class="col col-sm-2">
                            <button type="button" class="btn-remove-phrase btn btn-primary">
                                <i class="fa fa-minus"></i>
                            </button>
                        </div>
                        <div class="col col-sm-10 col-offset-2">
                            <div class="upload-wrap">
                                <div id="add-upload-${count++}">
    
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                let upload_id = $wrap.find('.upload-wrap').last().children().attr('id');
                let phrase_label = $wrap.find('.phrase-label').last().text();
                $("#" + upload_id).plupload({
                    multi_selection: false,
                    // General settings
                    runtimes: 'html5,flash,silverlight,html4',
                    url: _HOST.add_rort + _HOST.resource.upload_file,

                    // Specify what files to browse for
                    // filters: [{
                    //         title: "Image files",
                    //         extensions: "jpg,gif,png"
                    //     },
                    //     {
                    //         title: "Zip files",
                    //         extensions: "zip,avi"
                    //     },
                    //     {
                    //         title: '视频文件',
                    //         extensions: 'mp4,avi'
                    //     }
                    // ],

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

                eventerListener && eventerListener({
                    id: upload_id,
                    label: phrase_label
                });

            });

            $button.click();
        }
    }

    /**
     * 移除 成语输入框
     */
    function removePhraseInput() {
        $('form').on('click', '.btn-remove-phrase', (e) => {
            let $this = $(e.currentTarget);

            $this.parents('.layui-form-item').remove();
        });

    }

    /**
     * @description 初始化添加模块
     */
    function initAddModule() {
        /**
         * 函数内部传递的数据
         */
        let fun_data = {
            // 成语和对应的资源，里面的格式：{label_name:{name: 成语名称, resource: 成语资源id}}
            phrase: {}
        };

        // 点击加号按钮，添加 成语输入框和上传资源组件
        addPhraseInput($('#add-module .btn-add-phrase'), $('#add-module .form-append-input'), null, (opt) => {
            // opt包含上传组件id和成语的label
            // 初始化值
            fun_data.phrase[opt.label] = {
                name: '',
                resource: null
            };
            // 上传图片成功的监听事件
            $('#' + opt.id).on('uploaded', function (upload, file) {
                let response = JSON.parse(file.result.response);
                if (response.Result) {
                    fun_data.phrase[opt.label].resource = response.Id;
                }
                console.log(fun_data)
            });
            console.log(fun_data)
        });

        formSubmit(fun_data);

        $('.tool-container').on('click', '.btn-add', () => {
            layui.layer.open({
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

            // 课次select 下拉选择事件
            layui.form.on('select(section)', function (data) {
                console.log(data);
                // selected value
                let id = data.value;
                sendData.courseid = id;
            });

            //监听提交
            layui.form.on('submit(add)', function (data) {
                console.log(data)
                // 遍历所有成语input，将值保存在对应的label_name中
                $('#add-module .phrase-input').each((index, ele) => {
                    let $this = $(ele);
                    fun_data.phrase[$this.data('label')].name = $this.val();
                });

                // 临时数组：label_name对应的成语名称和资源id
                let phrase_name_arr = [];
                let phrase_resource_arr = [];

                // 成语名称和对应的资源id
                for (let i in fun_data.phrase) {
                    phrase_name_arr.push(fun_data.phrase[i].name);
                    phrase_resource_arr.push(fun_data.phrase[i].resource);
                }

                sendData.phrase = phrase_name_arr.slice().join(',');
                sendData.recordingid = phrase_resource_arr.slice();

                console.log(fun_data);
                console.log(sendData)

                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.phrase.add,
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
        /**
         * 函数内部传递的数据
         */
        let fun_data = {
            // 成语和对应的资源，里面的格式：{label_name:{name: 成语名称, resourceid: 成语资源id,resourceurl: 资源url}}
            phrase: {}
        };

        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

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
            sendData.id = fun_data.modify.Id;
            sendData.courseid = fun_data.modify.CourseId;

            // 课次select 下拉选择事件
            layui.form.on('select(section)', function (data) {
                console.log(data);
                // selected value
                let id = data.value;
                sendData.courseid = id;
            });

            //监听提交
            layui.form.on('submit(modify)', function (data) {


                // 遍历所有成语input，将值保存在对应的label_name中
                $('#modify-module .phrase-input').each((index, ele) => {
                    let $this = $(ele);
                    fun_data.phrase[$this.data('label')].name = $this.val();
                });

                // 临时数组：label_name对应的成语名称和资源id
                let phrase_name_arr = [];
                let phrase_resourceid_arr = [];

                // 遍历
                for (let i in fun_data.phrase) {
                    phrase_name_arr.push(fun_data.phrase[i].name);
                    phrase_resourceid_arr.push(fun_data.phrase[i].resourceid);
                }

                sendData.phrase = phrase_name_arr.slice().join(',');
                sendData.recordingid = phrase_resourceid_arr.slice();

                console.log(fun_data)
                console.log(sendData)
                $.ajaxRequestTemplate({
                    url: _HOST.add_rort + _HOST.course.phrase.modify,
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
            // form.find('select[name=stage]').val(fun_data.modify.StageId);

            // form.find('select[name=section]').append(`
            //     <option value="${fun_data.modify.CourseId}">${fun_data.modify.CourseDescribe}</option>
            // `).val(fun_data.modify.CourseId);
            // layui.form.render();

            let $stage_text_box = form.find('.stage-text');
            if ($stage_text_box.children().length === 0) {
                $stage_text_box.append(`
                    <div class="item">
                        ${fun_data.modify.StageDescribe}
                    </div> 
                `);
            }

            let $section_text_box = form.find('.section-text');
            if ($section_text_box.children().length === 0) {
                $section_text_box.append(`
                    <div class="item">
                        ${fun_data.modify.CourseDescribe}
                    </div> 
                `);
            }

            // 临时数组：label_name对应的成语名称,资源id和url
            let phrase_name_arr = [];
            let phrase_resource_id_arr = [];
            let phrase_resource_url_arr = [];

            phrase_name_arr = fun_data.modify.Idiom.split(',');
            phrase_resource_id_arr = fun_data.modify.RecordingId.slice();
            phrase_resource_url_arr = fun_data.modify.RecordingUrl.slice();

            // 存储成语的名称，资源id和url
            // {name: 成语名称, resourceid: 成语资源id,resourceurl: 资源url}}
            phrase_name_arr.forEach((ele, index) => {
                fun_data.phrase['成语' + (index + 1)] = {}

                fun_data.phrase['成语' + (index + 1)]['name'] = phrase_name_arr[index];
                fun_data.phrase['成语' + (index + 1)]['resourceid'] = phrase_resource_id_arr[index];
                fun_data.phrase['成语' + (index + 1)]['resourceurl'] = phrase_resource_url_arr[index];

            });
            console.log(fun_data.phrase);

            // 成语input wrap
            let $wrap = $('#modify-module .form-append-input');
            $wrap.empty();
            let count = 1;
            for (let i in fun_data.phrase) {
                $wrap.append(`
                        <div class="layui-form-item">
                            <label class="col col-sm-2 label-control phrase-label">${i}</label>
                            <div class="col col-sm-5">
                                <input type="text" data-label="${i}" value="${fun_data.phrase[i].name}" class="layui-input phrase-input" lay-verify="required">
                            </div>
                            <div class="col col-sm-5">
                                <button type="button" class="btn-remove-phrase btn btn-primary">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <div class="layui-form-item">
                                <label class="col col-sm-2 label-control" style="line-height: 58px;">${i}原资源</label>
                                <div class="col col-sm-10">
                                    <div class="plaint-text-box plaint-text-box${count}">
                                    </div>
                                </div>
                            </div>
                            <div class="col col-sm-10 col-offset-2">
                                <div class="upload-wrap">
                                    <div id="modify-upload-${count++}">

                                    </div>
                                </div>
                            </div>
                        </div>
                    `);


                let $plaint_text_box = $wrap.find('.plaint-text-box' + (count - 1));
                $plaint_text_box.append(`
                        <div class="item">
                            <span class="origin-link audio-link show_resource_in_browser" title="${fun_data.phrase[i].resourceurl}" data-src="${fun_data.phrase[i].resourceurl}">${fun_data.phrase[i].resourceurl}</span>
                        </div> 
                    `);


                let upload_id = $wrap.find('.upload-wrap').last().children().attr('id');
                let phrase_label = $wrap.find('.phrase-label').last().text();
                $("#" + upload_id).plupload({
                    multi_selection: false,
                    // General settings
                    runtimes: 'html5,flash,silverlight,html4',
                    url: _HOST.add_rort + _HOST.resource.upload_file,

                    // Specify what files to browse for
                    // filters: [{
                    //         title: "Image files",
                    //         extensions: "jpg,gif,png"
                    //     },
                    //     {
                    //         title: "Zip files",
                    //         extensions: "zip,avi"
                    //     },
                    //     {
                    //         title: '视频文件',
                    //         extensions: 'mp4,avi'
                    //     }
                    // ],

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

                // 上传图片成功的监听事件，修改对应成语的资源id
                $('#' + upload_id).on('uploaded', function (upload, file) {
                    let response = JSON.parse(file.result.response);
                    if (response.Result) {
                        fun_data.phrase[phrase_label].resourceid = response.Id;
                    }
                    console.log(fun_data)
                });
            }
            // 点击加号按钮，添加 成语输入框
            addPhraseInput($('#modify-module .btn-add-phrase'), $('#modify-module .form-append-input'), phrase_name_arr.length + 1, (opt) => {
                // opt包含上传组件id和成语的label
                // 初始化值
                fun_data.phrase[opt.label] = {
                    name: '',
                    resourceid: null
                };
                // 上传图片成功的监听事件
                $('#' + opt.id).on('uploaded', function (upload, file) {
                    let response = JSON.parse(file.result.response);
                    if (response.Result) {
                        fun_data.phrase[opt.label].resourceid = response.Id;
                    }
                    console.log(fun_data)
                });
                console.log(fun_data);
            });

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
                        url: _HOST.add_rort + _HOST.course.phrase.delete,
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