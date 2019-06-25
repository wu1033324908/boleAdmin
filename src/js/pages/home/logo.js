/**
 * @description 首页LOGO
 * @author wujunwei
 * @createAt 2018-04-23
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
        // 表格搜索
        // $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.home.video.list);
        // 初始化添加模块
        initAddModule();
        // 初始化修改模块
        initModifyModule();
        // 删除模块
        // initDeleteModule();
        // 显示表格中缩略图的大图
        // $.showResourceInBrowser();
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
            buttons:[],
            ordering:false,
            lengthChange:false,
            paging:false,
            language:{
                emptyTable:'',
                infoFiltered:'',
                infoEmpty:''
            },
            ajax: {
                url: _HOST.add_rort + _HOST.logo.get,
                type: 'POST',
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [
                {
                    title: '序号',
                    data: 'Id',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '1';
                    }
                },
                {
                    title: 'LOGO图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<img src="${result.replace("!220w"," ")}" alt="" style="height: 100px;width:200px;max-width: 200px;">`;
                    }
                },
                {
                    title: '操作',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'btn-td',
                    render: (data, type, row, meta) => {
                        return `
                            <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改">修改</button>
                        
                        `;
                    }
                }
                // {
                //     title: '描述',
                //     data: 'Description',
                //     className: 'show-detail-td',
                //     render: (data, type, row, meta) => {
                //         var result = '';
                //         if (data) {
                //             result = data;
                //         }
                //         return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                //     }
                // },
                // {
                //     title: '资源',
                //     data: 'VideoURL',
                //     className: 'show-detail-td',
                //     render: (data, type, row, meta) => {
                //         return `<button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详情">详情</button>`;
                //     }
                // },
                // {
                //     title: '创建时间',
                //     data: 'CreatedAt',
                //     className: 'show-detail-td',
                //     render: (data, type, row, meta) => {
                //         return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                //     }
                // }
            ],
            drawCallback: function (settings) {
                // var api = this.api();

                // var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                // 　　
                // api.column(0).nodes().each(function (cell, i) {　　　　
                //     cell.innerHTML = startIndex + i + 1;　　
                // });

                // // 往分页中添加跳页输入框和按钮
                // $.datatablesSkipPagigate(this);
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
        let fun_data = {
            imageId: null
        };

        $('.tool-container').on('click', '.btn-add', () => {

            // logo上传
            $('#add-image-uploader').on('uploaded', function (upload, file) {
                let response = JSON.parse(file.result.response);
                if (response.Result) {
                    fun_data['imageId'] = response.Id;
                    console.log(fun_data)
                }
            });

            // 表单提交
            formSubmit(fun_data);

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
            //监听提交
            layui.form.on('submit(add)', function (data) {
                // console.log(data)

                if (!fun_data.imageId) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传图片文件',
                        offset: '20%',
                        anim: 2,
                        time: 3000
                    });
                } else {

                    let sendData = {};
                    // 资源id
                    sendData.imgid = fun_data.imageId;
                    for (let i in data.field) {
                        sendData[i] = data.field[i];
                    }
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.logo.add,
                        data: sendData
                    })
                }

                return false;
            });
        }
    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        // 函数内部传递的数据
        let fun_data = {
            imageId: null
        };

        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            // 图片上传成功保存id
            $('#modify-image-uploader').on('uploaded', function (upload, file) {
                let response = JSON.parse(file.result.response);
                if (response.Result) {
                    fun_data['imageId'] = response.Id;
                }
            });

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
            let sendData = {};
            sendData.id = fun_data.modify.Id;

            //监听提交
            layui.form.on('submit(modify)', function (data) {
                if (!fun_data.imageId) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传图片文件',
                        offset: '20%',
                        anim: 2,
                        time: 3000
                    });
                } else {
                    // 资源id
                    sendData.imgid = fun_data.imageId;

                    for (let i in data.field) {
                        sendData[i] = data.field[i];
                    }
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.logo.modify,
                        data: sendData
                    })
                }

                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 图片和视频id
            fun_data.imageId = fun_data.modify.ImgId;

            // 修改模块表单
            let form = $('#modify-module form');
            // 标题
            // form.find('input[name=name]').val(fun_data.modify.Name);
            // 描述
            // form.find('input[name=description]').val(fun_data.modify.Description);

            // 详细信息
            // setTimeout(function () {
            //     if(fun_data.modify.RichText) {
            //         fun_data.ue.setContent(Base.decode(fun_data.modify.RichText));
            //     }
            // }, 500);

            // LOGO封面
            let $img_box = form.find('.img-box');
            $img_box.empty();
            $img_box.append(`
                <div class="item">
                    <img class="origin-image show_resource_in_browser" title="查看大图" src="${fun_data.modify.ThumbnailUrl}" data-src="${fun_data.modify.ImgURL}" data-id="${fun_data.modify.ImgId}" alt="">
                    <span class="btn-close-origin">x</span>
                </div> 
            `);

            // 视频链接
            // let $plaint_text_box = form.find('.plaint-text-box');
            // $plaint_text_box.empty();
            // $plaint_text_box.append(`
            //     <div class="item">
            //         <span class="origin-link video-link show_resource_in_browser" title="查看视频" data-src="${fun_data.modify.VideoURL}">${fun_data.modify.VideoURL}</span>
            //         <span class="btn-close-origin">x</span>
            //     </div> 
            // `);

            // 点击图片资源的close按钮，移除这个数据
            form.find('.img-box .btn-close-origin').click((e) => {
                let $this = $(e.currentTarget);
                fun_data.imageId = null;
                $this.parent().remove();
            });
            // 点击视频链接右侧close按钮
            form.find('.plaint-text-box .btn-close-origin').click((e) => {
                let $this = $(e.currentTarget);
                fun_data.videoId = null;
                $this.parent().remove();
            });
        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            let Id = $this.data('modify').Id;
            layui.layer.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.home.video.delete,
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

        // 添加图片上传插件
        $("#add-image-uploader").plupload({
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
        // 添加视频上传
        $("#add-video-uploader").plupload({
            multi_selection: false,
            // General settings
            runtimes: 'html5,flash,silverlight,html4',
            // url: 'http://120.79.222.60/FileUpload',
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
        // 修改图片上传插件
        $("#modify-image-uploader").plupload({
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
        // 修改视频上传插件
        $("#modify-video-uploader").plupload({
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