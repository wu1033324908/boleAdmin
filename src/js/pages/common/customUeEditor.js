/**
 * @description 在百度富文本的基础上自定义一些按钮，例如插入图片，上传图片等
 * 需要引入：
 *  ··· jQuery ^1.11.0
 *  ··· layui ^2.2.5
 *  ··· 百度富文本ueEditor
 *  ··· 自定义的$.ImageShowList({opt})
 * @author zhengshenli
 * @createAt 2018-01-10
 * @example $('#editor').CustomUeEditor({opt})
 */
var _HOST = require('tool/host');;
(function ($, window, document, undefined) {
    var option = {
        button: {
            // 是否有选择图片按钮
            chooseImage: {
                ajax: {
                    url: '',
                    type: 'POST',
                    data: null,
                    async: false
                }
            },
            // 是否有上传图片按钮
            uploadImage: true
        }

    }

    function CustomUeEditor(ele, opt) {
        this.option = {};
        $.extend(true, this.option, option, opt);

        // 当前的editor的jQuery对象
        this.$ele = ele;
        // 存放自定义按钮jQuery对象
        this.buttonsContainer = {};

        this.init();
    }


    CustomUeEditor.prototype.construct = CustomUeEditor;

    CustomUeEditor.prototype.buttonsEventListener = function () {
        let _this = this;

        // // 设置高度
        // if (_this.buttonsContainer.$btn_set_height) {
        //     _this.buttonsContainer.$btn_set_height.on('click', function () {
        //         _this.ue.setHeight(300);
        //     });
        // }

        // 插入图片
        if (_this.buttonsContainer.$btn_insert_image) {
            _this.buttonsContainer.$btn_insert_image.on('click', function () {
                console.log(_this)
                _this.ImageShowList = $.ImageShowList({
                    ue: _this.ue,
                    ajax: _this.option.button.chooseImage.ajax
                });
            });
        }
        if (_this.buttonsContainer.$btn_upload_image) {
            _this.buttonsContainer.$btn_upload_image.on('click', function () {
                console.log(_this)
                var image = [];
                layui.layer.open({
                    type: 0,
                    title: '上传图片并添加到富文本',
                    content: `
                        <div class="layui-form-item">
                            <label class="col col-sm-3 label-control">上传图片到富文本中</label>
                            <div class="col col-sm-9">
                                <div id="add-image-to-richtext-uploader">
                                    <p>你的浏览器不支持上传，请更换为其他浏览器。</p>
                                </div>
                            </div>
                        </div>
                    `,
                    area: ['800px', '450px'],
                    offset: '20%',
                    maxmin: false,
                    // anim: 2,
                    //可以无限个按钮
                    btn: ['确定', '取消'],
                    success: (layero, index) => {
                        // layui.layer.full(index);
                        $("#add-image-to-richtext-uploader").plupload({
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
                        $('#add-image-to-richtext-uploader').on('uploaded', function (upload, file) {
                            let response = JSON.parse(file.result.response);
                            console.log(response)
                            if (response.Result) {
                                let obj = {
                                    id: response.Id,
                                    url: response.Url
                                }
                                image.push(obj);
                            }
                        });
                        // formSubmit(fun_data);
                    },
                    yes: (index, layero) => {
                        image.forEach((ele, index) => {
                            _this.ue.execCommand('insertHtml', `<img src="${ele.url}">`);
                        })
                        console.log(image)
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    },
                    cancel: (index, layero) => {
                        layui.layer.close(index);
                    }
                });
            });
        }
    }

    /**
     * @description 初始化
     */
    CustomUeEditor.prototype.init = function () {
        let _this = this;

        _this.ue = UE.getEditor(_this.$ele.attr('id'));

        // 创建editor的wrap
        _this.$ele.wrap(`<div class="ue-editor-wrap"></div>`);
        _this.$wrap = _this.$ele.parent();

        // 创建一个按钮组container
        _this.$wrap.append(`<div class="ue-editor-btns-container" style="margin-top: 19px;"></div>`);
        _this.$btn_container = _this.$wrap.find('.ue-editor-btns-container');

        // 默认按钮组container中的按钮
        // _this.$btn_container.append(`<button type="button" class="btn btn-primary btn-sm btn-set-height">设置高度为300</button>`);
        // _this.buttonsContainer.$btn_set_height = _this.$btn_container.find('.btn-set-height');


        // 是否显示选择图片按钮
        if (_this.option.button.chooseImage) {
            if (typeof _this.option.button.chooseImage === 'object' && _this.option.button.chooseImage.hasOwnProperty('className')) {
                _this.$btn_container.append(`<button type="button" class="btn-insert-image ${_this.option.button.chooseImage.className}">选择图片</button>`)
            } else if (_this.option.button.chooseImage) {
                _this.$btn_container.append(`<button type="button" class="btn-insert-image">选择图片</button>`)
            }
            _this.buttonsContainer.$btn_insert_image = _this.$btn_container.find('.btn-insert-image');
        }
        // 是否显示上传按钮
        if (_this.option.button.uploadImage) {
            if (typeof _this.option.button.uploadImage === 'object' && _this.option.button.uploadImage.hasOwnProperty('className')) {
                _this.$btn_container.append(`<button type="button" class="btn-upload-image ${_this.option.button.uploadImage.className}">上传图片</button>`)
            } else if (_this.option.button.uploadImage) {
                _this.$btn_container.append(`<button type="button" class="btn-upload-image">上传图片</button>`)
            }
            _this.buttonsContainer.$btn_upload_image = _this.$btn_container.find('.btn-upload-image');
        }

        // 初始化完毕后，添加按钮的监听事件
        _this.buttonsEventListener();
    }

    $.fn.CustomUeEditor = function (opt) {
        return new CustomUeEditor($(this), opt);
    }
})(jQuery, Window, Document);


/**
 * @description 在layer弹出层中显示图片列表，选择成功后将图片插入到百度富文本中
 * 需要引入：
 *  ··· jQuery ^1.11.0
 *  ··· layui ^2.2.5
 * @author zhengshenli
 * @createAt 2018-01-10
 * @example $.ImageShowList({opt})
 * 
 */
;
(function ($, window, document, undefined) {
    var option = {
        //显示在选择组件上的图片数组
        resultList: null,
        //已选择的图片id
        idList: [],
        //已选择的图片url
        srcList: [],

        // 是否开启分页
        isPaging: true,
        // 分页参数
        paging: {
            //每页开始显示的数据下标
            start: 0,
            //每页显示几条数据
            length: 10,
            // 总共的数据
            recordTotal: 100
        },
        // 请求服务器的参数
        ajax: {
            url: '',
            type: 'POST',
            data: {}
        },
        // 是否能搜索
        isSearch: true,
        // 是否有加载中提示
        isLoading: true,
        // 是否开始分页
        isPaging: true
    }

    // 当前new的对象
    var _layer = layui.layer;

    function ImageShowList(opt) {
        this.option = {};
        $.extend(true, this.option, option, opt);
        this.$ele = null;
        // 最终选择的图片Id
        this.resultIdList = [];
        // 最终选择的图片src
        this.resultSrcList = [];
        console.log(this.option)
        this.init();
    }

    ImageShowList.prototype.construct = ImageShowList;

    /**
     * @description 请求服务器数据
     */
    ImageShowList.prototype.getImageData = function () {
        let _this = this;
        console.log(_this.option.ajax)
        // _this.option.ajax.data['start'] = _this.option.paging.start;
        // _this.option.ajax.data['length'] = _this.option.paging.length;

        $.ajax({
            url: _this.option.ajax.url,
            type: _this.option.ajax.type,
            data: _this.option.ajax.data,
            async: false,
            success: function (res) {
                console.log(res)
                if (res.Result) {
                    _this.resultList = res.Data;

                    _this.createImageList();
                }
            }
        })
    }

    /**
     * @description 初始化
     */
    ImageShowList.prototype.init = function () {
        let _this = this;

        // layer content，整个图片选择器的容器
        var content = `
            <div class="image-show-list-wrap">
                <div class="image-show-container">
                    <div class="list">
                        
                    </div>
                </div>
                <div class="pagigate-container">
                    <div class="pagigate-info"></div>
                    <div class="inner"></div>
                </div>
            </div>
        `;

        _layer.open({
            type: 1,
            title: '选择图片',
            content: content,
            area: '80%',
            maxmin: true,
            // 设置在顶部显示
            offset: 't',
            anim: 2,
            success: (layero, index) => {

                // image list
                _this.$imageList = layero.find('.image-show-container .list');
                // pagigate
                _this.$pagigate = layero.find('.pagigate-container');

                // 获取数据
                _this.getImageData();

                // 创建分页，全局只创建一次
                _this.createPagigate();

                // 创建图片的监听事件，全局只创建一次
                _this.imageItemEventListener();
            },
            btn: ['确认', '取消'],
            yes: function (index, layero) {
                for (let i in _this.resultSrcList) {
                    _this.option.ue.execCommand('insertHtml', `<img src="${_HOST.root}${_this.resultSrcList[i]}" width="100%">`);
                }
                _layer.close(index);
            },
            cancel: (index, layero) => {
                // $('.layer-content-molude').css('display', 'none');
                console.log(layero)
                _layer.close(index);
            }
        })

    }

    /**
     * @description 创建图片列表，在亲求数据成功后调用
     */
    ImageShowList.prototype.createImageList = function () {
        let _this = this;
        // 清空列表
        _this.$imageList.empty();
        // 创建列表
        for (let i in _this.resultList) {
            _this.$imageList.append(`
                <div class="item" data-id="${_this.resultList[i].Name}" data-src="${_this.resultList[i].Url}">
                    <img src="${_HOST.root}${_this.resultList[i].Url}">
                    <div class="name" title="${_this.resultList[i].Name}">${_this.resultList[i].Name}</div>
                </div>
            `);
        }
    }

    /**
     * @description 列表分页,在layer初始化成功后创建，只调用一次
     */
    ImageShowList.prototype.createPagigate = function () {
        let _this = this;
        layui.laypage.render({
            elem: _this.$pagigate.find('.inner')[0],
            count: _this.option.paging.recordTotal,
            limit: _this.option.paging.length,
            theme: '#1E9FFF',
            layout: ['prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj) {
                console.log(obj)
                // 设置每页显示的数据条数
                _this.option.paging.length = obj.limit;
                // 设置选择的页数
                _this.option.paging.start = (obj.curr - 1) * _this.option.paging.length;
                // 设置列表info
                _this.$pagigate.find('.pagigate-info').html(`从第 ${_this.option.paging.start} 项 到 第 ${_this.option.paging.start + _this.option.paging.length} 项 共 ${_this.option.paging.recordTotal} 项`)
                // 请求数据
                _this.getImageData();
            }
        });
    }

    /**
     * @description 图片列表的监听事件，在layer创建成功后调用，只调用一次
     */
    ImageShowList.prototype.imageItemEventListener = function () {
        let _this = this;
        // 鼠标点击事件
        _this.$imageList.on('click', '.item', function () {
            console.log($(this))
            $(this).toggleClass('active');

            // 如果当前item被选中
            if ($(this).hasClass('active')) {
                _this.resultIdList.push($(this).data('id'));
                _this.resultSrcList.push($(this).data('src'));
            } else {
                for (var i in _this.resultIdList) {
                    if (_this.resultIdList[i] === $(this).data('id')) {
                        _this.resultIdList.splice(i, 1);
                        break;
                    }
                }
                for (var i in _this.resultSrcList) {
                    if (_this.resultSrcList[i] === $(this).data('src')) {
                        _this.resultSrcList.splice(i, 1);
                        break;
                    }
                }
            }
            console.log(_this.resultIdList);
        });
    }



    $.ImageShowList = function (opt) {
        return new ImageShowList(opt);
    }
})(jQuery, Window, Document);